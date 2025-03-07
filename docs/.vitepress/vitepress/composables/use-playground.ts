import stackblitzSdk from '@stackblitz/sdk';
import type { Project as StackBlitzProject } from '@stackblitz/sdk';
import pkg from '../../../../package.json' assert { type: 'json' };
import { isClient, MaybeRefOrGetter } from '@vueuse/core'
import { computed, toValue } from 'vue';

const pkgDependencyList = {
  ...pkg.dependencies,
  ...pkg.peerDependencies
}

interface Playground {
  title: MaybeRefOrGetter<string>;
  rawSource: MaybeRefOrGetter<string>;
  path: MaybeRefOrGetter<string>;
}

export function usePlayground({ title, rawSource, path }: Playground) {
  const dependencies = computed(() => toValue(rawSource).split(/\n/).reduce<Record<PropertyKey, string>>(
    (acc, line) => {
      const matches = line.match(/import .+? from '(.+)';\r?$/);
      if (matches?.[1]) {
        const paths = matches[1].split('/');
        const dep = paths[0].startsWith('@') ? `${paths[0]}/${paths[1]}` : paths[0];
        acc[dep] ??= pkgDependencyList[dep] ?? 'latest';
      }
      return acc;
    },
    {
      'ant-design-vue': pkgDependencyList['ant-design-vue'],
      'ant-design-x-vue': pkg.version
    },
  ));

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Vue + TS</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`
  const mainTsContent = `import { createApp } from 'vue'
import './style.css'
import Demo from './Demo.vue'

createApp(Demo).mount('#app')
`
  const styleCssContent = ``

  const demoVueContent = computed(() => `${decodeURIComponent(toValue(rawSource))}`)

  const tsconfig = {
    compilerOptions: {
      target: 'esnext',
      module: 'esnext',
      esModuleInterop: true,
      moduleResolution: 'bundler',
      jsx: "preserve",
      jsxImportSource: "vue",
    },
  };

  const packageJson = computed(() => ({
    "name": `${toValue(path).replaceAll('/', '-')}`,
    "private": true,
    "version": "0.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "vue-tsc -b && vite build",
      "preview": "vite preview"
    },
    "dependencies": {
      ...dependencies.value
    },
    "devDependencies": {
      "@vitejs/plugin-vue-jsx": pkg.devDependencies['@vitejs/plugin-vue-jsx'],
      "@vitejs/plugin-vue": pkg.devDependencies['@vitejs/plugin-vue'],
      "typescript": pkg.devDependencies.typescript,
      "vite": pkg.devDependencies.vite,
      "vue-tsc": pkg.devDependencies['vue-tsc'],
      'unplugin-vue-macros': pkg.devDependencies['unplugin-vue-macros']
    }
  }))

  const viteTsContent = `import { defineConfig } from 'vite'
import VueMacros from 'unplugin-vue-macros/vite'
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VueMacros({
      plugins: {
        vue: vue(),
        vueJsx: vueJsx(),
      }
    }),
  ],
})
`
  const vueEnvTsContent = `declare module '*.vue' {
  import { DefineComponent, MaybeRefOrGetter, toValue } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;

  export default component;
}
`


  const stackblitzPrefillConfig: StackBlitzProject = {
    title: `${toValue(title)} - antd-design-x-vue@${pkg.version}`,
    template: 'node',
    description: '',
    files: {
      [`src/style.css`]: styleCssContent,
      [`src/main.ts`]: mainTsContent,
      [`src/Demo.vue`]: demoVueContent.value,
      'index.html': html,
      'tsconfig.json': JSON.stringify(tsconfig, null, 2),
      'package.json': JSON.stringify(packageJson.value, null, 2),
      'vite.config.ts': viteTsContent,
      'vue.env.d.ts': vueEnvTsContent
    },
  };

  const onStackblitzPlayBtnClick = () => {
    if (!isClient) {
      return
    }
    stackblitzSdk.openProject(stackblitzPrefillConfig, {
      openFile: [`src/Demo.vue`],
    });
  }

  return {
    onStackblitzPlayBtnClick
  }
}
