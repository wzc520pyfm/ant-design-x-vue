import Prism from 'prismjs';

/** Map common aliases (react-syntax-highlighter style) to Prism component ids. */
const LANG_ALIASES: Record<string, string> = {
  html: 'markup',
  xml: 'markup',
  svg: 'markup',
  mathml: 'markup',
  ssml: 'markup',
  atom: 'markup',
  rss: 'markup',
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  sh: 'bash',
  shell: 'bash',
  yml: 'yaml',
  md: 'markdown',
  vue: 'markup',
  plaintext: 'plain',
  txt: 'plain',
  text: 'plain',
};

/**
 * Static import table so bundlers can resolve the grammar chunks.
 * A template-string import is invisible to Vite and fails in the browser.
 */
const PRISM_COMPONENT_LOADERS: Record<string, () => Promise<unknown>> = {
  markup: () => import('prismjs/components/prism-markup'),
  'markup-templating': () => import('prismjs/components/prism-markup-templating'),
  css: () => import('prismjs/components/prism-css'),
  clike: () => import('prismjs/components/prism-clike'),
  javascript: () => import('prismjs/components/prism-javascript'),
  typescript: () => import('prismjs/components/prism-typescript'),
  jsx: () => import('prismjs/components/prism-jsx'),
  tsx: () => import('prismjs/components/prism-tsx'),
  json: () => import('prismjs/components/prism-json'),
  bash: () => import('prismjs/components/prism-bash'),
  python: () => import('prismjs/components/prism-python'),
  java: () => import('prismjs/components/prism-java'),
  c: () => import('prismjs/components/prism-c'),
  cpp: () => import('prismjs/components/prism-cpp'),
  csharp: () => import('prismjs/components/prism-csharp'),
  go: () => import('prismjs/components/prism-go'),
  rust: () => import('prismjs/components/prism-rust'),
  ruby: () => import('prismjs/components/prism-ruby'),
  sql: () => import('prismjs/components/prism-sql'),
  yaml: () => import('prismjs/components/prism-yaml'),
  markdown: () => import('prismjs/components/prism-markdown'),
  diff: () => import('prismjs/components/prism-diff'),
  docker: () => import('prismjs/components/prism-docker'),
  graphql: () => import('prismjs/components/prism-graphql'),
  scss: () => import('prismjs/components/prism-scss'),
  less: () => import('prismjs/components/prism-less'),
  php: () => import('prismjs/components/prism-php'),
  swift: () => import('prismjs/components/prism-swift'),
  kotlin: () => import('prismjs/components/prism-kotlin'),
  objectivec: () => import('prismjs/components/prism-objectivec'),
  r: () => import('prismjs/components/prism-r'),
  scala: () => import('prismjs/components/prism-scala'),
  wasm: () => import('prismjs/components/prism-wasm'),
};

const loaded = new Set<string>();
let fullPrismPromise: Promise<void> | null = null;

export function resolvePrismLang(lang: string): string {
  const lower = lang.toLowerCase();
  return LANG_ALIASES[lower] || lower;
}

async function loadPrismComponent(id: string): Promise<void> {
  const loader = PRISM_COMPONENT_LOADERS[id];
  if (loader) {
    await loader();
    return;
  }

  // Rare grammars keep the dynamic fallback for bundlers with context-module
  // support. Common languages above are statically visible to Vite and Rollup.
  await import(/* @vite-ignore */ `prismjs/components/prism-${id}.js`);
}

export async function ensurePrismLanguage(lang: string, prismLightMode: boolean): Promise<string> {
  const prismLang = resolvePrismLang(lang);

  if (!prismLightMode) {
    if (!fullPrismPromise) {
      // Full Prism: pull a broad set of common languages once.
      // Load base grammars first (order matters: php/jsx depend on markup/clike).
      fullPrismPromise = (async () => {
        const core = ['markup', 'markup-templating', 'css', 'clike', 'javascript'];
        const rest = [
          'typescript',
          'jsx',
          'tsx',
          'json',
          'bash',
          'python',
          'java',
          'c',
          'cpp',
          'csharp',
          'go',
          'rust',
          'ruby',
          'sql',
          'yaml',
          'markdown',
          'diff',
          'docker',
          'graphql',
          'scss',
          'less',
          'php',
          'swift',
          'kotlin',
          'objectivec',
          'r',
          'scala',
          'wasm',
        ];

        async function loadOne(id: string) {
          if (loaded.has(id) || Prism.languages[id]) {
            loaded.add(id);
            return;
          }
          try {
            await loadPrismComponent(id);
            loaded.add(id);
          } catch {
            // ignore missing optional langs
          }
        }

        for (const id of core) {
          await loadOne(id);
        }
        await Promise.all(rest.map(loadOne));
      })();
    }
    await fullPrismPromise;
    return prismLang;
  }

  if (prismLang === 'plain' || loaded.has(prismLang) || Prism.languages[prismLang]) {
    loaded.add(prismLang);
    return prismLang;
  }

  // Dependencies some languages need
  const deps: Record<string, string[]> = {
    javascript: ['clike'],
    typescript: ['clike', 'javascript'],
    jsx: ['markup', 'javascript'],
    tsx: ['jsx', 'typescript'],
    css: [],
    scss: ['css'],
    less: ['css'],
    java: ['clike'],
    c: ['clike'],
    cpp: ['c'],
    csharp: ['clike'],
    php: ['markup', 'markup-templating', 'clike'],
    ruby: ['clike'],
    go: ['clike'],
    kotlin: ['clike'],
    scala: ['java'],
    objectivec: ['c'],
    swift: ['clike'],
  };

  const need = deps[prismLang] || [];
  for (const dep of need) {
    if (!loaded.has(dep) && !Prism.languages[dep]) {
      try {
        await loadPrismComponent(dep);
        loaded.add(dep);
      } catch (error) {
        console.warn(`[CodeHighlighter] Failed to load language dependency: ${dep}`, error);
      }
    } else {
      loaded.add(dep);
    }
  }

  try {
    await loadPrismComponent(prismLang);
    loaded.add(prismLang);
  } catch (error) {
    console.warn(`[CodeHighlighter] Failed to load language: ${prismLang}`, error);
  }

  if (!Prism.languages[prismLang]) {
    console.warn(`[CodeHighlighter] Failed to load language: ${prismLang}`);
  }

  return prismLang;
}

export function highlightCode(code: string, prismLang: string): string {
  if (!prismLang || prismLang === 'plain' || !Prism.languages[prismLang]) {
    return Prism.util.encode(code) as unknown as string;
  }
  try {
    return Prism.highlight(code, Prism.languages[prismLang], prismLang);
  } catch (error) {
    console.warn(`[CodeHighlighter] Failed to highlight language: ${prismLang}`, error);
    return Prism.util.encode(code) as unknown as string;
  }
}

/** Test helper */
export function __resetLanguageCacheForTests() {
  loaded.clear();
  fullPrismPromise = null;
}
