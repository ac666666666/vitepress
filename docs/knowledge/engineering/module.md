# 模块化规范

[MDN ES Modules](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)

## 1. 为什么需要模块化？
在早期 JS 中，代码都在全局作用域，容易导致：
*   **命名冲突**: 变量被覆盖。
*   **依赖管理混乱**: 必须手动维护 `<script>` 标签的顺序。
*   **代码不可维护**: 缺乏封装。

---

## 2. CommonJS (CJS)

Node.js 采用的规范。

*   **语法**: `module.exports` 导出，`require()` 导入。
*   **特点**:
    *   **同步加载**: 适合服务端 (文件在本地硬盘)。不适合浏览器 (网络请求慢导致阻塞)。
    *   **运行时加载**: 可以在 `if` 语句中引用。
    *   **值拷贝**: 导出的是值的拷贝（基本类型），修改原模块内部变量不会影响已导入的值（除非是引用类型）。
    *   **缓存**: 模块加载一次后会被缓存，后续 require 直接返回缓存结果。

```javascript
// a.js
let count = 1;
function add() { count++; }
module.exports = { count, add };

// b.js
const { count, add } = require('./a');
console.log(count); // 1
add();
console.log(count); // 1 (因为是值拷贝，a.js 的变化不会同步过来)
```

---

## 3. ES Modules (ESM)

ECMAScript 官方标准 (ES6)。

*   **语法**: `export` / `export default` 导出，`import` 导入。
*   **特点**:
    *   **编译时输出接口**: 静态分析，必须在顶层，不能在 `if` 中。这使得 **Tree Shaking** 成为可能。
    *   **异步加载**: 适合浏览器。
    *   **引用传递**: 导入的是**只读引用** (Live Binding)。原模块值变了，导入的值也会变。

```javascript
// a.js
export let count = 1;
export function add() { count++; }

// b.js
import { count, add } from './a.js';
console.log(count); // 1
add();
console.log(count); // 2 (实时反映原模块变化)
```

---

## 4. CommonJS vs ESM (面试必问)

| 维度 | CommonJS | ES Modules |
| :--- | :--- | :--- |
| **环境** | Node.js (主要) | 浏览器, Node.js (新版) |
| **加载方式** | 运行时加载 (Runtime) | 编译时输出 (Compile-time) |
| **同步/异步** | 同步 | 异步 |
| **输出** | **值的拷贝** | **值的引用** (Live Binding) |
| **对象** | 导出是一个对象 | 导出是静态定义 |
| **Tree Shaking** | 难 | **支持** |

---

## 5. 其他规范 (历史)

### 5.1 AMD (Asynchronous Module Definition)
*   **代表**: RequireJS。
*   **特点**: 浏览器端，异步加载，**依赖前置** (一开始就加载所有依赖)。

### 5.2 UMD (Universal Module Definition)
*   **特点**: 通用模式。判断环境，如果是 CJS 就用 CJS，是 AMD 就用 AMD，否则挂载到 window。
*   **用途**: 开发兼容性强的类库。

```javascript
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory); // AMD
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(); // CommonJS
    } else {
        root.MyLib = factory(); // Browser Global
    }
}(this, function () {
    return {};
}));
```
