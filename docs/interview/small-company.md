# 小厂面经

这里收录了我在初创公司或小型企业的面试经历，这些公司往往更看重实战能力。

## 🏢 广州
- [**有米科技 / 有米云** (番禺大学城)](#youmi)
- [**MIB迈步科技**](#迈步科技)
- [**广州小迈**](#广州小迈)
- [**拓扑** (广州)](#拓扑-广州)
- [**区块链新科技** (广州)](#区块链新科技-广州)
- [**广州中科智城**](#广州中科智城)
- **洪弛**
- [**东田数码科技** (天河)](#东田数码科技-天河)
- [**华全九方** (越秀)](#华全九方-越秀)

## 🏢 佛山
- [**融山科技**](#融山科技-佛山)

---

## 东田数码科技 (天河)

### 📌 面试概览
- **岗位**：前端开发
- **特点**：基础八股文 (CSS/Vue)，移动端适配。

### 📝 核心知识点解析

#### 1. v-if vs v-show
| 维度 | v-if | v-show |
| :--- | :--- | :--- |
| **原理** | 真正的条件渲染 (DOM 销毁/重建) | CSS 切换 (`display: none`) |
| **开销** | 切换开销大 | 初始渲染开销大 |
| **场景** | 偶尔切换，权限控制 | 频繁切换 (如 Toggle 按钮) |

#### 2. 防抖 (Debounce) vs 节流 (Throttle)
- **防抖 (Debounce)**: 
  - **定义**: 触发后等待 n 秒执行，若中间再次触发，重新计时。
  - **场景**: 搜索框输入联想，窗口 resize。
- **节流 (Throttle)**: 
  - **定义**: n 秒内只执行一次。
  - **场景**: 滚动加载 (Scroll)，按钮防止重复提交。

#### 3. 前端三化 (模块化/组件化/工程化)
- **模块化 (JS 层面)**: 将代码拆分成独立的模块 (ESM, CommonJS)，解决命名冲突和依赖管理。
- **组件化 (UI 层面)**: 将页面拆分成可复用的组件 (Vue SFC)，包含 HTML/CSS/JS。
- **工程化 (流程层面)**: 使用工具链 (Webpack, Git, CI/CD) 提升开发效率和质量。

#### 4. 移动端适配方案
- **Rem**: 动态计算 `html` 字体大小。
- **VW/VH**: 视口百分比 (推荐)。
- **Media Query**: `@media screen and (max-width: 768px)` 响应式布局。

#### 5. 移动端 vs PC 端事件
- **PC**: `click`, `mousedown`, `mousemove`, `mouseup`.
- **Mobile**: `touchstart`, `touchmove`, `touchend`, `tap` (需库封装), `click` (有 300ms 延迟).

---

## 华全九方 (越秀)

### 📌 面试概览
- **岗位**：前端实习
- **特点**：Vue2 深度考察 (原理/封装/痛点)、ES6 基础。

### 📝 核心知识点解析

#### 1. ES6 新特性
- **声明**: `let` (块级作用域), `const` (常量)。
- **函数**: 箭头函数 `() => {}`。
- **结构**: 模板字符串, 解构赋值, 展开运算符 `...`。
- **模块**: `import` / `export` (ESM)。
- **异步**: `Promise`, `async/await`。
- **类**: `class`, `extends`。

#### 2. ES6 数组新增方法
- **遍历**: `forEach`, `map`, `filter`, `reduce`。
- **查找**: `find` (返回元素), `findIndex` (返回下标), `includes` (返回布尔值)。
- **转换**: `Array.from` (类数组转数组), `Array.of`。
- **打平**: `flat` (多维转一维)。

#### 3. Vue 2 响应式原理
- **核心**: `Object.defineProperty`。
- **流程**:
  1. **Observer**: 递归遍历对象属性，定义 `getter` (收集依赖) 和 `setter` (通知更新)。
  2. **Dep**: 依赖收集器，每个属性有一个 Dep。
  3. **Watcher**: 订阅者，组件渲染时会创建 Watcher，读取属性触发 getter，将自己加入 Dep。
  4. **Update**: 属性变化触发 setter -> Dep.notify() -> Watcher.update() -> 重新渲染。

#### 4. Axios 二次封装
- **目的**: 统一配置、错误处理、Token 注入。
- **步骤**:
  1. **创建实例**: `axios.create({ baseURL, timeout })`。
  2. **请求拦截**: `config.headers.Authorization = token`。
  3. **响应拦截**: 
     - 成功: 解构 `res.data`。
     - 失败: 统一 `Message.error(msg)`，处理 401 跳转登录。

#### 5. Vue 2 的痛点
- **TS 支持差**: `this` 类型推断困难。
- **逻辑复用难**: Mixins 导致命名冲突、来源不清晰。
- **性能瓶颈**: 初始化需递归遍历所有属性 (慢)，无法 Tree-shaking (体积大)。
- **响应式缺陷**: 无法监听对象新增/删除属性，无法监听数组索引变化。

---

## 融山科技 (佛山)

### 📌 面试概览
- **岗位**：前端开发
- **轮次**：第三次面试
- **特点**：全方位考察 (Vue3, CSS, 工程化, 部署, Node)。

### 📝 核心知识点解析

#### 1. Vue 2 vs Vue 3 核心区别
| 维度 | Vue 2 | Vue 3 |
| :--- | :--- | :--- |
| **响应式** | `Object.defineProperty` | `Proxy` (更快, 支持数组/Map) |
| **API** | Options API (配置式) | Composition API (组合式, 逻辑复用强) |
| **TS 支持** | 弱 (需装饰器) | 原生支持，类型推断完美 |
| **根节点** | 只能一个 | 支持多个 (Fragment) |
| **生命周期** | `beforeDestroy` | `onBeforeUnmount` |

#### 2. CSS 水平垂直居中 (Flex/Grid)
```css
/* Flex 方案 (推荐) */
.center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Grid 方案 (极简) */
.center-grid {
  display: grid;
  place-items: center;
}

/* 绝对定位 (已知宽高) */
.center-abs {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -50px; /* 宽的一半 */
  margin-top: -50px;  /* 高的一半 */
}
```

#### 3. Webpack vs Vite
- **Webpack**: 
  - **Bundle-based**: 启动时需打包所有模块。
  - **生态**: Loader/Plugin 丰富，适合大型复杂项目。
- **Vite**: 
  - **ESM-based**: 浏览器直接请求模块，按需编译。
  - **速度**: 秒级启动，热更新 (HMR) 极快。
  - **生产**: 使用 Rollup 打包。

#### 4. WebSocket 优缺点
- **优点**: 
  - **全双工**: 客户端和服务端可同时发送消息。
  - **实时性**: 低延迟 (如聊天、股票)。
  - **开销小**: 建立连接后，头部信息少。
- **缺点**: 
  - 需心跳检测保活。
  - 某些防火墙可能拦截。

#### 5. Node.js 版本兼容性
- **问题**: 老项目依赖 Node 10，新项目依赖 Node 18。
- **方案**:
  - **NVM (Node Version Manager)**: 命令行切换 (`nvm use 14`)。
  - **Volta**: 项目级锁定工具 (自动切换)。
  - **Docker**: 容器化部署，环境完全隔离。

---

## 有米科技 / 有米云 {#youmi}

### 📌 面试概览
- **时长**：47分钟 (线上)
- **体验**：网络卡顿，面试官边干活边面。
- **业务**：数据可视化 (大学城)。
- **特点**：考察工程化理解、性能优化、HTTP 缓存。

### 📝 核心知识点解析

#### 1. 打包的通俗解释
- **类比**：
  - **源代码** = 散落的乐高积木（模块化文件）。
  - **打包** = 拼装好的成品模型（Bundle）。
  - **过程**：将浏览器无法直接运行的 `.vue`, `.ts`, `.less` 文件，翻译并压缩成浏览器能看懂的 `html/css/js`。

#### 2. 图片懒加载 (Lazy Load)
- **原理**：图片 `src` 设为占位图，真实地址存放在 `data-src`。当图片进入视口时，替换 `src`。
- **方案一：IntersectionObserver (推荐)**
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src; // 替换真实地址
      observer.unobserve(img);   // 停止观察
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
```
- **方案二：HTML5 原生属性**
```html
<img src="real.jpg" loading="lazy" />
```

#### 3. HTTP Vary 响应头
- **作用**：告诉缓存服务器（CDN/代理），缓存的版本不仅取决于 URL，还取决于请求头中的某些字段。
- **场景**：移动端和 PC 端访问同一个 URL，但返回内容不同。
- **示例**：`Vary: User-Agent` (根据 UA 区分缓存)。

#### 4. 图表大数据量优化
- **降采样 (LTTB 算法)**：保持波峰波谷特征，减少数据点。
- **Canvas 渲染**：ECharts 开启 `renderer: 'canvas'` (默认)。
- **分片加载**: 不要一次性把 10w 条数据塞给图表，配合后端分页。
- **虚拟滚动**: 仅渲染可视区域的数据点。

#### 5. Git Merge vs Rebase
| 维度 | Merge | Rebase |
| :--- | :--- | :--- |
| **提交历史** | 真实记录，有分叉 | 线性整洁，无分叉 |
| **冲突处理** | 一次性处理 | 每个 Commit 都可能需要处理 |
| **适用场景** | 公共分支 (master/dev) | 个人开发分支同步代码 |

> **面试官追问**: 什么时候用 Rebase？
> **答**: 在自己的 feature 分支开发时，为了同步 master 的最新代码，使用 `git rebase master`，保持提交记录清晰。

#### 6. 箭头函数 vs 普通函数
| 特性 | 普通函数 | 箭头函数 |
| :--- | :--- | :--- |
| **this** | 动态绑定 (谁调用指向谁) | 静态绑定 (定义时外层作用域) |
| **arguments** | 有 | 无 (用 `...args` 代替) |
| **构造函数** | 可以 `new` | 不可以 `new` |
| **原型** | 有 `prototype` | 无 |

**场景**：回调函数（如 `setTimeout`, `map`）常用箭头函数以保留外层 `this`。

#### 7. 强缓存 vs 协商缓存
| 类型 | 响应头字段 | 优先级 | 生效结果 |
| :--- | :--- | :--- | :--- |
| **强缓存** | `Cache-Control` (max-age), `Expires` | 高 | 200 (from disk/memory cache) |
| **协商缓存** | `ETag` / `If-None-Match`, `Last-Modified` / `If-Modified-Since` | 低 | 304 (Not Modified) |

**补充字段**：
- `Pragma` (HTTP/1.0 时代的强缓存，兼容用)。

#### 8. SSR (服务端渲染) 优点
1. **SEO 友好**：爬虫可以直接抓取完整的 HTML 内容。
2. **首屏加载快 (FCP)**：无需等待 JS 下载执行完毕，浏览器直接渲染 HTML。
3. **缺点**：服务器压力大，开发限制多 (无 `window` 对象)。

---

## 迈步科技

### 📌 面试概览
- **时长**：22分钟
- **体验**：纯八股，未问项目/实习。
- **业务**：官网 + APP (国际化)。
- **结果**：Offer (面评优秀)。

### 📝 核心知识点解析

#### 1. CSS 选择器优先级 (权重)
- **!important** (∞) > **行内样式** (1000) > **ID** (100) > **类/属性/伪类** (10) > **标签/伪元素** (1) > **通配符** (0)。

#### 2. BFC (块级格式化上下文)
- **触发条件**：
  - `overflow: hidden / auto`
  - `display: flex / grid / inline-block`
  - `position: absolute / fixed`
  - `float: left / right`
- **作用**：
  - 清除浮动 (解决父元素高度塌陷)。
  - 防止 Margin 重叠。
  - 阻止元素被浮动元素覆盖 (两栏自适应布局)。

#### 3. React 虚拟 DOM
- **本质**：JS 对象 (`React.createElement` 的返回值)。
- **优点**：
  - 批量更新 (Batch Update)，减少重排重绘。
  - 跨平台 (React Native)。

#### 4. React Key 的作用
- **核心**：在 Diff 算法中标识节点。
- **场景**：列表渲染。
- **不建议用 Index**：如果列表发生增删/排序，Index 会变，导致 Diff 错误复用，引起状态混乱（如输入框内容错位）。

#### 5. typeof vs instanceof
| 方法 | 原理 | 适用场景 | 缺点 |
| :--- | :--- | :--- | :--- |
| **typeof** | 检查机器码类型标签 | 基础类型 (string, number...) | `null` 返回 'object', 引用类型全返回 'object' |
| **instanceof** | 检查原型链 (`prototype`) | 引用类型 (Array, Date...) | 基础类型失效，跨 iframe 失效 |

**通用方案**：`Object.prototype.toString.call(val)`。

---

## 广州小迈

### 📌 面试概览
- **时长**：30分钟
- **业务**：H5 + 后台。
- **特点**：考察 Webpack 优化、跨域、存储。

### 📝 核心知识点解析

#### 1. Webpack 打包优化
- **构建速度**：
  - `cache-loader` (缓存)。
  - `thread-loader` (多进程)。
  - `include/exclude` (缩小构建范围)。
- **产物体积**：
  - `Tree Shaking` (去除无用代码)。
  - `Code Splitting` (代码分割，SplitChunks)。
  - `Gzip` (压缩)。
  - 图片压缩 (`image-webpack-loader`)。

#### 2. 浏览器存储对比
| 特性 | Cookie | LocalStorage | SessionStorage |
| :--- | :--- | :--- | :--- |
| **大小** | 4KB | 5MB | 5MB |
| **有效期** | 可设过期时间 | 永久 | 窗口关闭即销毁 |
| **请求携带** | 自动携带 | 不携带 | 不携带 |

#### 3. 跨域 (CORS)
- **同源策略**：协议 + 域名 + 端口 必须一致。
- **跨域是谁阻止的？**：**浏览器**。服务器正常响应，但浏览器拦截了 JS 读取响应结果。
- **解决方案**：
  - **CORS** (后端设置 `Access-Control-Allow-Origin`)。
  - **Nginx 反向代理** (同源转发)。
  - **DevServer Proxy** (开发环境代理)。

---

## 广州中科智城

### 📌 面试概览
- **时长**：30分钟
- **业务**：智慧城市、物联网 (IoT)
- **技术栈**：Uniapp, Vue 3
- **特点**：考察 Uniapp 与 Vue 的差异、移动端适配。

### 📝 核心知识点解析

#### 1. Uniapp 生命周期 vs Vue 生命周期
- **Vue 生命周期**: 针对组件 (Component)。
  - `created`, `mounted`, `updated`, `destroyed` (Vue2)
  - `setup`, `onMounted`, `onUpdated`, `onUnmounted` (Vue3)
- **Uniapp 生命周期**: 分为**应用**和**页面**。
  - **应用 (App)**: `onLaunch` (初始化), `onShow` (切前台), `onHide` (切后台)。
  - **页面 (Page)**: `onLoad` (加载), `onShow` (显示), `onPullDownRefresh` (下拉刷新)。
- **关系**: Uniapp 的组件生命周期与 Vue 标准一致。

#### 2. 移动端适配单位对比
| 单位 | 含义 | 特点 | 适用场景 |
| :--- | :--- | :--- | :--- |
| **px** | 像素 | 绝对单位，不随屏幕变 | PC 端固定布局 |
| **em** | 相对父元素字体 | 嵌套易混乱 | 字体图标 |
| **rem** | 相对根元素 (`html`) | 配合 JS 动态设置根字体大小 | 移动端 H5 适配 |
| **rpx** | 微信小程序单位 | 750rpx = 屏幕宽度 | 小程序/Uniapp 自适应 |
| **vw/vh** | 视口百分比 | 1vw = 1% 视口宽 | 现代移动端推荐 |

#### 3. ES6 新特性 (常用)
- **解构赋值**: `const { name } = obj;`
- **扩展运算符**: `const arr2 = [...arr1];`
- **模板字符串**: `` `Hello ${name}` ``
- **箭头函数**: `() => {}` (this 指向外层)
- **Promise / Async / Await**: 异步编程终极解决方案。

**代码示例 (Promise)**:
```javascript
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('Data loaded'), 1000);
  });
};

async function init() {
  const data = await fetchData();
  console.log(data);
}
```

#### 4. 前端性能优化 (通用)
- **网络层**: HTTP2, CDN, Gzip, 强缓存/协商缓存。
- **构建层**: Webpack Tree Shaking, 代码分割, 图片压缩。
- **渲染层**: 减少重排重绘, 虚拟列表, 图片懒加载。

---

## 拓扑 (广州)

### 📌 面试概览
- **岗位**：日常实习
- **时长**：20分钟聊业务 + 技术问答
- **特点**：考察 ES6, Promise, 工程化, AI 观点。

### 📝 核心知识点解析

#### 1. v-for 为什么要用 Key？
- **核心**: 帮助 Vue 的 Diff 算法识别节点身份。
- **无 Key**: 默认使用“就地更新”策略。如果数据顺序改变，Vue 会复用 DOM 元素，只更新内容。这会导致子组件状态 (如输入框内容) 错乱。
- **有 Key**: Vue 可以根据 Key 追踪节点，进行移动、复用或销毁，保证状态正确。

#### 2. Promise 详解
- **状态**: `Pending` (进行中) -> `Fulfilled` (成功) / `Rejected` (失败)。状态不可逆。
- **方法**:
  - `then/catch/finally`: 链式调用。
  - `Promise.all`: 并发执行，全部成功才成功，一个失败即失败。
  - `Promise.race`: 竞速，谁先返回用谁。

#### 3. 前端工程化
- **定义**: 使用软件工程的方法来开发前端。
- **包含**:
  - **模块化**: ESM, CommonJS.
  - **组件化**: Vue/React 组件。
  - **规范化**: ESLint, Prettier, Husky (Git Hooks).
  - **自动化**: CI/CD (Jenkins, GitHub Actions), 自动化测试.

#### 4. AI 开发观点
- **趋势**: AI (Copilot, Cursor) 已成为标配。
- **态度**: 拥抱 AI，成为“超级程序员” (业务为主, 技术为辅)。
- **主导**: 开发者主导逻辑与架构，AI 负责填充细节与重复劳动。

---

## 区块链新科技 (广州)

### 📌 面试概览
- **特点**：实习拷打、开源项目、JS 底层。
- **结果**：Offer (已拒，薪资低)。

### 📝 核心知识点解析

#### 1. JS 原型链 (Prototype Chain)
- **概念**: 每个对象都有 `__proto__` 指向它的构造函数的 `prototype`。
- **链条**: `obj -> Object.prototype -> null`。
- **作用**: 属性查找。访问 `obj.a`，如果自身没有，去 `__proto__` 找，直到 `null`。

#### 2. Set 使用场景
- **去重**: `[...new Set(arr)]`.
- **集合运算**: 并集, 交集, 差集.
- **特点**: 只有值 (Value)，没有键 (Key)，值唯一。

#### 3. 项目架构
- **Monorepo**: 一个仓库管理多个项目 (pnpm workspace, Turborepo)。
- **微前端**: qiankun, wujie.
- **分层**: 
  - **UI 层**: 组件库.
  - **逻辑层**: Hooks / Utils.
  - **数据层**: Axios / Store.

