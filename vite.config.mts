import { defineConfig } from 'vite';
import { globSync } from 'glob';
import { fileURLToPath } from 'node:url';
import { resolve, relative, extname } from 'node:path';
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
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [...externals],
      input: Object.fromEntries(
        globSync('src/**/*.*').filter(file => !file.includes('test')).map(file => [
          // 删除 `src/` 以及每个文件的扩展名: src/nested/foo.js => nested/foo
          relative(
            'src',
            file.slice(0, file.length - extname(file).length)
          ),
          // 将相对路径扩展为绝对路径: src/nested/foo => /project/src/nested/foo.js
          fileURLToPath(new URL(file, import.meta.url))
        ])
      ),
      output: [
        {
          format: 'es',
          dir: 'es',
          entryFileNames: '[name].mjs',
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              return null;
            }
            if (id.includes('src/')) {
              return id.split('src/')[1].split('.vue')[0]
            }
          },
          chunkFileNames: (chunkInfo) => `${chunkInfo.name}2.mjs`,
          globals: { vue: 'Vue', 'ant-design-vue': 'antd' },
        },
        {
          format: 'cjs',
          dir: 'lib',
          entryFileNames: '[name].js',
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              return null;
            }
            if (id.includes('src/')) {
              return id.split('src/')[1].split('.vue')[0]
            }
          },
          chunkFileNames: (chunkInfo) => `${chunkInfo.name}2.js`,
          exports: 'named',
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
