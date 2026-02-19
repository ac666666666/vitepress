# React 状态管理方案深度解析

[React 官方文档](https://react.dev/)

随着应用复杂度的增加，组件间的状态共享变得困难。本文将深入探讨主流的状态管理方案：Redux (及其现代标准 Redux Toolkit) 和 Zustand。

## 1. Redux 与 Redux Toolkit (RTK)

Redux 是 React 生态中最经典的状态管理库。虽然早期因为样板代码多被诟病，但 **Redux Toolkit (RTK)** 的出现彻底解决了这个问题。

### 1.1 核心三原则

1.  **单一数据源 (Single Source of Truth)**：整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中。
2.  **State 是只读的 (State is Read-Only)**：唯一改变 state 的方法就是触发 action。
3.  **使用纯函数执行修改 (Changes are made with pure functions)**：Reducer 必须是纯函数，输入相同的 state 和 action，永远返回相同的新 state。

### 1.2 为什么 Reducer 必须是纯函数？

- **可预测性**：确保同样的输入得到同样的输出，方便调试和测试。
- **时间旅行 (Time Travel)**：DevTools 依赖于纯函数特性来实现状态回滚和快照。
- **浅比较**：Redux 比较新旧 state 对象的引用来决定是否更新 UI。如果直接修改 state (mutation)，引用没变，UI 就不会更新。

### 1.3 现代 Redux 实战 (Redux Toolkit)

RTK 提供了 `createSlice` 和 `configureStore`，内置了 Immer.js，允许我们编写"看似可变"的逻辑。

**步骤 1: 创建 Slice**

```javascript
// features/counter/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      // Redux Toolkit 允许我们在 reducers 中直接修改 state
      // 因为它底层使用了 Immer 库
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

**步骤 2: 配置 Store**

```javascript
// app/store.js
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
```

**步骤 3: 在组件中使用**

```javascript
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "./counterSlice";

export function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
    </div>
  );
}
```

---

## 2. Zustand (轻量级状态管理)

Zustand 是一个基于 Hooks 的状态管理库，以其 **极简**、**无样板代码** 和 **高性能** 著称。

### 2.1 核心优势

1.  **极简 API**：不需要 Provider 包裹，不需要 Action Types，不需要复杂的 Dispatch。
2.  **基于 Hooks**：非常符合 React 的函数式编程习惯。
3.  **性能优化**：支持选择性订阅 (Selector)，组件只在它关心的状态变化时才重新渲染。
4.  **处理异步**：直接在 Store 中写 async 函数即可，不需要像 Redux 那样引入 Thunk/Saga 中间件。

### 2.2 Zustand 实战

**步骤 1: 创建 Store**

```javascript
import { create } from "zustand";

// create 返回一个 Hook
const useStore = create((set) => ({
  bears: 0,
  fish: 0,
  // 同步 Action
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  // 异步 Action (直接写 async)
  fetchBears: async () => {
    const response = await fetch("/api/bears");
    const count = await response.json();
    set({ bears: count });
  },
}));
```

**步骤 2: 在组件中使用 (自动选择性订阅)**

```javascript
function BearCounter() {
  // 只有当 bears 变化时，这个组件才会重新渲染
  // fish 变化不会导致这个组件重新渲染
  const bears = useStore((state) => state.bears);
  return <h1>{bears} around here...</h1>;
}

function Controls() {
  const increasePopulation = useStore((state) => state.increasePopulation);
  return <button onClick={increasePopulation}>one up</button>;
}
```

---

## 3. 深度对比：Redux vs Zustand vs Context

| 特性         | Redux (RTK)                                  | Zustand                            | Context API                                                    |
| :----------- | :------------------------------------------- | :--------------------------------- | :------------------------------------------------------------- |
| **样板代码** | 中等 (RTK 简化了很多)                        | **极少**                           | 少                                                             |
| **学习曲线** | 陡峭 (概念多：Reducer, Dispatch, Middleware) | **平滑** (像使用 useState 一样)    | 平滑                                                           |
| **渲染性能** | **高** (Selector 机制)                       | **高** (Selector 机制)             | **低** (Provider 值变化会导致所有消费者重渲染，需配合 useMemo) |
| **异步处理** | 需要中间件 (Thunk/Saga)                      | **原生支持** (直接写 async/await)  | 不涉及 (需自己封装)                                            |
| **调试工具** | 强大的 Redux DevTools                        | 支持 Redux DevTools                | React DevTools                                                 |
| **适用场景** | 大型应用、复杂的状态流转、团队协作           | 中小型应用、追求开发速度、极简主义 | 全局静态配置 (Theme, Auth, i18n)                               |

### 面试高频题

**Q1: 为什么不用 Context 取代 Redux/Zustand？**
**A**: Context 主要设计用于 **依赖注入** 而不是 **状态管理**。
Context 的致命弱点是 **性能问题**。当 Context Value 更新时，所有消费该 Context 的组件都会强制重新渲染，即使它们只使用了 Value 中的一部分。虽然可以用 `useMemo` 优化，但在复杂应用中维护成本很高。
而 Redux 和 Zustand 都有 **Selector** 机制，可以实现精细化的依赖收集，只有组件真正使用的数据变化时才触发渲染。

**Q2: Zustand 如何在组件外访问 Store？**
**A**: Zustand 的 store 是纯 JS 对象。可以通过 `useStore.getState()` 获取状态，`useStore.setState()` 更新状态，甚至在 React 组件之外（如工具函数、Axios 拦截器中）使用。

```javascript
// 在 React 组件之外
const token = useStore.getState().token;
```

**Q3: Redux 中间件的原理是什么？**
**A**: 中间件本质上是对 `store.dispatch` 方法的 **Monkey Patch (猴子补丁)**。它在 Action 发出之后，Reducer 执行之前，提供了一个拦截点。可以在这里打印日志、处理异步请求、崩溃报告等。
洋葱模型：`Middleware1 -> Middleware2 -> Reducer -> Middleware2 -> Middleware1`。
