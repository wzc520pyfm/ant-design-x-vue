import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import VueMacros from 'vue-macros/vite'
import * as path from "node:path";

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
  resolve:{
    alias:{
      'ant-design-x-vue':path.resolve(__dirname,'../src')
    }
  }
})
