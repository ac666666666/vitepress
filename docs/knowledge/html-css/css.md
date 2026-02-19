# CSS 基础与面试题

[MDN CSS 文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS)

## 1. 盒模型 (Box Model)

<CssBoxModelDemo />

盒模型是 CSS 布局的基石，它规定了元素如何显示以及如何相互作用。

### 1.1 标准盒模型 vs 怪异盒模型

| 特性 | 标准盒模型 (`content-box`) | 怪异盒模型 (`border-box`) |
| :--- | :--- | :--- |
| **width 定义** | 只包含 `content` | 包含 `content` + `padding` + `border` |
| **实际占用宽度** | `width` + `padding` + `border` | `width` |
| **推荐指数** | ❌ 容易撑破布局 | ✅ (推荐) 布局更可控 |

**最佳实践**: 全局设置 `border-box`。

```css
/* 现代 CSS Reset 标配 */
*, *::before, *::after {
  box-sizing: border-box;
}
```

## 2. BFC (Block Formatting Context)

**块级格式化上下文**。你可以把它理解为一个独立的“黑盒子”，盒子内部的元素布局不会影响到外面，反之亦然。

### 2.1 触发条件 (常见)
1.  根元素 `<html>`。
2.  `float` 不为 `none`。
3.  `position` 为 `absolute` 或 `fixed`。
4.  `display` 为 `inline-block`, `flex`, `grid`, `flow-root`。
5.  `overflow` 不为 `visible` (如 `hidden`, `auto`)。

### 2.2 解决了什么问题？

1.  **清除浮动 (包含浮动元素)**: 父元素高度塌陷时，设置父元素 `overflow: hidden` (触发 BFC) 可让父元素包裹住浮动子元素。
2.  **防止 Margin 重叠 (Collapsing Margins)**: 同一个 BFC 下的垂直 Margin 会重叠。将两个元素分别放在不同的 BFC 容器中可避免。
3.  **自适应两栏布局**: 左侧浮动，右侧 `overflow: hidden` (触发 BFC)，右侧会自动填满剩余空间且不与左侧重叠。

## 3. 布局方案 (Layout)

### 3.1 Flexbox (弹性布局)

一维布局系统，适合处理行或列。

**常用属性**:
*   `justify-content`: 主轴对齐 (center, space-between)。
*   `align-items`: 交叉轴对齐 (center, stretch)。
*   `flex-direction`: 方向 (row, column)。
*   `flex-wrap`: 换行 (nowrap, wrap)。
*   `flex: 1`: 等同于 `flex-grow: 1; flex-shrink: 1; flex-basis: 0%`。

### 3.2 Grid (网格布局)

二维布局系统，适合处理复杂的行和列。

```css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr; /* 三列，中间宽 */
  gap: 20px; /* 间距 */
}
```

### 3.3 水平垂直居中方案

**方案一：Flex (推荐)**
```css
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

**方案二：Absolute + Transform (未知宽高)**
```css
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

**方案三：Grid (最简)**
```css
.parent {
  display: grid;
  place-items: center;
}
```

## 4. 响应式设计 (Responsive Design)

### 4.1 媒体查询 (Media Queries)
针对不同屏幕尺寸应用不同样式。

```css
@media (max-width: 768px) {
  .sidebar { display: none; }
}
```

### 4.2 相对单位
*   **rem**: 相对于根元素 (`html`) 的 `font-size`。
*   **em**: 相对于父元素的 `font-size`。
*   **vw/vh**: 相对于视口宽度/高度的 1%。

## 5. CSS 选择器与优先级

优先级 (Specificity) 计算规则：
1.  **!important**: 无穷大。
2.  **内联样式**: (1, 0, 0, 0)。
3.  **ID 选择器**: (0, 1, 0, 0)。
4.  **类/属性/伪类选择器**: (0, 0, 1, 0)。
5.  **标签/伪元素选择器**: (0, 0, 0, 1)。
6.  **通配符/继承**: (0, 0, 0, 0)。

**示例**: `#nav .list li a:hover` > `.box`
