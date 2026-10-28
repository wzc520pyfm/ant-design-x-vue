import { defineConfig } from 'vite';
import { globSync } from 'glob';
import { fileURLToPath } from 'node:url';
import { resolve, relative, extname } from 'node:path';
import VueMacros from 'unplugin-vue-macros/vite'
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

const externals = ['vue', 'ant-design-vue'];

function externalizeRuntime(id: string) {
  return (
    id === 'vue' ||
    id === 'ant-design-vue' ||
    id.startsWith('ant-design-vue/') ||
    id === '@ant-design-x-vue/x-sdk' ||
    id.startsWith('@ant-design-x-vue/x-sdk/') ||
    id === '@ant-design-x-vue/x-markdown' ||
    id.startsWith('@ant-design-x-vue/x-markdown/')
  );
}

/** Keep SDK imports as package specifiers even when dist has not been built. */
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
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: externalizeRuntime,
      input: Object.fromEntries(
        globSync(`${componentsDir}/**/*.{ts,tsx,vue,js}`, {
          absolute: false,
          cwd: componentsDir,
          ignore: ['**/node_modules/**', '**/__tests__/**', '**/*.test.*', '**/*.spec.*']
        })
          .map(file => [
            // 删除扩展名: nested/foo.js => nested/foo
            file.slice(0, file.length - extname(file).length),
            // 将相对路径扩展为绝对路径
            resolve(componentsDir, file)
          ])
      ),
      output: [
        {
          format: 'es',
          dir: 'es',
          entryFileNames: '[name].mjs',
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              // 库依赖
              return 'chunks/module';
            }
            if (id.includes('components/')) {
              const parts = id.split('components/');
              return parts[1].split('.vue')[0];
            }
            // 库生成的辅助文件
            return 'chunks/helper'
          },
          chunkFileNames: (chunkInfo) => `${chunkInfo.name}-chunk.mjs`,
          globals: { vue: 'Vue', 'ant-design-vue': 'antd' },
        },
        {
          format: 'cjs',
          dir: 'lib',
          entryFileNames: '[name].js',
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              // 库依赖
              return 'chunks/module';
            }
            if (id.includes('components/')) {
              const parts = id.split('components/');
              return parts[1].split('.vue')[0];
            }
            // 库生成的辅助文件
            return 'chunks/helper'
          },
          chunkFileNames: (chunkInfo) => `${chunkInfo.name}-chunk.js`,
          exports: 'named',
          globals: { vue: 'Vue', 'ant-design-vue': 'antd' },
        },
      ],
    },
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@ant-design-x-vue/components': componentsDir,
    },
    dedupe: ['vue', 'ant-design-vue'],
  },
  optimizeDeps: {
    include: [...externals],
  },
});
