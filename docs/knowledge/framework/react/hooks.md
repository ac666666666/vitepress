# React Hooks 深度解析

[React 官方文档](https://react.dev/)

Hooks 是 React 16.8 引入的特性，允许在不编写 class 的情况下使用 state 和其他 React 特性。

## 1. 为什么 Hooks 不能写在 if/循环里？

### 核心原因

React Hooks 的底层实现依赖于 **链表 (Linked List)**。React 需要严格保证 Hooks 在每次组件渲染时的 **调用顺序一致**，以便正确地将 state 与对应的 Hook 关联起来。

### 原理解析

在组件内部，React 维护了一个 `memoizedState` 链表。

1.  **初次渲染**：按顺序创建链表节点，每个节点保存对应 Hook 的状态。
2.  **更新渲染**：按顺序读取链表节点。

如果将 Hook 放在 `if` 条件中：

```javascript
if (condition) {
  useState("A"); // Hook 1
}
useEffect(() => {}); // Hook 2
```

如果某次渲染 `condition` 为 false，React 就会把 Hook 2 的状态误认为是 Hook 1 的状态，导致状态错乱和 Bug。

---

## 2. 状态管理 Hooks (useState / useReducer)

### 2.1 useState 详解

**作用**：在函数组件中添加状态。

- **对象更新 vs 单个变量**：
  - **Class 组件 (`setState`)**：自动合并 (Merge) 对象属性。
  - **Hooks (`useState`)**：**替换 (Replace)** 状态。如果你使用对象，必须手动合并。

```javascript
const [state, setState] = useState({ name: "Jack", age: 18 });
// 正确：手动合并
setState((prev) => ({ ...prev, name: "Rose" }));
```

- **惰性初始化**：
  如果 `initialState` 需要经过复杂计算，可以传入一个函数，只在初次渲染时执行。

```javascript
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

### 2.2 useReducer 详解

**作用**：`useState` 的替代方案。接收一个形如 `(state, action) => newState` 的 reducer，并返回当前的 state 以及与其配套的 dispatch 方法。

**场景**：

1.  **复杂状态逻辑**：state 包含多个子值，或者下一个 state 依赖于之前的 state。
2.  **深层传递**：相比于传递回调函数，传递 `dispatch` 可以避免性能问题。

```javascript
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
    </>
  );
}
```

**面试题：useState 和 useReducer 怎么选？**

- 简单的状态（如 input 值、toggle 开关）用 `useState`。
- 复杂的状态逻辑（如表单的多步骤验证、购物车逻辑）用 `useReducer`。

---

## 3. 副作用 Hooks (useEffect / useLayoutEffect)

| 特性         | useEffect                            | useLayoutEffect                          |
| :----------- | :----------------------------------- | :--------------------------------------- |
| **执行时机** | 浏览器绘制 (Paint) **之后** 异步执行 | DOM 变更后，浏览器绘制 **之前** 同步执行 |
| **阻塞渲染** | 否                                   | 是 (会阻塞视觉更新)                      |
| **应用场景** | 数据获取、订阅事件、不影响布局的操作 | 测量 DOM 尺寸、修改 DOM 样式避免闪烁     |

### 面试题：什么时候用 useLayoutEffect？

当你需要操作 DOM 并且这些操作会影响页面布局（如动画起始位置计算、防止闪烁）时，使用 `useLayoutEffect`。其他情况优先使用 `useEffect` 以避免阻塞页面渲染。

---

## 4. 性能优化 Hooks (useCallback / useMemo)

这两个 Hook 主要用于性能优化。

### 4.1 useMemo

**作用**：缓存计算结果。只有依赖项变化时才重新计算。
**场景**：避免昂贵的计算在每次渲染时都执行。

```javascript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

### 4.2 useCallback

**作用**：缓存函数引用。
**场景**：配合 `React.memo` 使用，防止父组件重渲染导致子组件不必要的重渲染（因为函数引用变了）。

```javascript
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

---

## 5. 引用 Hooks (useRef / useImperativeHandle)

### 5.1 useRef

**作用**：

1.  **访问 DOM**：类似于 `ref` 属性。
2.  **保存可变变量**：类似于 class 组件的实例属性 (`this.variable`)。修改 `.current` **不会触发组件重新渲染**。

**场景**：保存定时器 ID、保存上一次的 props、聚焦输入框。

```javascript
function Timer() {
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      // ...
    });
    return () => clearInterval(intervalRef.current);
  }, []);
}
```

### 5.2 useImperativeHandle

**作用**：可以让父组件调用子组件暴露的方法。通常配合 `forwardRef` 使用。

**场景**：父组件需要控制子组件的内部行为（如控制 Video 播放、滚动 List 到指定位置）。

```javascript
const FancyInput = React.forwardRef((props, ref) => {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
  }));
  return <input ref={inputRef} />;
});
```

---

## 6. 上下文 Hooks (useContext)

**作用**：接收一个 Context 对象（`React.createContext` 的返回值）并返回该 Context 的当前值。
**场景**：共享全局数据，如主题、用户认证信息、语言设置，避免 "Prop Drilling" (层层传递 props)。

```javascript
const ThemeContext = React.createContext("light");

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme === "dark" ? "#333" : "#fff" }}>
      I am styled by theme context!
    </button>
  );
}
```

**注意**：当 Context Provider 的 value 发生变化时，所有调用了 `useContext` 的组件都会重新渲染。

---

## 7. React 18 并发 Hooks (useTransition / useDeferredValue)

### 7.1 useTransition

**作用**：将某些更新标记为"非紧急" (Transition)。
**场景**：输入框输入时，过滤列表的渲染很耗时，可以用 `useTransition` 降低列表渲染的优先级，保证输入框流畅。

```javascript
const [isPending, startTransition] = useTransition();

function handleChange(e) {
  setInputValue(e.target.value); // 紧急更新 (输入框回显)
  startTransition(() => {
    setQuery(e.target.value); // 非紧急更新 (列表过滤)
  });
}
```

### 7.2 useDeferredValue

**作用**：延迟更新某个值。类似于防抖/节流，但是是基于渲染优先级的。
**场景**：基于用户输入渲染一个复杂的图表。

```javascript
const deferredQuery = useDeferredValue(query);
// 使用 deferredQuery 进行渲染，React 会在空闲时更新它
```

---

## 8. 自定义 Hooks

自定义 Hook 是一个函数，其名称以 "use" 开头，函数内部可以调用其他 Hook。

**示例：useWindowSize**

```javascript
import { useState, useEffect } from "react";

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}
```
