import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import VueMacros from 'unplugin-vue-macros/vite'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VueMacros({
      plugins: {
        vue: Vue(),
        vueJsx: VueJsx(),
      },
    }),
  ],
  resolve: {
    alias: {
      'ant-design-x-vue': resolve(__dirname, '../packages/components'),
      '@ant-design-x-vue/components': resolve(__dirname, '../packages/components'),
    },
  },
})
