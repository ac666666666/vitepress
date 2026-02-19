# Vue 性能优化深度指南

[Vue.js 官方文档](https://cn.vuejs.org/)

在构建大型 Vue 应用时，性能优化是必经之路。本文将从代码层面、构建层面、资源加载层面等多个维度，全面剖析 Vue 性能优化的策略。

## 1. 代码层面优化 (Runtime Optimization)

### 1.1 `v-show` vs `v-if`

- **v-show**: 控制 `display: none`。DOM 始终存在。**适用于频繁切换**。
- **v-if**: 真正的条件渲染。切换时会销毁/重建 DOM。**适用于不频繁切换**。

### 1.2 `v-for` 使用 `key`

- **必须使用唯一的 `key`** (避免使用 index)。
- Vue 内部 Diff 算法依赖 `key` 来复用 DOM 节点，减少不必要的重绘。

### 1.3 `keep-alive` 缓存组件

- 使用 `<keep-alive>` 包裹动态组件或 `<router-view>`。
- **作用**: 避免组件反复创建和销毁，保留组件状态。
- **配合**: `include` / `exclude` 属性精确控制缓存。

```html
<keep-alive :include="['Home', 'About']">
  <router-view />
</keep-alive>
```

### 1.4 Object.freeze (Vue 2)

- 对于**纯展示**的大数据列表 (如表格、报表)，不需要响应式监听。
- 使用 `Object.freeze()` 冻结对象，Vue 2 会跳过 `Object.defineProperty` 的劫持，大幅减少初始化时间。

### 1.5 函数式组件 (Functional Component)

- Vue 2 中 `<template functional>` 无状态、无实例，渲染开销极低。
- Vue 3 中普通组件性能已大幅提升，函数式组件不再是必需的优化手段。

### 1.6 路由懒加载 (Code Splitting)

- 将路由对应的组件单独打包，按需加载。

```javascript
// ✅ 推荐
const User = () => import('./User.vue')

// ❌ 避免
import User from './User.vue'
```

### 1.7 图片懒加载 (v-lazy)

- 使用 `vue-lazyload` (Vue 2) 或 `IntersectionObserver` (Vue 3) 实现图片懒加载。
- 只有进入视口时才加载图片资源。

### 1.8 虚拟列表 (Virtual List)

- 对于长列表 (如 1000+ 条数据)，只渲染可见区域的 DOM。
- 使用 `vue-virtual-scroller` 或自行实现。

---

## 2. 构建层面优化 (Build Optimization)

### 2.1 生产环境去除 console.log

- 配置 webpack (Vue CLI) 或 vite (Vite) 在 build 时移除 console。

```javascript
// vite.config.js
export default defineConfig({
  esbuild: {
    drop: ['console', 'debugger'],
  },
})
```

### 2.2 gzip 压缩

- 开启服务端 gzip 或使用 `compression-webpack-plugin` / `vite-plugin-compression` 生成 .gz 文件。

### 2.3 CDN 加速

- 将 Vue, Vue-Router, Axios 等第三方库通过 CDN 引入，减少 vendor 包体积。
- 配置 `externals` (webpack) 或 `rollupOptions.external` (vite)。

---

## 3. Vue 3 核心优化 (Internal Optimization)

Vue 3 自身带来的性能红利：

### 3.1 静态提升 (Static Hoisting)

- Vue 3 编译器会将静态节点提升到渲染函数之外，避免每次渲染都重新创建。

### 3.2 Patch Flags (补丁标记)

- 编译时标记动态节点 (如 `TEXT`, `CLASS`, `STYLE`)。
- Diff 时只对比动态节点，跳过静态节点。

### 3.3 Tree Shaking

- Vue 3 核心 API (如 `ref`, `computed`) 支持 Tree Shaking，按需引入，减少包体积。

---

## 4. 常见内存泄漏排查

1.  **全局变量**: 意外创建的全局变量未被回收。
2.  **未销毁的事件监听**: `window.addEventListener` 在组件销毁 (`beforeUnmount`) 时未移除 (`removeEventListener`)。
3.  **未清除的定时器**: `setInterval` 在组件销毁时未清除。
4.  **闭包**: 错误的闭包引用导致对象无法释放。
