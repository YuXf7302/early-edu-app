import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  // lucide-react ESM v1.23.0 的入口引用了不存在的图标文件
  // 这里用 CJS 入口替代——CJS 版本所有图标都是内联定义的，可以正常工作
  resolve: {
    alias: {
      'lucide-react': resolve(__dirname, 'node_modules/lucide-react/dist/cjs/lucide-react.js')
    }
  },
  server: {
    port: 5173,
    host: true
  }
})
