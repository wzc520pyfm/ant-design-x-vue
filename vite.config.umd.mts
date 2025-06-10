import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import VueMacros from 'unplugin-vue-macros/vite'
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

const externals = ['vue', 'ant-design-vue'];

export default defineConfig({
  plugins: [
    VueMacros({
      plugins: {
        vue: vue(),
        vueJsx: vueJsx(),
      },
      // 覆盖插件选项
    }),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'antdx',
      formats: ['umd'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [...externals, /^ant-design-vue/],
      output: [
        {
          format: 'umd',
          dir: 'dist',
          inlineDynamicImports: true,
          name: 'antdx',
          entryFileNames: '[name].umd.js',
          globals: { vue: 'Vue', 'ant-design-vue': 'antd' },
        },
      ],
    },
    outDir: 'dist',
  },
  resolve: {
    dedupe: ['vue', 'ant-design-vue'],
  },
  optimizeDeps: {
    include: [...externals],
  },
});
