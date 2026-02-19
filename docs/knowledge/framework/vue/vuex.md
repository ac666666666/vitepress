# Vuex 状态管理深度解析

[Vue.js 官方文档](https://cn.vuejs.org/)

Vuex 是 Vue.js 的状态管理模式，采用集中式存储管理应用的所有组件的状态。

## 1. 核心概念与数据流

### 单向数据流图

```
View -> (Dispatch) -> Actions -> (Commit) -> Mutations -> (Mutate) -> State -> (Render) -> View
```

- **State**: 单一状态树 (Single Source of Truth)。
- **Getters**: Store 的计算属性，具有缓存机制。
- **Mutations**: **同步**事务。更改 State 的唯一方法。
- **Actions**: 处理**异步**操作 (API 调用)，提交 Mutation。
- **Modules**: 模块化拆分。

### 为什么 Mutation 必须是同步的？

为了让 Devtools 能够捕捉到每一次状态的变化 (Snapshot)。如果是异步的，Devtools 无法知道状态什么时候真正改变，导致无法进行时光旅行调试 (Time Travel)。

---

## 2. 模块化 (Modules) 与 命名空间

在大型项目中，Store 会非常臃肿，模块化是必经之路。

```javascript
const moduleA = {
  namespaced: true, // 开启命名空间
  state: () => ({ count: 0 }),
  mutations: {
    increment(state) {
      state.count++;
    },
  },
  actions: {
    incrementIfOddOnRootSum({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit("increment");
      }
    },
  },
  getters: {
    doubleCount(state) {
      return state.count * 2;
    },
  },
};

const store = new Vuex.Store({
  modules: {
    a: moduleA,
  },
});
```

**访问方式**:

- State: `state.a.count`
- Getters: `getters['a/doubleCount']`
- Commit: `commit('a/increment')`
- Dispatch: `dispatch('a/incrementIfOddOnRootSum')`

---

## 3. Vuex 插件开发 (Plugins)

插件是一个函数，接收 store 作为唯一参数。

### 实战：持久化插件 (LocalStorage)

```javascript
const myPersistPlugin = (store) => {
  // 1. 初始化时恢复数据
  if (localStorage.getItem("vuex-state")) {
    store.replaceState(JSON.parse(localStorage.getItem("vuex-state")));
  }

  // 2. 订阅 mutation，每次变化时保存
  store.subscribe((mutation, state) => {
    // 这里的 state 是变更后的
    localStorage.setItem("vuex-state", JSON.stringify(state));
  });
};

// 使用
export default new Vuex.Store({
  plugins: [myPersistPlugin],
});
```

---

## 4. 严格模式 (Strict Mode)

```javascript
const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
});
```

在严格模式下，任何不通过 mutation handler 改变 state 的操作都会抛出错误。
**注意**: 不要在生产环境下开启，因为这会深度检测状态树，有性能损耗。

---

## 5. Vuex vs Pinia (新一代状态管理)

Pinia 是 Vue 官方推荐的 Vuex 替代方案。

### 为什么选择 Pinia？

1.  **更简单的 API**: 移除了 `Mutation`，只有 `State`, `Getters`, `Actions` (支持同步和异步)。
2.  **TypeScript 支持**: 原生支持 TS，类型推断极其强大。
3.  **模块化**: 不再需要嵌套的 modules，每个 Store 都是独立的，按需引入。
4.  **体积**: 极其轻量 (1KB 左右)。

### Pinia 示例

```javascript
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    name: "Eduardo",
    isAdmin: true,
  }),
  getters: {
    upperName: (state) => state.name.toUpperCase(),
  },
  actions: {
    async login(user, password) {
      const userData = await api.login(user, password);
      this.name = userData.name;
      this.isAdmin = userData.isAdmin;
    },
  },
});
```

### 组件中使用

```javascript
<script setup>
  import {useUserStore} from '@/stores/user' const user = useUserStore() //
  直接修改 (Pinia 允许) user.name = 'Allen' // 调用 Action user.login('admin',
  '123')
</script>
```
