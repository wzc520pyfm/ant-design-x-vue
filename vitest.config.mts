import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'node:path';


export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      'ant-design-x-vue': resolve(__dirname, 'packages/components'),
      '@ant-design-x-vue/components': resolve(__dirname, 'packages/components'),
    },
  },
  test: {
    environment: 'happy-dom',
    include: ['packages/components/**/*.test.{ts,js,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['html', 'text', 'json'],
    },
  },
});
