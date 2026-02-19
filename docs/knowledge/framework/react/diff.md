# React Diff 算法深度解析

[React 官方文档](https://react.dev/)

React 的核心是 **声明式编程**，我们只需描述数据变化，React 负责更新 DOM。Diff 算法就是这一过程的核心。

## 1. 传统 Diff 算法 vs React Diff 算法

### 传统 Diff
计算两棵树的最小差异，时间复杂度为 **O(n^3)**。对于复杂的 UI 结构，这几乎是不可接受的。

### React Diff 优化 (Heuristic O(n))
React 基于三个假设，将复杂度降低到了 **O(n)**：
1.  **Web UI 中 DOM 节点跨层级的移动操作特别少**：可以忽略不计。
2.  **拥有相同类的两个组件将生成相似的树形结构，拥有不同类的两个组件将生成不同的树形结构**。
3.  **对于同一层级的一组子节点，它们可以通过唯一 id (key) 进行区分**。

---

## 2. Diff 策略 (Tree Diff, Component Diff, Element Diff)

### 2.1 Tree Diff (层级比较)
React 只对同层级的节点进行比较。
- 如果一个节点在旧树中存在，新树中不存在，则直接删除该节点及其子节点。
- 如果一个节点在旧树中不存在，新树中存在，则直接插入该节点。
- **注意**：如果 DOM 节点跨层级移动，React 不会复用，而是直接销毁重建。

### 2.2 Component Diff (组件比较)
-如果是同一类型的组件，按照原策略继续比较 Virtual DOM 树。
- 如果不是，则将该组件判断为 dirty component，从而替换整个组件下的所有子节点。
- **优化**：可以通过 `shouldComponentUpdate` 或 `React.memo` 手动控制组件是否更新。

### 2.3 Element Diff (元素比较)
当节点处于同一层级时，React 提供三种操作：**INSERT_MARKUP** (插入)、**MOVE_EXISTING** (移动)、**REMOVE_NODE** (删除)。

---

## 3. Key 的作用

Key 是 React 在 Diff 算法中用于追踪列表中元素身份的唯一标识。

### 为什么不能用 index 作为 key？
如果列表项顺序发生变化（如在头部插入、排序、过滤），使用 index 作为 key 会导致：
1.  **性能问题**：React 误以为所有元素都变了，导致大量不必要的 DOM 更新。
2.  **状态错乱**：如果是包含状态的组件（如输入框），状态可能会绑定到错误的组件上。

### 正确做法
使用数据中的唯一 ID (如数据库 ID) 作为 key。

---

## 4. 静态节点分析 (Static Analysis)

### React 为什么不能进行静态节点分析？
React 使用 **JSX**，JSX 本质上是 JavaScript 的语法糖，它非常灵活。
- 组件可以在运行时动态生成。
- 属性可以是任意 JS 表达式。
- `children` 可以是任意类型。

由于这种灵活性，编译器很难在编译阶段确定哪些部分是静态的，哪些是动态的。因此 React 每次 render 都会重新生成完整的 Virtual DOM 树进行全量 Diff。

### Vue 的优势 (Template)
Vue 使用 **模板 (Template)**，结构相对固定。Vue 3 的编译器可以在编译阶段：
1.  **标记静态节点 (Static Hoisting)**：直接提升，不参与 Diff。
2.  **标记动态节点 (Patch Flags)**：通过位运算标记该节点是 class 变了、style 变了还是 text 变了。
3.  **Block Tree**：将模版切分为块，Diff 时只遍历动态节点块。

这是 Vue 3 性能优于 React 的重要原因之一。
