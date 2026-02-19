# Vue 3.0 深度解析与新特性

[Vue.js 官方文档](https://cn.vuejs.org/)

Vue 3.0 是 Vue 的一次重大升级，带来了更好的性能、更小的体积和更好的 TypeScript 支持。本文将详细介绍 Vue 3 的新特性以及与 Vue 2 的核心区别。

<VueReactivityDemo />

## 1. Vue 2 vs Vue 3 核心区别对比

| 特性           | Vue 2 (Options API)                                   | Vue 3 (Composition API)                          |
| :------------- | :---------------------------------------------------- | :----------------------------------------------- |
| **响应式原理** | `Object.defineProperty` (递归遍历，无法监听新增/删除) | `Proxy` (懒代理，支持数组/Map/Set，性能更优)     |
| **代码组织**   | Options API (`data`, `methods`, `computed` 分离)      | Composition API (按逻辑关注点组织代码，利于复用) |
| **生命周期**   | `beforeDestroy`, `destroyed`                          | `beforeUnmount`, `unmounted`                     |
| **根节点**     | 只能有一个根节点                                      | **Fragments** (支持多个根节点)                   |
| **API 类型**   | 挂载在 `Vue` 原型上 (`Vue.prototype`)                 | 实例方法 (`app.config.globalProperties`)         |
| **双向绑定**   | `v-model` + `.sync`                                   | 统一为 `v-model` (支持多个)                      |
| **TypeScript** | 支持较弱 (需装饰器)                                   | **原生支持** (源码 TS 重写)                      |
| **构建体积**   | 运行时包含所有功能                                    | **Tree-shaking** (按需打包，体积更小)            |

---

## 2. Composition API (组合式 API)

### 2.1 为什么要引入 Composition API？

- **Vue 2 (Options API) 的痛点**: 逻辑关注点分离。一个功能的代码分散在 `data`, `methods`, `computed`, `watch` 中，难以维护和复用。
- **Vue 3 (Composition API) 的优势**: 能够将同一个逻辑关注点的代码组合在一起 (Function-based)，便于提取和复用 (Composables)。

### 2.2 核心 API

- **ref**: 定义基本类型的响应式数据。底层是 `RefImpl` 类，通过 `.value` 访问。
- **reactive**: 定义对象类型的响应式数据。底层是 `Proxy`。
- **toRefs**: 将 `reactive` 对象转换为普通对象，但每个属性都是指向源对象的 `ref`。用于解构时保持响应式。
- **watchEffect**: 自动收集依赖的副作用函数。

### 2.3 script setup 语法糖

Vue 3.2 推出的 `<script setup>` 是使用 Composition API 的编译时语法糖。

- **更少的样板内容**: 顶层变量自动暴露给模板。
- **更好的运行时性能**: 模板会被编译成同一作用域的渲染函数，没有代理开销。

```html
<script setup>
  import { ref, onMounted } from "vue";

  // props
  const props = defineProps({
    foo: String,
  });

  // emits
  const emit = defineEmits(["change", "delete"]);

  const count = ref(0);
  const inc = () => count.value++;

  onMounted(() => console.log(props.foo));
</script>
```

---

## 3. 响应式系统升级 (Proxy)

- **Vue 2**: 初始化时递归遍历所有属性，性能开销大。无法拦截对象属性的添加/删除；无法拦截数组索引修改。
- **Vue 3**: **Lazy Reactivity** (惰性响应)。只有访问到嵌套对象时，才会将该层转为 Proxy。拦截了 13 种对象操作 (`get`, `set`, `deleteProperty`, `has`, `ownKeys` 等)。

---

## 4. 内置组件新特性

### 4.1 Teleport (传送门)

将组件 DOM 渲染到 DOM 树的其他位置 (如 `body`)，但逻辑依然保持在组件树中。
**场景**: Modal, Tooltip, Dropdown。

```html
<Teleport to="body">
  <div v-if="isOpen" class="modal">...</div>
</Teleport>
```

### 4.2 Fragments (片段)

Vue 3 支持组件有多个根节点。渲染时会创建一个虚拟的 Fragment 节点。

```html
<template>
  <header>...</header>
  <main>...</main>
</template>
```

### 4.3 Suspense (实验性)

用于协调对异步依赖的处理。可以在组件树中等待异步组件（如 `async setup`）加载时渲染后备内容。

```html
<Suspense>
  <template #default>
    <AsyncComponent />
  </template>
  <template #fallback> Loading... </template>
</Suspense>
```

---

## 5. 样式新特性 (v-bind in CSS)

单文件组件的 `<style>` 标签支持使用 `v-bind` 绑定 JS 变量。

```html
<script setup>
  import { ref } from "vue";
  const color = ref("red");
</script>

<style>
  .text {
    color: v-bind(color); /* 动态绑定 */
  }
</style>
```

**原理**: Vue 会使用 CSS Custom Properties (CSS 变量) 实现，将 JS 变量赋值给 `--[hash]`，并在 CSS 中使用 `var(--[hash])`。

---

## 6. 其他重大变更 (Breaking Changes)

1.  **全局 API 调整**:
    - `new Vue()` -> `createApp()`
    - `Vue.prototype` -> `app.config.globalProperties`
    - `Vue.component` -> `app.component`
    - `Vue.use` -> `app.use`

2.  **v-if 与 v-for 优先级**:
    - Vue 2: `v-for` > `v-if` (不推荐一起用)
    - Vue 3: `v-if` > `v-for`

3.  **移除 API**:
    - 移除了 `$on`, `$off`, `$once` (EventBus 模式不再支持，需用第三方库)。
    - 移除了 `Filters` (过滤器)，建议用计算属性或方法代替。
    - 移除了 `.sync` 修饰符 (合并到 `v-model`)。

4.  **key 属性**:
    - `<template v-for>` 的 key 应该设置在 `<template>` 标签上。
    - `v-if` / `v-else` 分支不再需要手动指定唯一的 key，Vue 会自动生成。
