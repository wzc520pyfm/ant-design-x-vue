import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import VueMacros from 'unplugin-vue-macros/vite'
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import terser from '@rollup/plugin-terser';

const externals = ['vue'];

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
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [...externals],
      output: [
        {
          format: 'umd',
          dir: 'dist',
          inlineDynamicImports: true,
          exports: 'named',
          name: 'antdx',
          entryFileNames: '[name].umd.js',
          globals: { vue: 'Vue' },
        },
        {
          format: 'es',
          dir: 'dist',
          inlineDynamicImports: true,
          exports: 'named',
          entryFileNames: '[name].esm.js',
          globals: { vue: 'Vue' },
        },
        {
          format: 'es',
          dir: 'dist',
          inlineDynamicImports: true,
          exports: 'named',
          plugins: [terser()],
          entryFileNames: '[name].esm.min.js',
          globals: { vue: 'Vue' },
        },
      ],
    },
    outDir: 'dist',
  },
  resolve: {
    dedupe: ['vue'],
  },
  optimizeDeps: {
    include: [...externals],
  },
});
