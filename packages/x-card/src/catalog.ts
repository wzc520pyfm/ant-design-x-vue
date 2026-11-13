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
  /**
   * Custom fetch / transport. When provided, it is responsible for DNS
   * rebinding and redirect protections; the built-in Node transport pins the
   * validated address instead.
   */
  fetch?: typeof fetch;
  /** Explicitly allow loopback/private/internal hosts. Defaults to false. */
  allowInternalHosts?: boolean;
  /**
   * Hostnames or origins that bypass the internal-host checks, e.g.
   * `catalog.example.com`, `*.example.com` or `https://catalog.example.com`.
   */
  allowedHosts?: string[];
  /** Request timeout for the built-in Node transport. Defaults to 30s. */
  requestTimeoutMs?: number;
  /** Maximum response size for the built-in Node transport. Defaults to 5 MiB. */
  maxResponseBytes?: number;
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
const DEFAULT_REQUEST_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_RESPONSE_BYTES = 5 * 1024 * 1024;

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
  if (value === '168.63.129.16') return true;
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

function expandIPv6(value: string): number[] | undefined {
  let normalized = value;
  const ipv4Match = normalized.match(/(\d{1,3}(?:\.\d{1,3}){3})$/);
  if (ipv4Match) {
    const parts = ipv4Match[1].split('.').map(Number);
    if (
      parts.length !== 4 ||
      parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)
    ) {
      return undefined;
    }
    const hi = ((parts[0] << 8) | parts[1]).toString(16);
    const lo = ((parts[2] << 8) | parts[3]).toString(16);
    normalized = normalized.slice(0, -ipv4Match[1].length) + `${hi}:${lo}`;
  }

  const halves = normalized.split('::');
  if (halves.length > 2) return undefined;
  const head = halves[0] ? halves[0].split(':') : [];
  const tail = halves.length === 2 && halves[1] ? halves[1].split(':') : [];
  const missing = 8 - head.length - tail.length;
  if (missing < 0 || (halves.length === 2 && missing < 1)) return undefined;
  if (halves.length === 1 && missing !== 0) return undefined;
  if (![...head, ...tail].every((part) => /^[0-9a-f]{1,4}$/i.test(part))) {
    return undefined;
  }

  const parts = [...head, ...Array(missing).fill('0'), ...tail];
  if (parts.length !== 8) return undefined;
  return parts.map((part) => parseInt(part, 16));
}

function ipv4FromNat64IPv6(value: string): string | undefined {
  const groups = expandIPv6(value);
  if (!groups || groups[0] !== 0x64 || groups[1] !== 0xff9b) {
    return undefined;
  }
  // Well-known NAT64 prefix 64:ff9b::/96 has the IPv4 address in the last
  // 32 bits. 64:ff9b:1::/48 is local-use and blocked separately.
  if (groups[2] !== 0) return undefined;
  return `${groups[6] >> 8}.${groups[6] & 255}.${groups[7] >> 8}.${
    groups[7] & 255
  }`;
}

function isPrivateIPv6(value: string): boolean {
  const mapped = ipv4FromMappedIPv6(value);
  if (mapped) return isPrivateIPv4(mapped);
  if (value === '::' || value === '::1') return true;
  if (value.startsWith('64:ff9b:1')) return true;
  const nat64 = ipv4FromNat64IPv6(value);
  if (nat64) return isPrivateIPv4(nat64);
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

interface CatalogTarget {
  url: URL;
  /** Address pinned for the Node transport. */
  address?: string;
  family?: number;
}

interface CatalogResponse {
  ok: boolean;
  status: number;
  statusText: string;
  url: string;
  headers: { get(name: string): string | null };
  json(): Promise<unknown>;
  body?: { cancel?: () => Promise<void> } | null;
}

async function resolveCatalogTarget(
  catalogId: string,
  options?: CatalogFetchOptions,
): Promise<CatalogTarget> {
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
    return { url };
  }

  const hostname = normalizeHost(url.hostname);
  if (isBlockedHostname(hostname) || isPrivateAddress(hostname)) {
    throw new Error(
      `Blocked catalog URL "${catalogId}": internal or private hosts are not allowed.`,
    );
  }

  if (isIPv4(hostname)) {
    return { url, address: hostname, family: 4 };
  }
  if (hostname.includes(':')) {
    return { url, address: hostname, family: 6 };
  }
  if (!isNodeRuntime()) {
    return { url };
  }

  try {
    // Resolve on the server and pin the validated address in the transport, so
    // a second lookup during connection setup cannot reach a private address.
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
    const first = records[0];
    return { url, address: first.address, family: first.family };
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

async function cancelResponseBody(response: CatalogResponse): Promise<void> {
  try {
    await response.body?.cancel?.();
  } catch {
    /* ignore cleanup errors */
  }
}

/**
 * @internal Build Node request options with the validated address pinned, while
 * preserving the original hostname for HTTP Host and TLS SNI.
 */
export function createPinnedRequestOptions(
  url: URL,
  address?: string,
  family?: number,
): Record<string, unknown> {
  const isHttps = url.protocol === 'https:';
  const options: Record<string, unknown> = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'accept-encoding': 'identity',
    },
  };

  if (address) {
    options.lookup = (
      _hostname: string,
      lookupOptions: { all?: boolean } | undefined,
      callback: (error: Error | null, ...result: unknown[]) => void,
    ) => {
      const resolvedFamily = family ?? (address.includes(':') ? 6 : 4);
      if (lookupOptions?.all) {
        callback(null, [{ address, family: resolvedFamily }]);
      } else {
        callback(null, address, resolvedFamily);
      }
    };
    const hostname = normalizeHost(url.hostname);
    if (isHttps && !isIPv4(hostname) && !hostname.includes(':')) {
      options.servername = hostname;
    }
  }

  return options;
}

async function fetchPinnedCatalog(
  target: CatalogTarget,
  options?: CatalogFetchOptions,
): Promise<CatalogResponse> {
  const isHttps = target.url.protocol === 'https:';
  const moduleName = isHttps ? 'node:https' : 'node:http';
  const nodeHttp = await import(/* @vite-ignore */ moduleName);
  const request = nodeHttp.request ?? nodeHttp.default?.request;
  if (typeof request !== 'function') {
    throw new Error(`Unable to load the Node ${moduleName} transport.`);
  }

  const timeoutMs = options?.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;
  const maxBytes = options?.maxResponseBytes ?? DEFAULT_MAX_RESPONSE_BYTES;

  return new Promise<CatalogResponse>((resolve, reject) => {
    let deadline: ReturnType<typeof setTimeout> | undefined;
    let settled = false;
    let rejectBodyWith: ((error: Error) => void) | undefined;

    const clearDeadline = () => {
      if (deadline !== undefined) {
        clearTimeout(deadline);
        deadline = undefined;
      }
    };
    const fail = (error: Error) => {
      if (settled) return;
      settled = true;
      clearDeadline();
      reject(error);
    };

    const requestOptions = createPinnedRequestOptions(
      target.url,
      target.address,
      target.family,
    );

    const req = request(target.url, requestOptions, (res: any) => {
      const status = res.statusCode ?? 0;
      settled = true;
      resolve({
        ok: status >= 200 && status < 300,
        status,
        statusText: res.statusMessage ?? '',
        url: target.url.toString(),
        headers: {
          get(name: string) {
            const value = res.headers?.[name.toLowerCase()];
            return Array.isArray(value) ? value[0] ?? null : value ?? null;
          },
        },
        body: {
          cancel: async () => {
            clearDeadline();
            res.on('error', () => {});
            res.destroy();
          },
        },
        json: () =>
          new Promise((resolveBody, rejectBody) => {
            const chunks: Buffer[] = [];
            let total = 0;
            let bodySettled = false;

            const settleBody = (callback: () => void) => {
              if (bodySettled) return;
              bodySettled = true;
              rejectBodyWith = undefined;
              clearDeadline();
              callback();
            };
            rejectBodyWith = (error) => settleBody(() => rejectBody(error));

            res.on('data', (chunk: Buffer) => {
              if (bodySettled) return;
              total += chunk.length;
              if (total > maxBytes) {
                settleBody(() => {
                  rejectBody(
                    new Error(
                      `Catalog response exceeds the maximum size of ${maxBytes} bytes.`,
                    ),
                  );
                });
                res.destroy();
                return;
              }
              chunks.push(chunk);
            });
            res.on('end', () => {
              settleBody(() => {
                try {
                  resolveBody(
                    JSON.parse(Buffer.concat(chunks).toString('utf8')),
                  );
                } catch (error) {
                  rejectBody(error);
                }
              });
            });
            res.on('error', (error: Error) => {
              settleBody(() => rejectBody(error));
            });
          }),
      });
    });

    deadline = setTimeout(() => {
      const timeoutError = new Error(
        `Catalog request timed out after ${timeoutMs}ms.`,
      );
      rejectBodyWith?.(timeoutError);
      req.destroy(timeoutError);
    }, timeoutMs);
    (deadline as any).unref?.();
    req.on('error', fail);
    req.end();
  });
}

async function fetchWithImpl(
  url: string,
  fetchImpl: typeof fetch,
  manualRedirects: boolean,
): Promise<CatalogResponse> {
  const response = await fetchImpl(url, {
    redirect: manualRedirects ? 'manual' : 'follow',
  });
  return response as unknown as CatalogResponse;
}

async function fetchCatalogResponse(
  initialTarget: CatalogTarget,
  options?: CatalogFetchOptions,
): Promise<CatalogResponse> {
  const fetchImpl = options?.fetch;
  const node = isNodeRuntime();
  let target = initialTarget;

  for (
    let redirectCount = 0;
    redirectCount <= MAX_REDIRECTS;
    redirectCount += 1
  ) {
    const response = fetchImpl
      ? await fetchWithImpl(target.url.toString(), fetchImpl, node)
      : node
      ? await fetchPinnedCatalog(target, options)
      : await fetchWithImpl(target.url.toString(), fetch, false);

    if (response.url && response.url !== target.url.toString()) {
      // A custom fetch may follow redirects itself; validate the final URL too.
      await resolveCatalogTarget(response.url, options);
    }

    if (node && REDIRECT_STATUS.has(response.status)) {
      const location = response.headers.get('location');
      if (!location) {
        await cancelResponseBody(response);
        throw new Error(
          `Catalog redirect from ${target.url} is missing a Location header.`,
        );
      }

      let nextTarget: CatalogTarget;
      try {
        nextTarget = await resolveCatalogTarget(
          new URL(location, target.url).toString(),
          options,
        );
      } catch (error) {
        await cancelResponseBody(response);
        throw error;
      }

      await cancelResponseBody(response);
      target = nextTarget;
      continue;
    }

    return response;
  }

  throw new Error(
    `Too many redirects while loading catalog from ${initialTarget.url}.`,
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

  const target = await resolveCatalogTarget(catalogId, options);

  // 从远程加载
  try {
    const response = await fetchCatalogResponse(target, options);
    if (!response.ok) {
      await cancelResponseBody(response);
      throw new Error(
        `Failed to load catalog from ${catalogId}: ${response.statusText}`,
      );
    }

    const catalog = (await response.json()) as Catalog;
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
