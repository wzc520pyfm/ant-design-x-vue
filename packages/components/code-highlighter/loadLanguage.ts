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
  plaintext: 'plain',
  text: 'plain',
};

const loaded = new Set<string>();
let fullPrismPromise: Promise<void> | null = null;

export function resolvePrismLang(lang: string): string {
  const lower = lang.toLowerCase();
  return LANG_ALIASES[lower] || lower;
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
            await import(/* @vite-ignore */ `prismjs/components/prism-${id}.js`);
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
        await import(/* @vite-ignore */ `prismjs/components/prism-${dep}.js`);
        loaded.add(dep);
      } catch (error) {
        console.warn(`[CodeHighlighter] Failed to load language dependency: ${dep}`, error);
      }
    } else {
      loaded.add(dep);
    }
  }

  try {
    await import(/* @vite-ignore */ `prismjs/components/prism-${prismLang}.js`);
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
