# 虚拟 DOM 与 Diff 算法深度剖析

[Vue.js 官方文档](https://cn.vuejs.org/)

虚拟 DOM (Virtual DOM) 和 Diff 算法是 Vue 能够高效渲染的核心机制。

## 1. 虚拟 DOM 本质

虚拟 DOM 仅仅是一个普通的 JavaScript 对象 (VNode)，用来描述真实 DOM 的结构。

```javascript
const vnode = {
  tag: "div",
  props: { id: "app", class: "container" },
  children: [
    { tag: "h1", children: "Hello Vue" },
    { tag: "p", children: "Content..." },
  ],
};
```

**优点**:

1.  **性能优化**: 将多次 DOM 操作合并为一次 (Batch Update)。
2.  **跨平台**: VNode 不依赖浏览器环境，可以渲染到 Weex, 小程序, SSR 等。

---

## 2. Diff 算法详解

Diff 算法的目的是找出新旧 VNode 之间的差异，并最小化 DOM 操作。

### 2.1 比较策略 (优化假设)

为了将复杂度从 O(n^3) 降低到 O(n)，Vue 做了一些假设：

1.  **同层比较**: 只比较同一层级的节点，不跨层比较。
2.  **类型检测**: 如果标签名不同，直接销毁旧节点，创建新节点 (不再深入比较子节点)。
3.  **Key 标识**: 使用 `key` 来复用同一层级的节点。

### 2.2 Vue 2: 双端 Diff (Double-ended Diff)

Vue 2 采用四个指针，从两端向中间进行比较。

- `oldStartIdx` / `oldEndIdx`
- `newStartIdx` / `newEndIdx`

**比较流程**:

1.  **头头比较**: `oldStart` vs `newStart` (相同则 patch，索引右移)。
2.  **尾尾比较**: `oldEnd` vs `newEnd` (相同则 patch，索引左移)。
3.  **头尾比较**: `oldStart` vs `newEnd` (相同则 patch，将 `oldStart` 移动到 `oldEnd` 后面)。
4.  **尾头比较**: `oldEnd` vs `newStart` (相同则 patch，将 `oldEnd` 移动到 `oldStart` 前面)。
5.  **Key 查找**: 如果以上都不中，拿 `newStart` 的 key 去 `oldCh` 的 map 中查找。找到则移动，没找到则新建。

### 2.3 Vue 3: 快速 Diff (Fast Diff)

Vue 3 引入了 **最长递增子序列 (Longest Increasing Subsequence, LIS)** 算法，进一步减少 DOM 移动操作。

**流程**:

1.  **预处理**: 处理头部和尾部相同的节点 (Sync from start/end)。
2.  **剩余节点处理**:
    - 如果新节点已遍历完，旧节点还有剩 -> 删除旧节点。
    - 如果旧节点已遍历完，新节点还有剩 -> 挂载新节点。
    - **乱序部分**:
      - 建立新节点的 `key:index` 映射。
      - 初始化 `newIndexToOldIndexMap` 数组。
      - 遍历旧节点，填充 map，标记是否需要移动 (`moved` 标志)。
      - 如果需要移动，计算 **LIS**。LIS 对应的节点保持不动，其他节点根据 LIS 结果进行移动或插入。

---

## 3. PatchFlag (Vue 3 编译优化)

Vue 2 的 Diff 是全量比较，即使是静态节点也会参与比较。
Vue 3 在编译阶段对动态节点进行了标记 (**PatchFlag**)。

```javascript
// 编译前
<div>
  <span>static</span>
  <span :id="id">{{ msg }}</span>
</div>

// 编译后的 VNode (伪代码)
{
  type: 'div',
  children: [
    { type: 'span', children: 'static' }, // 静态节点
    {
      type: 'span',
      children: ctx.msg,
      props: { id: ctx.id },
      patchFlag: 9 // TEXT + PROPS
    }
  ]
}
```

**运行时优化**:

- Diff 时，如果遇到静态节点 (没有 PatchFlag)，直接跳过。
- 如果有 PatchFlag，根据 Flag 的值仅比较对应的内容 (如只比较 Text，或只比较 Props)。
- **Block Tree**: 将模版切分为 Block，配合 PatchFlag，Diff 速度与**动态节点数量**相关，与模板大小无关。

---

## 4. Key 的重要性

`key` 是 VNode 的唯一标识。

### 为什么不推荐用 index 作为 key？

1.  **性能浪费**: 如果在列表头部插入一个元素，会导致所有元素的 index 发生变化，Vue 会认为所有元素都变了，导致全部重新渲染 (虽然复用了 DOM，但子组件状态可能错乱)。
2.  **状态错乱**: 如果列表中包含有状态的组件 (如输入框)，使用 index 做 key 会导致输入框的内容保留在错误的位置 (就地复用策略)。

**结论**: 始终使用后端返回的唯一 ID (如 `id`, `uuid`) 作为 key。
