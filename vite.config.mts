import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import VueMacros from 'unplugin-vue-macros/vite'
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';


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
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'antdx',
      fileName: 'index',
    },
    rollupOptions: {
      external: [...externals],
      output: {
        globals: {
          'vue': 'Vue',
        },
      },
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
