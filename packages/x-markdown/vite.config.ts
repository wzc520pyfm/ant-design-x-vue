import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import VueMacros from 'unplugin-vue-macros/vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    VueMacros({
      plugins: {
        vue: vue(),
        vueJsx: vueJsx(),
      },
    }),
    dts({
      include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
      outDir: 'dist',
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'plugins/highlight-code': resolve(__dirname, 'src/plugins/HighlightCode/index.ts'),
        'plugins/latex': resolve(__dirname, 'src/plugins/Latex/index.ts'),
        'plugins/mermaid': resolve(__dirname, 'src/plugins/Mermaid/index.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      external: ['vue', 'ant-design-vue', /^ant-design-vue\//],
      output: {
        globals: {
          vue: 'Vue',
          'ant-design-vue': 'antd',
        },
      },
    },
    outDir: 'dist',
  },
});
