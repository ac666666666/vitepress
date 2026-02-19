# Vite 原理与实战

[Vite 官方文档](https://cn.vitejs.dev/)

## 1. 为什么 Vite 这么快？

Vite (法语 "快") 是新一代前端构建工具。

### 1.1 开发环境：No-Bundle
*   **Webpack**: 先打包整个应用，再启动开发服务器。项目越大，启动越慢。
*   **Vite**: **不打包**。利用浏览器原生支持 **ES Modules (ESM)** 的能力。
    *   当浏览器请求 `import { ref } from 'vue'` 时，Vite 服务器拦截请求。
    *   Vite 进行简单的路径重写和转换，直接返回文件内容。
    *   **按需编译**: 只有当浏览器请求某个文件时，Vite 才去编译它。

### 1.2 生产环境：Rollup
*   虽然浏览器支持 ESM，但为了最佳加载性能 (减少网络请求、代码压缩、Tree Shaking)，生产环境仍然需要打包。
*   Vite 使用 **Rollup** 进行生产打包，生成的代码更紧凑。

### 1.3 依赖预构建 (Pre-Bundling)
*   **工具**: 使用 **Esbuild** (Go 编写，比 JS 快 10-100 倍)。
*   **目的**:
    1.  **CommonJS -> ESM**: 将第三方库转换为 ESM 格式。
    2.  **性能优化**: 将有很多内部模块的库 (如 lodash-es) 合并成一个文件，减少 HTTP 请求。

---

## 2. Vite vs Webpack

| 维度 | Webpack | Vite |
| :--- | :--- | :--- |
| **开发启动速度** | 慢 (O(n)，与项目规模成正比) | **极快** (O(1)，与项目规模无关) |
| **热更新 (HMR)** | 慢 (需要重新构建模块依赖) | **快** (利用 ESM，浏览器只重新请求变更模块) |
| **生态** | 非常成熟，Loader/Plugin 丰富 | 逐渐成熟，兼容 Rollup 插件 |
| **生产打包** | Webpack (配置复杂但强大) | Rollup (产物更小，配置简单) |
| **底层语言** | Node.js (JS) | Node.js + **Esbuild (Go)** |

---

## 3. 常见配置实战

### 3.1 基础配置
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

### 3.2 环境变量
Vite 使用 `import.meta.env` 访问环境变量。
*   `.env`: 所有环境
*   `.env.development`: 开发环境
*   `.env.production`: 生产环境

```javascript
// 使用
console.log(import.meta.env.VITE_API_URL);
console.log(import.meta.env.MODE); // 'development' | 'production'
```

---

## 4. 插件机制

Vite 的插件机制基于 **Rollup 插件接口**，并进行了扩展。

### 4.1 编写一个简单插件
实现：在生成的 HTML 中注入一段脚本。

```javascript
export default function myPlugin() {
  return {
    name: 'my-plugin',
    transformIndexHtml(html) {
      return html.replace(
        '</body>',
        '<script>console.log("Vite Plugin Injected!")</script></body>'
      )
    }
  }
}
```
