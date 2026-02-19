# Pinia 状态管理深度解析

[Vue.js 官方文档](https://cn.vuejs.org/)

Pinia 是 Vue 的专属状态管理库，它允许你跨组件或页面共享状态。它最初的设计目的是为了探索 Vuex 下一次迭代的样子，但现在已经成为了 Vue 官方推荐的状态管理库。

## 1. 为什么选择 Pinia？

相比 Vuex 3.x/4.x，Pinia 提供了更简单的 API，去掉了 `mutations`，并提供了极其强大的 TypeScript 支持。

### 核心优势
- **更简单的 API**: 只有 `state`, `getters`, `actions`。
- **类型安全**: 完整的 TypeScript 支持，自动推导类型。
- **模块化**: 每个 Store 都是独立的，自动代码分割。
- **轻量**: 体积非常小 (约 1KB)。
- **DevTools 支持**: 追踪 Actions、Mutations (Pinia 中 Action 直接修改状态也被视为 Mutation)，时间旅行。

---

## 2. 基础使用

### 2.1 安装与注册

```bash
npm install pinia
```

```javascript
// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

### 2.2 定义 Store (Option Store vs Setup Store)

Pinia 支持两种定义 Store 的方式。

#### Option Store (类似 Vuex)
```javascript
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
```

#### Setup Store (类似 Composition API)
```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const double = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, double, increment }
})
```

### 2.3 在组件中使用

```javascript
<script setup>
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'

const counter = useCounterStore()

// 1. 访问 State/Getters (直接解构会丢失响应式)
// counter.count++ // 可行，但解构需用 storeToRefs
const { count, double } = storeToRefs(counter)

// 2. 调用 Action
counter.increment()

// 3. 批量修改 (Patch)
counter.$patch({ count: counter.count + 1 })
// 或者
counter.$patch((state) => {
  state.count++
})
</script>
```

---

## 3. 核心概念详解

### 3.1 State
State 是 Store 的核心。在 Pinia 中，State 被定义为一个返回初始状态的函数。

```javascript
state: () => {
  return {
    userList: [],
    loading: false
  }
}
```

### 3.2 Getters
Getters 完全等同于 Store 的计算属性。

```javascript
getters: {
  // 接收 state 作为参数
  activeUsers: (state) => state.userList.filter(user => user.active),
  
  // 使用 this 访问其他 getter
  totalActive() {
    return this.activeUsers.length
  }
}
```

### 3.3 Actions
Actions 相当于组件中的 methods。它们可以通过 `this` 访问 `state` 和 `getters`。**支持异步操作**。

```javascript
actions: {
  async fetchUsers() {
    this.loading = true
    try {
      this.userList = await api.getUsers()
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
  }
}
```

---

## 4. 进阶技巧

### 4.1 插件系统 (Plugins)
Pinia 插件是一个函数，可以选择性地返回要添加到 store 的属性。

**实战：持久化插件**
```javascript
// plugins/persist.js
export function piniaPersistPlugin({ store }) {
  // 恢复状态
  const storageKey = `pinia-${store.$id}`
  if (localStorage.getItem(storageKey)) {
    store.$patch(JSON.parse(localStorage.getItem(storageKey)))
  }

  // 监听变化并保存
  store.$subscribe((mutation, state) => {
    localStorage.setItem(storageKey, JSON.stringify(state))
  })
}

// main.js
const pinia = createPinia()
pinia.use(piniaPersistPlugin)
```

### 4.2 组合式 Store
Store 之间可以相互引用。

```javascript
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  actions: {
    async checkout() {
      const user = useUserStore()
      if (!user.isLoggedIn) {
        return false
      }
      // ...
    }
  }
})
```

---

## 5. Pinia vs Vuex 对比总结

| 特性 | Vuex 4 | Pinia |
| :--- | :--- | :--- |
| **Mutation** | 必须 (同步修改 State) | **已移除** (直接修改 State) |
| **TypeScript** | 支持但复杂 | **原生支持，完美推断** |
| **模块化** | 嵌套 Module | 扁平化，独立 Store |
| **体积** | 较大 | 极小 (~1KB) |
| **命名空间** | 需要 `namespaced: true` | 不需要，Store ID 唯一 |
| **代码风格** | Options API | Options API + Composition API |

**结论**: 新项目**强烈推荐**使用 Pinia。只有维护旧项目时才需要关注 Vuex。
