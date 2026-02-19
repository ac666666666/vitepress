# DOM 与 BOM

[MDN JavaScript 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

## 1. DOM 事件机制 (Event Mechanism)

<EventPropagationDemo />

### 1.1 事件流 (Event Flow)

DOM 事件流分为三个阶段：

1.  **捕获阶段 (Capturing Phase)**: 事件从 Window 向下传播到目标元素 (Window -> Document -> HTML -> Body -> ... -> Target)。
2.  **目标阶段 (Target Phase)**: 事件到达目标元素。
3.  **冒泡阶段 (Bubbling Phase)**: 事件从目标元素向上传播到 Window (Target -> ... -> Body -> HTML -> Document -> Window)。

### 1.2 事件绑定

```javascript
// 1. HTML 属性 (不推荐)
// <button onclick="alert('hi')">Click</button>

// 2. DOM 属性 (同类型只能绑一个，后覆盖前)
element.onclick = function() { ... };

// 3. addEventListener (推荐)
// element.addEventListener(event, function, useCapture)
// useCapture: true (捕获阶段触发), false (冒泡阶段触发，默认)
element.addEventListener('click', fn, false);
```

### 1.3 阻止传播与默认行为

- `e.stopPropagation()`: 阻止事件继续传播 (捕获或冒泡)。
- `e.stopImmediatePropagation()`: 阻止事件继续传播，**并且**阻止当前元素上后续绑定的同类型事件监听器执行。
- `e.preventDefault()`: 阻止默认行为 (如链接跳转、表单提交)。

### 1.4 事件委托 (Event Delegation)

利用**事件冒泡**机制，将事件绑定在父元素上，通过 `e.target` 判断实际触发的元素。

**优点**:

1.  **节省内存**: 不需要给每个子元素绑定事件。
2.  **动态绑定**: 新增的子元素也能响应事件，无需重新绑定。

```javascript
// 场景：给 1000 个 li 绑定点击事件
const ul = document.querySelector("ul");
ul.addEventListener("click", function (e) {
  // 检查点击的是否是 li
  if (e.target.tagName.toLowerCase() === "li") {
    console.log("Clicked:", e.target.innerText);
  }
});
```

## 2. DOM 操作详解

### 2.1 节点获取

| 方法                     | 描述                      | 返回值         | 静态/动态           |
| :----------------------- | :------------------------ | :------------- | :------------------ |
| `getElementById`         | 根据 ID 获取              | Element / null | -                   |
| `getElementsByClassName` | 根据类名获取              | HTMLCollection | **动态** (实时更新) |
| `getElementsByTagName`   | 根据标签名获取            | HTMLCollection | **动态** (实时更新) |
| `querySelector`          | 根据 CSS 选择器获取第一个 | Element / null | 静态                |
| `querySelectorAll`       | 根据 CSS 选择器获取所有   | NodeList       | **静态** (快照)     |

**注意**: `HTMLCollection` 是动态的，DOM 变了它会自动变；`NodeList` (querySelectorAll 返回的) 是静态的。

### 2.2 节点操作

- **创建**: `document.createElement('div')`, `document.createTextNode('text')`
- **添加**: `parent.appendChild(node)`, `parent.insertBefore(newNode, refNode)`
- **删除**: `parent.removeChild(node)`, `node.remove()` (ES6)
- **替换**: `parent.replaceChild(newNode, oldNode)`
- **克隆**: `node.cloneNode(true)` (true 表示深克隆，包含子节点)

### 2.3 innerHTML vs innerText vs textContent

| 属性          | 描述                                         | 安全性             | 回流 (Reflow)             |
| :------------ | :------------------------------------------- | :----------------- | :------------------------ |
| `innerHTML`   | 解析 HTML 标签                               | 低 (易受 XSS 攻击) | 是 (复杂渲染)             |
| `innerText`   | 仅文本 (受 CSS 影响，如 display:none 不显示) | 高                 | **是** (需要计算样式)     |
| `textContent` | 仅文本 (原始内容，包含 script/style 内容)    | 高                 | **否** (仅重绘，性能最好) |

## 3. 回流 (Reflow) 与重绘 (Repaint)

### 3.1 概念

- **回流 (Reflow / Layout)**: 当渲染树的一部分必须更新，且影响了节点的**几何信息** (宽高、位置、隐藏) 时，浏览器需要重新计算布局。开销非常大。
- **重绘 (Repaint)**: 当元素的样式改变 (如颜色、背景)，但不影响布局时，浏览器重绘该元素。开销较小。

**关系**: **回流必将引起重绘，重绘不一定引起回流。**

### 3.2 触发回流的操作

1.  添加/删除 DOM 元素。
2.  改变元素位置 (margin, padding, left, top)。
3.  改变元素尺寸 (width, height, border)。
4.  改变内容 (文本变化，图片大小变化)。
5.  **读取某些属性** (强制刷新队列): `offsetTop`, `scrollTop`, `clientTop`, `getComputedStyle()`.

### 3.3 性能优化策略

1.  **避免频繁操作 DOM**: 使用 `DocumentFragment` 或先拼接好 HTML 字符串再一次性插入。
2.  **读写分离**: 不要交替读写布局属性 (会导致浏览器无法优化渲染队列)。

    ```javascript
    // Bad (触发两次回流)
    div.style.left = div.offsetLeft + 1 + "px";
    div.style.top = div.offsetTop + 1 + "px";

    // Good (读写分离)
    const left = div.offsetLeft;
    const top = div.offsetTop;
    div.style.left = left + 1 + "px";
    div.style.top = top + 1 + "px";
    ```

3.  **脱离文档流**: 对复杂的动画元素使用 `position: absolute` 或 `fixed`，使其脱离文档流，减少对其他元素的影响。
4.  **CSS3 硬件加速**: 使用 `transform`, `opacity` 做动画，不会触发回流/重绘 (由 GPU 处理)。
5.  **display: none**: 先隐藏元素 (`display: none` 触发一次回流)，进行 100 次修改，再显示 (`display: block` 触发一次回流)。

## 4. BOM (Browser Object Model)

### 4.1 location 对象

`window.location` 用于获取或设置地址栏信息。

- `href`: 完整 URL (`http://example.com:8080/path?q=1#hash`)
- `protocol`: 协议 (`http:`)
- `host`: 主机名+端口 (`example.com:8080`)
- `hostname`: 主机名 (`example.com`)
- `port`: 端口 (`8080`)
- `pathname`: 路径 (`/path`)
- `search`: 查询字符串 (`?q=1`)
- `hash`: 哈希值 (`#hash`)
- `reload()`: 刷新页面。
- `replace(url)`: 跳转页面 (不记录历史)。
- `assign(url)`: 跳转页面 (记录历史)。

### 4.2 history 对象

SPA (单页应用) 路由的核心原理。

- `back()`, `forward()`, `go(n)`: 前进后退。
- `pushState(state, title, url)`: 添加一条历史记录，**不刷新页面**。
- `replaceState(state, title, url)`: 替换当前历史记录，**不刷新页面**。
- `popstate` 事件: 当点击浏览器前进/后退按钮时触发。

### 4.3 navigator 对象

- `userAgent`: 用户代理字符串 (识别浏览器/设备)。
- `clipboard`: 剪贴板 API (异步)。
- `geolocation`: 地理位置 API。

## 5. Ajax vs Fetch

### 5.1 Ajax (XMLHttpRequest)

传统方式，回调地狱风险。

```javascript
const xhr = new XMLHttpRequest();
xhr.open("GET", "/api/data");
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    console.log(JSON.parse(xhr.responseText));
  }
};
xhr.send();
```

### 5.2 Fetch API (Modern)

基于 Promise，语法简洁，但有一些坑 (如 404/500 不会 reject)。

```javascript
fetch("/api/data")
  .then((response) => {
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  })
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```
