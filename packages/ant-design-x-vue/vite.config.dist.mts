import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import VueMacros from 'unplugin-vue-macros/vite'
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import terser from '@rollup/plugin-terser';

const externals = ['vue'];

function externalizeRuntime(id: string) {
  return (
    id === 'vue' ||
    id === '@ant-design-x-vue/x-sdk' ||
    id.startsWith('@ant-design-x-vue/x-sdk/') ||
    id === '@ant-design-x-vue/x-markdown' ||
    id.startsWith('@ant-design-x-vue/x-markdown/')
  );
}

function runtimeExternalPlugin() {
  return {
    name: 'externalize-x-runtime',
    resolveId(id: string) {
      if (
        id === '@ant-design-x-vue/x-sdk' ||
        id.startsWith('@ant-design-x-vue/x-sdk/') ||
        id === '@ant-design-x-vue/x-markdown' ||
        id.startsWith('@ant-design-x-vue/x-markdown/')
      ) {
        return { id, external: true };
      }
      return null;
    },
  };
}

// 组件包目录
const componentsDir = resolve(__dirname, '../components');

export default defineConfig({
  plugins: [
    VueMacros({
      plugins: {
        vue: vue(),
        vueJsx: vueJsx(),
      },
      // 覆盖插件选项
    }),
    runtimeExternalPlugin(),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    lib: {
      entry: resolve(componentsDir, 'index.ts'),
      name: 'antdx',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: externalizeRuntime,
      output: [
        {
          format: 'umd',
          dir: 'dist',
          inlineDynamicImports: true,
          exports: 'named',
          name: 'antdx',
          entryFileNames: '[name].umd.js',
          globals: {
            vue: 'Vue',
            '@ant-design-x-vue/x-sdk': 'AntDesignXVueSdk',
            '@ant-design-x-vue/x-markdown': 'AntDesignXVueMarkdown',
          },
        },
        {
          format: 'es',
          dir: 'dist',
          inlineDynamicImports: true,
          exports: 'named',
          entryFileNames: '[name].esm.js',
          globals: {
            vue: 'Vue',
            '@ant-design-x-vue/x-sdk': 'AntDesignXVueSdk',
            '@ant-design-x-vue/x-markdown': 'AntDesignXVueMarkdown',
          },
        },
        {
          format: 'es',
          dir: 'dist',
          inlineDynamicImports: true,
          exports: 'named',
          plugins: [terser()],
          entryFileNames: '[name].esm.min.js',
          globals: {
            vue: 'Vue',
            '@ant-design-x-vue/x-sdk': 'AntDesignXVueSdk',
            '@ant-design-x-vue/x-markdown': 'AntDesignXVueMarkdown',
          },
        },
      ],
    },
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@ant-design-x-vue/components': componentsDir,
    },
    dedupe: ['vue'],
  },
  optimizeDeps: {
    include: [...externals],
  },
});
