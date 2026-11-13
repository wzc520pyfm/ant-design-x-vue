/**
 * Catalog 管理模块
 * 用于加载和管理远程/本地组件定义
 */

/** Catalog 组件定义 */
export interface CatalogComponent {
  type: 'object';
  allOf?: any[];
  properties?: Record<string, any>;
  required?: string[];
  [key: string]: any;
}

/** Catalog 定义 */
export interface Catalog {
  $schema?: string;
  $id?: string;
  title?: string;
  description?: string;
  catalogId?: string;
  components?: Record<string, CatalogComponent>;
  functions?: Record<string, any>;
  $defs?: Record<string, any>;
}

/**
 * A catalog store scoped to one Box/app. Remote catalogs fetched through a
 * scoped registry never leak into another Box or SSR request.
 */
export interface CatalogRegistry {
  register(catalog: Catalog): string | undefined;
  get(catalogId: string): Catalog | undefined;
  has(catalogId: string): boolean;
  set(catalogId: string, catalog: Catalog): void;
  clear(): void;
}

export function createCatalogRegistry(): CatalogRegistry {
  const store = new Map<string, Catalog>();
  return {
    register(catalog) {
      const catalogId = catalog.$id || catalog.catalogId;
      if (!catalogId) return undefined;
      store.set(catalogId, catalog);
      return catalogId;
    },
    get(catalogId) {
      return store.get(catalogId);
    },
    has(catalogId) {
      return store.has(catalogId);
    },
    set(catalogId, catalog) {
      store.set(catalogId, catalog);
    },
    clear() {
      store.clear();
    },
  };
}

export interface CatalogFetchOptions {
  /** Registry used for lookup and caching. Defaults to the module-level one. */
  registry?: CatalogRegistry;
  /** Custom fetch, e.g. a server-side fetch with an egress proxy. */
  fetch?: typeof fetch;
  /** Explicitly allow loopback/private/internal hosts. Defaults to false. */
  allowInternalHosts?: boolean;
  /**
   * Hostnames or origins that bypass the internal-host checks, e.g.
   * `catalog.example.com`, `*.example.com` or `https://catalog.example.com`.
   */
  allowedHosts?: string[];
}

/** Explicitly registered catalogs, shared across callers by design. */
const registeredCatalogs = createCatalogRegistry();
/** Backwards-compatible cache for loadCatalog() calls without a registry. */
const defaultCache = createCatalogRegistry();

/**
 * 注册本地 catalog
 * @param catalog catalog 定义
 */
export function registerCatalog(catalog: Catalog): void {
  registeredCatalogs.register(catalog);
}

const REDIRECT_STATUS = new Set([301, 302, 303, 307, 308]);
const MAX_REDIRECTS = 5;

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'metadata.google.internal',
  'metadata.goog',
  'instance-data',
  'instance-data.ec2.internal',
]);

function isNodeRuntime(): boolean {
  return (
    typeof window === 'undefined' &&
    typeof process !== 'undefined' &&
    !!process.versions?.node
  );
}

function normalizeHost(hostname: string): string {
  return hostname
    .replace(/^\[|\]$/g, '')
    .toLowerCase()
    .split('%')[0];
}

function isIPv4(value: string): boolean {
  return /^\d{1,3}(?:\.\d{1,3}){3}$/.test(value);
}

function isPrivateIPv4(value: string): boolean {
  const parts = value.split('.').map(Number);
  if (
    parts.length !== 4 ||
    parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)
  ) {
    return true;
  }
  const [a, b, c] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0 && c === 0) ||
    (a === 192 && b === 0 && c === 2) ||
    (a === 198 && (b === 18 || b === 19)) ||
    (a === 198 && b === 51 && c === 100) ||
    (a === 203 && b === 0 && c === 113) ||
    a >= 224
  );
}

function ipv4FromMappedIPv6(value: string): string | undefined {
  const dotted = value.match(/(\d{1,3}(?:\.\d{1,3}){3})$/);
  if (dotted && value.includes(':')) return dotted[1];

  const hex = value.match(/::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (hex) {
    const hi = parseInt(hex[1], 16);
    const lo = parseInt(hex[2], 16);
    return `${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`;
  }
  return undefined;
}

function isPrivateIPv6(value: string): boolean {
  const mapped = ipv4FromMappedIPv6(value);
  if (mapped) return isPrivateIPv4(mapped);
  if (value === '::' || value === '::1') return true;
  if (value.startsWith('fc') || value.startsWith('fd')) return true;
  // Link-local and deprecated site-local ranges.
  if (value.startsWith('fe')) return true;
  if (value.startsWith('ff')) return true;
  if (value.startsWith('2001:db8')) return true;
  return false;
}

function isPrivateAddress(address: string): boolean {
  const value = normalizeHost(address);
  if (isIPv4(value)) return isPrivateIPv4(value);
  if (value.includes(':')) return isPrivateIPv6(value);
  return false;
}

function isBlockedHostname(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return (
    BLOCKED_HOSTNAMES.has(host) ||
    host === 'ip6-localhost' ||
    host === 'ip6-loopback' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host.endsWith('.localdomain') ||
    host.endsWith('.internal')
  );
}

function isAllowedHost(url: URL, allowedHosts?: string[]): boolean {
  if (!allowedHosts?.length) return false;
  const hostname = normalizeHost(url.hostname);
  const host = url.host.toLowerCase();
  const origin = url.origin.toLowerCase();

  return allowedHosts.some((entry) => {
    const value = entry.trim().toLowerCase();
    if (!value) return false;

    if (value.includes('://')) {
      try {
        return new URL(value).origin.toLowerCase() === origin;
      } catch {
        return false;
      }
    }

    if (value.startsWith('*.')) {
      const suffix = value.slice(2);
      return hostname === suffix || hostname.endsWith(`.${suffix}`);
    }

    return hostname === normalizeHost(value) || host === value;
  });
}

async function assertCatalogUrlAllowed(
  catalogId: string,
  options?: CatalogFetchOptions,
): Promise<void> {
  let url: URL;
  try {
    url = new URL(catalogId);
  } catch {
    throw new Error(`Invalid catalog URL "${catalogId}".`);
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(
      `Unsupported catalog URL "${catalogId}". Only http:// and https:// catalogs can be loaded.`,
    );
  }

  if (
    options?.allowInternalHosts ||
    isAllowedHost(url, options?.allowedHosts)
  ) {
    return;
  }

  const hostname = normalizeHost(url.hostname);
  if (isBlockedHostname(hostname) || isPrivateAddress(hostname)) {
    throw new Error(
      `Blocked catalog URL "${catalogId}": internal or private hosts are not allowed.`,
    );
  }

  if (!isNodeRuntime() || isIPv4(hostname) || hostname.includes(':')) {
    return;
  }

  try {
    // Resolve the host on the server so a public hostname pointing at an
    // internal address (including metadata endpoints) is rejected.
    const dnsModule = 'node:dns/promises';
    const dns = await import(/* @vite-ignore */ dnsModule);
    const records = await dns.lookup(hostname, { all: true, verbatim: true });
    if (
      !records.length ||
      records.some((record: { address: string }) =>
        isPrivateAddress(record.address),
      )
    ) {
      throw new Error(
        `Blocked catalog URL "${catalogId}": host resolves to a private address.`,
      );
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith('Blocked catalog URL')
    ) {
      throw error;
    }
    throw new Error(`Unable to resolve catalog host "${hostname}".`);
  }
}

async function fetchCatalogResponse(
  catalogId: string,
  options?: CatalogFetchOptions,
): Promise<Response> {
  const fetchImpl = options?.fetch ?? fetch;
  const manualRedirects = isNodeRuntime();
  let current = catalogId;

  for (
    let redirectCount = 0;
    redirectCount <= MAX_REDIRECTS;
    redirectCount += 1
  ) {
    const response = await fetchImpl(current, {
      redirect: manualRedirects ? 'manual' : 'follow',
    });

    if (response.url && response.url !== current) {
      // A custom fetch may follow redirects itself; validate the final URL too.
      await assertCatalogUrlAllowed(response.url, options);
    }

    if (manualRedirects && REDIRECT_STATUS.has(response.status)) {
      const location = response.headers.get('location');
      if (!location) {
        throw new Error(
          `Catalog redirect from ${current} is missing a Location header.`,
        );
      }
      const next = new URL(location, current).toString();
      await assertCatalogUrlAllowed(next, options);
      current = next;
      continue;
    }

    return response;
  }

  throw new Error(
    `Too many redirects while loading catalog from ${catalogId}.`,
  );
}

/**
 * 加载 catalog（支持远程 URL 或本地注册的 schema）
 * @param catalogId catalog 的 URL 或本地 ID
 * @param options scoped registry and URL access policy
 * @returns catalog 定义
 */
export async function loadCatalog(
  catalogId: string,
  options?: CatalogFetchOptions,
): Promise<Catalog> {
  const registry = options?.registry;
  const scoped = registry?.get(catalogId);
  if (scoped) {
    return scoped;
  }

  // Explicitly registered catalogs are shared by design (registerCatalog).
  const registered = registeredCatalogs.get(catalogId);
  if (registered) {
    return registered;
  }

  // The global remote cache is only used by calls without a scoped registry,
  // so a Box can never reuse a catalog fetched by another app.
  if (!registry) {
    const cached = defaultCache.get(catalogId);
    if (cached) {
      return cached;
    }
  }

  // 检查是否是本地 schema
  if (catalogId.startsWith('local://')) {
    console.warn(
      `Local catalog "${catalogId}" not registered. Use registerCatalog() to register it.`,
    );
    // 返回空 catalog
    return {
      $id: catalogId,
      components: {},
    };
  }

  await assertCatalogUrlAllowed(catalogId, options);

  // 从远程加载
  try {
    const response = await fetchCatalogResponse(catalogId, options);
    if (!response.ok) {
      throw new Error(
        `Failed to load catalog from ${catalogId}: ${response.statusText}`,
      );
    }

    const catalog: Catalog = await response.json();
    (registry ?? defaultCache).set(catalogId, catalog);
    return catalog;
  } catch (error) {
    console.error('Error loading catalog:', error);
    throw error;
  }
}

/**
 * 验证组件是否符合 catalog 定义
 * @param catalog catalog 定义
 * @param componentName 组件名称
 * @param componentProps 组件属性
 * @returns 是否有效
 */
export function validateComponent(
  catalog: Catalog,
  componentName: string,
  componentProps: Record<string, any>,
): boolean {
  const componentDef = catalog.components?.[componentName];
  if (!componentDef) {
    console.warn(`Component "${componentName}" not found in catalog`);
    return false;
  }

  // 简单的必填字段验证
  if (componentDef.required) {
    for (const field of componentDef.required) {
      if (!(field in componentProps)) {
        console.warn(
          `Missing required field "${field}" for component "${componentName}"`,
        );
        return false;
      }
    }
  }

  return true;
}

/**
 * 获取组件的属性定义
 * @param catalog catalog 定义
 * @param componentName 组件名称
 * @returns 属性定义
 */
export function getComponentPropsSchema(
  catalog: Catalog,
  componentName: string,
): Record<string, any> | undefined {
  return catalog.components?.[componentName]?.properties;
}

/**
 * 清除默认 catalog 缓存与全局注册表。Scoped registries created by Box can be
 * cleared through `registry.clear()`.
 */
export function clearCatalogCache(): void {
  registeredCatalogs.clear();
  defaultCache.clear();
}
