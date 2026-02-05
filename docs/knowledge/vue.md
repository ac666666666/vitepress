# Vue 框架原理

## 1. Vue 响应式原理
Vue 2.x 使用 `Object.defineProperty`，Vue 3.x 使用 `Proxy`。

### Vue 2 vs Vue 3
- **Vue 2**: 递归遍历 data 对象，使用 `Object.defineProperty` 劫持 getter/setter。缺点是无法监听对象新增属性和数组下标变化。
- **Vue 3**: 使用 ES6 `Proxy` 代理整个对象。性能更好，且能监听数组和对象的所有变化。

## 2. Vue 生命周期

### 主要阶段
1. **创建前后**: `beforeCreate`, `created`
2. **挂载前后**: `beforeMount`, `mounted` (DOM 已生成)
3. **更新前后**: `beforeUpdate`, `updated`
4. **销毁前后**: `beforeUnmount`, `unmounted` (Vue 3)

## 3. v-if vs v-show

- **v-if**: 真正的条件渲染。如果不满足条件，元素根本不会被渲染到 DOM 中。切换开销大。
- **v-show**: 只是简单地切换 CSS `display` 属性。元素始终保留在 DOM 中。初始渲染开销大，切换开销小。

> 频繁切换用 `v-show`，运行时条件很少改变用 `v-if`。
