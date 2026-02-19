# React 进阶模式与技巧

[React 官方文档](https://react.dev/)

## 1. 高阶组件 (HOC)

### 定义
高阶组件 (Higher-Order Component) 是一个函数，接收一个组件作为参数，返回一个新的组件。
`const EnhancedComponent = higherOrderComponent(WrappedComponent);`

### 作用
- **逻辑复用**：如权限控制、日志记录、数据获取。
- **渲染劫持**：控制组件是否渲染、加载中状态。
- **Props 增强**：注入新的 props。

### 示例：withAuth
```javascript
function withAuth(Component) {
  return function (props) {
    const isLogin = localStorage.getItem('token');
    if (!isLogin) return <Login />;
    return <Component {...props} />;
  };
}
```

---

## 2. Render Props

### 定义
Render Prop 是指一种在 React 组件之间使用一个值为函数的 prop 共享代码的简单技术。

### 示例：Mouse Tracker
```javascript
<Mouse render={mouse => (
  <Cat mouse={mouse} />
)}/>
```

### 优缺点
- **优点**：逻辑复用灵活，解决了 HOC 的命名冲突问题。
- **缺点**：容易导致 "Callback Hell" (嵌套过深)。Hooks 出现后，Render Props 使用场景减少。

---

## 3. 受控组件与非受控组件

### 受控组件 (Controlled Component)
表单元素的值由 React 的 state 控制。
- **特点**：数据流是单向的，`value` 绑定 state，`onChange` 更新 state。
- **优点**：支持即时验证、条件禁用等。

```javascript
<input value={value} onChange={e => setValue(e.target.value)} />
```

### 非受控组件 (Uncontrolled Component)
表单元素的值由 DOM 自身维护。
- **特点**：使用 `ref` 获取 DOM 元素的值。
- **优点**：代码量少，集成非 React 代码方便。
- **场景**：文件上传 (`<input type="file">`)。

```javascript
const inputRef = useRef(null);
// 获取值：inputRef.current.value
<input ref={inputRef} />
```

---

## 4. Portals (传送门)

Portals 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案。

### 场景
- Modal 对话框
- Tooltip
- Hover Card

```javascript
ReactDOM.createPortal(child, container)
```
即使 Portal 渲染在父组件 DOM 结构之外，它 **依然存在于 React 组件树中**，事件冒泡依然有效。
