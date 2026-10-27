import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'node:path';
import VueMacros from 'unplugin-vue-macros/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    VueMacros({
      plugins: {
        vue: vue(),
        vueJsx: vueJsx(),
      },
    }),
  ],
  resolve: {
    alias: {
      'ant-design-x-vue': resolve(__dirname, 'packages/components'),
      '@ant-design-x-vue/components': resolve(__dirname, 'packages/components'),
    },
  },
  test: {
    environment: 'happy-dom',
    include: [
      'packages/components/**/*.test.{ts,tsx}',
      'packages/x-markdown/**/*.test.{ts,tsx}',
      'packages/x-sdk/**/*.test.{ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['html', 'text', 'json'],
    },
  },
});
