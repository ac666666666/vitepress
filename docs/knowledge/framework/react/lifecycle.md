# React 生命周期详解

[React 官方文档](https://react.dev/)

React 组件的生命周期主要分为三个阶段：**挂载 (Mounting)**、**更新 (Updating)** 和 **卸载 (Unmounting)**。

## 1. 类组件生命周期 (React 16.4+)

### 1.1 挂载阶段 (Mounting)
1.  **constructor()**: 初始化 state，绑定事件处理函数。
2.  **static getDerivedStateFromProps(props, state)**: (静态方法) 根据 props 更新 state。很少使用。
3.  **render()**: 纯函数，返回要渲染的 JSX。
4.  **componentDidMount()**: 组件挂载后立即调用。适合发送网络请求、订阅事件。

### 1.2 更新阶段 (Updating)
1.  **static getDerivedStateFromProps(props, state)**
2.  **shouldComponentUpdate(nextProps, nextState)**: 性能优化关键。返回 false 阻止更新。
3.  **render()**
4.  **getSnapshotBeforeUpdate(prevProps, prevState)**: 在 DOM 更新前捕获信息（如滚动位置）。
5.  **componentDidUpdate(prevProps, prevState, snapshot)**: DOM 更新后调用。

### 1.3 卸载阶段 (Unmounting)
1.  **componentWillUnmount()**: 清理工作（取消定时器、取消订阅）。

### 1.4 错误处理
1.  **static getDerivedStateFromError(error)**: 渲染降级 UI。
2.  **componentDidCatch(error, info)**: 记录错误日志。

---

## 2. 函数组件与 Hooks 生命周期

函数组件没有传统的生命周期方法，而是通过 `useEffect` 模拟。

| 类组件 | Hooks 等价写法 |
| :--- | :--- |
| **componentDidMount** | `useEffect(() => { ... }, [])` (空依赖数组) |
| **componentDidUpdate** | `useEffect(() => { ... }, [prop, state])` (指定依赖) |
| **componentWillUnmount** | `useEffect(() => { return () => { ... } }, [])` (返回清理函数) |
| **shouldComponentUpdate** | `React.memo(Component, (prev, next) => compare(prev, next))` |

### 示例：useEffect 模拟生命周期

```javascript
import React, { useState, useEffect } from 'react';

function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // 相当于 componentDidMount
    const timer = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);

    // 相当于 componentWillUnmount
    return () => {
      clearInterval(timer);
    };
  }, []); // 空数组表示不依赖任何 props/state，只执行一次

  useEffect(() => {
    // 相当于 componentDidUpdate (仅当 count 变化时)
    document.title = `Count: ${count}`;
  }, [count]);

  return <div>{count}</div>;
}
```

---

## 3. 父子组件生命周期执行顺序

1.  **挂载阶段**：
    - 父 constructor
    - 父 getDerivedStateFromProps
    - 父 render
    - 子 constructor
    - 子 getDerivedStateFromProps
    - 子 render
    - 子 componentDidMount
    - 父 componentDidMount

2.  **更新阶段**：
    - 父 render
    - 子 render
    - 子 componentDidUpdate
    - 父 componentDidUpdate

**总结**：渲染过程是 **自顶向下**，挂载/更新完成是 **自底向上**。
