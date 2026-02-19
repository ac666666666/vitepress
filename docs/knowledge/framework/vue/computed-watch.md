# 计算属性 (Computed) 与 侦听器 (Watch) 深度解析

[Vue.js 官方文档](https://cn.vuejs.org/)

在 Vue 中，`computed` 和 `watch` 都是基于响应式系统的核心特性，但它们的应用场景和底层机制有显著区别。

## 1. 计算属性 (Computed)

`computed` 是基于它们的**响应式依赖进行缓存**的。只在相关响应式依赖发生改变时它们才会重新求值。

### 1.1 核心特性

- **缓存机制**: 只要依赖没变，多次访问 `computed` 属性会立即返回之前的计算结果，而不必再次执行函数。
- **懒执行 (Lazy Evaluation)**: 只有在模板中渲染或被其他属性读取时，才会真正执行计算。
- **纯函数**: 应该只做计算，**不要在 getter 中进行异步操作或副作用** (如 API 请求、DOM 操作)。

### 1.2 原理简析

Vue 内部为每个 computed 属性创建了一个 `Watcher` (computed watcher)。

- 当 computed 被访问时，如果 `dirty` 为 `true` (依赖变了)，则重新计算并缓存，将 `dirty` 置为 `false`。
- 如果 `dirty` 为 `false`，直接返回缓存值。
- 当依赖发生变化时，会将 computed watcher 的 `dirty` 置为 `true`，并通知渲染 watcher 进行更新。

### 1.3 最佳实践

```javascript
// ✅ 推荐: 依赖数据衍生出新数据
const fullName = computed(() => firstName.value + ' ' + lastName.value)

// ❌ 避免: 在 computed 中进行副作用
const fullName = computed(() => {
  asyncUpdateUser() // 🚫 不要这样做！
  return firstName.value + ' ' + lastName.value
})
```

---

## 2. 侦听器 (Watch)

`watch` 用于在数据变化时执行**副作用** (Side Effects)，如异步操作、DOM 修改、或者开销较大的操作。

### 2.1 核心特性

- **无缓存**: 数据变化一次，回调执行一次。
- **支持异步**: 可以在回调中执行 `await` 或 `setTimeout`。
- **获取旧值**: 回调函数接收 `(newValue, oldValue)`。

### 2.2 深度侦听与立即执行

- **deep**: 深度遍历对象，监听内部属性变化 (性能开销大，慎用)。
- **immediate**: 侦听器创建时立即触发一次回调。

### 2.3 watchEffect (Vue 3)

`watchEffect` 会立即执行传入的函数，同时响应式追踪其依赖，并在依赖变更时重新运行该函数。

- **自动收集依赖**: 省去了明确指定侦听源。
- **无法获取旧值**: 只能获取当前值。

```javascript
// watch: 需要指定源
watch(source, (val) => console.log(val))

// watchEffect: 自动追踪
watchEffect(() => console.log(source.value))
```

---

## 3. Computed vs Watch 对比表

| 特性 | Computed (计算属性) | Watch (侦听器) |
| :--- | :--- | :--- |
| **缓存** | ✅ 有缓存 (基于依赖) | ❌ 无缓存 |
| **执行时机** | 懒执行 (访问时) | 数据变化时 |
| **副作用** | ❌ 不支持 (同步纯函数) | ✅ 支持 (异步/DOM操作) |
| **适用场景** | 一个值依赖多个属性 (多对一) | 一个属性变化影响多个状态 (一对多) |
| **示例** | 购物车总价、过滤列表 | 搜索框防抖请求、路由变化监听 |

## 4. 面试高频题

### Q: `computed` 和 `watch` 的区别？

> **答**:
> 1.  **缓存**: `computed` 支持缓存，只有依赖改变才重新计算；`watch` 不支持缓存。
> 2.  **异步**: `computed` 不支持异步逻辑；`watch` 支持异步操作。
> 3.  **侧重点**: `computed` 侧重于**数据的生成** (模板渲染)；`watch` 侧重于**逻辑的执行** (副作用)。

### Q: `watch` 能监听到对象内部属性的变化吗？

> **答**:
> - 默认情况下，`watch` 监听响应式对象 (`ref` 或 `reactive`) 是**深层**的 (Vue 3 `reactive` 默认深层，`ref` 对象需要 `.value`)。
> - 如果监听的是 `getter` 函数返回的对象，默认是浅层的，需要开启 `{ deep: true }`。
> - Vue 2 中监听对象需要 `{ deep: true }`。

### Q: `computed` 既然有缓存，那它什么时候会被清理？

> **答**:
> 在 Vue 3 中，computed 属性也会随着组件的卸载而停止计算和依赖收集。
