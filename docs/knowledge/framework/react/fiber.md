# React Fiber 架构与调度原理

[React 官方文档](https://react.dev/)

React Fiber 是 React 16 引入的全新协调引擎，是 React 历史上最大的架构升级。

## 1. 为什么需要 Fiber？

### 背景：Stack Reconciler (React 15)
在 React 16 之前，更新过程是 **同步且递归** 的。一旦开始更新，就会一直占用主线程，直到整个组件树更新完毕。
- **问题**：如果组件树很庞大，更新耗时超过 16ms (60fps)，就会导致主线程阻塞，浏览器无法响应用户的输入、动画等，造成页面卡顿。

### 解决方案：Fiber Reconciler (React 16+)
Fiber 引入了 **时间切片 (Time Slicing)** 的概念。
- 将渲染任务拆分成一个个小的任务单元 (Fiber 节点)。
- 允许浏览器在空闲时间执行这些任务。
- 如果有更高优先级的任务（如用户输入），可以 **中断** 当前渲染，先处理高优先级任务，处理完再恢复。

---

## 2. 什么是 Fiber？

### 2.1 含义
1.  **架构层面**：一种新的协调引擎。
2.  **数据结构层面**：一个 JavaScript 对象，代表一个工作单元。它是虚拟 DOM 的超集，包含了组件类型、Key、Props，还包含了 **链表结构** 指针 (`return`, `child`, `sibling`)。

### 2.2 链表结构
为了支持任务的中断和恢复，React 需要能够遍历组件树并在任意位置停止。传统的递归调用栈无法做到这一点，所以 Fiber 使用链表结构重构了组件树。

- `return`: 指向父节点
- `child`: 指向第一个子节点
- `sibling`: 指向下一个兄弟节点

---

## 3. 调度算法 (Scheduler)

React 实现了自己的调度器 (Scheduler)，类似于操作系统的任务调度。

### 核心机制
1.  **优先级 (Lane 模型)**：不同类型的更新有不同的优先级。
    - 用户交互 (User Blocking)：最高优先级 (Sync)。
    - 数据请求 (Transition)：低优先级。
2.  **RequestIdleCallback**：React 早期利用 `requestIdleCallback` API 实现空闲时间调度，后来为了兼容性和稳定性，React 内部实现了一个 polyfill (`MessageChannel` + `requestAnimationFrame`)。

---

## 4. Fiber 架构的两个阶段

1.  **Render 阶段 (协调阶段)**：
    - 遍历 Fiber 树，对比新旧 props，确定需要更新的节点。
    - **可中断**。
    - 这一阶段的操作是纯粹的 JS 计算，不涉及真实 DOM 操作。
    - 结果：生成 Effect List (副作用列表)。

2.  **Commit 阶段 (提交阶段)**：
    - 根据 Effect List，一次性将所有变更应用到真实 DOM 上。
    - **不可中断** (为了保持 UI 的一致性)。
    - 执行生命周期 (`componentDidMount`, `useEffect` 等)。

---

## 5. 为什么 Vue 不需要 Fiber？

这是一个经典的对比问题。

1.  **响应式原理不同**：
    - **Vue**：基于 Proxy 的细粒度响应式系统。Vue 能够精确知道哪个组件依赖了哪个状态。当状态变化时，Vue 可以直接定位到需要更新的组件，更新范围通常较小。
    - **React**：基于 Pull 的全量 Diff。当 setState 触发时，React 默认会重新渲染整个子组件树。如果没有手动优化 (`React.memo`, `shouldComponentUpdate`)，计算量非常大。

2.  **优化策略**：
    - **Vue**：通过模板编译时的静态分析 (Static Analysis)，Vue 3 能够将动态节点和静态节点分离 (Patch Flags, Block Tree)，Diff 性能极高。
    - **React**：由于 JSX 过于灵活，难以进行静态分析。为了解决大规模组件树更新时的卡顿，React 选择了 **时间切片 (Fiber)** 这条路，通过分散计算压力来保证响应性。

**总结**：Vue 通过 **细粒度更新 + 静态编译优化** 减少了计算量，不需要时间切片也能保持高性能；React 通过 **时间切片** 将巨大的计算量拆分，避免阻塞主线程。
