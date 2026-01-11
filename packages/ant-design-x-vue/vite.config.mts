import { defineConfig } from 'vite';
import { globSync } from 'glob';
import { fileURLToPath } from 'node:url';
import { resolve, relative, extname } from 'node:path';
import VueMacros from 'unplugin-vue-macros/vite'
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

const externals = ['vue', 'ant-design-vue'];

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
      external: [...externals, /^ant-design-vue/],
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
