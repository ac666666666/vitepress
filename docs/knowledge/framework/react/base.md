# React 基础与核心概念

[React 官方文档](https://react.dev/)

React 是一个用于构建用户界面的 JavaScript 库，其核心思想是 **组件化** 和 **声明式编程**。

## 1. 虚拟 DOM (Virtual DOM)

### 什么是虚拟 DOM？
虚拟 DOM 是一个轻量级的 JavaScript 对象，它是真实 DOM 的抽象表示。React 通过维护这样一个对象树来描述 UI 的状态。

```javascript
// JSX
const element = <h1 className="greeting">Hello, world!</h1>;

// 编译后的虚拟 DOM 对象 (简化版)
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};
```

### 为什么需要虚拟 DOM？
1.  **跨平台能力**：虚拟 DOM 只是一个 JS 对象，可以渲染到浏览器 (ReactDOM)、移动端 (ReactNative)、VR 等不同平台。
2.  **性能优化**：通过 Diff 算法比较新旧虚拟 DOM，只更新发生变化的部分，减少昂贵的真实 DOM 操作。
3.  **声明式 API**：让开发者关注状态变化，而不是手动操作 DOM。

---

## 2. 合成事件 (Synthetic Events)

React 实现了一套自己的事件系统，称为合成事件。

### 实现机制
1.  **事件委托**：React 17 之前将所有事件绑定到 `document` 上，React 17 之后绑定到 `root` 容器上。
2.  **统一封装**：React 将浏览器原生事件封装为 `SyntheticEvent`，抹平了不同浏览器的兼容性差异。

### 为什么要使用合成事件？
1.  **跨浏览器兼容**：解决 IE 等浏览器的兼容性问题。
2.  **性能优化**：利用事件委托，减少内存消耗（不需要为每个 DOM 节点绑定事件监听器）。
3.  **与虚拟 DOM 结合**：方便在组件销毁时统一移除事件监听，防止内存泄漏。

---

## 3. 类组件 vs 函数组件

### 类组件 (Class Component)
- 基于 ES6 Class。
- 有 `this` 指向。
- 有生命周期方法 (`componentDidMount` 等)。
- 状态管理通过 `this.state` 和 `this.setState`。

### 函数组件 (Function Component)
- 只是一个普通函数。
- 没有 `this`。
- 没有生命周期方法（使用 Hooks 模拟）。
- **捕获特性 (Capture Value)**：函数组件每次渲染都会创建新的闭包，捕获当前渲染时的 props 和 state。

### 面试题：类组件和函数组件的区别？
1.  **心智模型**：类组件是面向对象的，关注实例；函数组件是函数式的，关注输入输出。
2.  **状态逻辑复用**：函数组件通过 Hooks 复用逻辑更简单（自定义 Hooks），类组件需要 HOC 或 Render Props，容易导致嵌套地狱。
3.  **未来趋势**：React 官方推荐使用函数组件 + Hooks。

---

## 4. 框架 vs 原生 DOM

### 框架相比于原生解决了什么问题？
1.  **开发效率**：组件化开发，代码复用率高。
2.  **可维护性**：声明式编程，代码逻辑更清晰。
3.  **性能保障**：虽然直接操作 DOM 可能更快，但框架通过虚拟 DOM 和 Diff 算法，保证了在大多数场景下的性能下限，避免了低效的手动 DOM 操作。
4.  **跨平台**：一次学习，多端编写 (React Native)。

---

## 5. JSX 的本质

JSX 仅仅是 `React.createElement(component, props, ...children)` 的语法糖。

```javascript
// JSX
<MyButton color="blue" shadowSize={2}>
  Click Me
</MyButton>

// 编译后
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Click Me'
)
```
