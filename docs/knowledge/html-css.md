# HTML & CSS 高频面试题

## 1. 盒模型 (Box Model)
CSS 盒模型本质上是一个盒子，封装周围的 HTML 元素。它包括：边距（margin）、边框（border）、填充（padding）、和实际内容（content）。

### 标准盒模型 vs 怪异盒模型
- **标准盒模型 (`content-box`)**：
  `width` = 内容宽度
  总宽度 = `width` + `padding` + `border` + `margin`
- **怪异盒模型 (`border-box`)**：
  `width` = 内容宽度 + `padding` + `border`
  总宽度 = `width` + `margin`

```css
/* 推荐设置 */
* {
  box-sizing: border-box;
}
```

## 2. BFC (Block Formatting Context)
块级格式化上下文，是一个独立的渲染区域，让处于 BFC 内部的元素与外部的元素相互隔离，使内外元素的定位不会相互影响。

### 触发条件：
1. `html` 根元素
2. `float` 不为 `none`
3. `position` 为 `absolute` 或 `fixed`
4. `overflow` 不为 `visible` (如 `hidden`, `auto`)
5. `display` 为 `flex`, `inline-block`, `table-cell` 等

### 常见应用：
- 清除浮动
- 防止 margin 重叠
- 自适应两栏布局

## 3. 水平垂直居中方案

### 方案一：Flex 布局 (推荐)
```css
.container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
}
```

### 方案二：Absolute + Transform
```css
.box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```
