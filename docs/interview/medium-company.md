# 中厂面经

这里收录了我在中型互联网公司/独角兽企业的面试经历。

## 🏢 广州
- [**滴普科技**](#滴普科技-广州)
- [**三维家**](#三维家-广州)
- [**汇量科技**](#汇量科技-广州)
- [**钛动科技**](#钛动科技)
- [**太平洋网络**](#太平洋网络)

## 🏢 深圳
- [**吉比特 / 雷霆游戏** (深圳)](#吉比特-雷霆游戏-深圳)
- [**编程猫** (深圳)](#编程猫-深圳)

## 🏢 上海
- [**上海数数科技**](#上海数数科技)
- [**上海游族网络**](#上海游族网络)

## 🏢 杭州
- [**新通教育**](#新通教育-杭州)
- [**七牛云**](#七牛云-杭州)

---

## 七牛云 (杭州)

### 📌 面试概览
- **时长**：17分钟 (凉经)
- **特点**：时间短，考察React/Vue对比、项目场景设计、区块链。

### 📝 核心知识点解析

#### 1. 场景设计题
**题目**: 假如你是组长，如何安排开发一个包含产品展示、运用、后台的应用场景？
**回答思路 (SDLC 软件开发生命周期)**:
1.  **需求分析**: 确定功能边界，评估工期。
2.  **技术选型**: 前台(SSR/SEO优化) + 后台(SPA/权限管理)。
3.  **任务拆解**: 按模块拆分 (Auth, Product, Admin)，分配给不同成员。
4.  **规范制定**: 约定 Git Flow, ESLint, 接口文档。
5.  **进度把控**: 每日站会 (Daily Scrum)，风险预警。

#### 2. React 和 Vue 的区别
| 维度 | Vue | React |
| :--- | :--- | :--- |
| **核心思想** | 响应式 (Mutable)，自动追踪依赖 | 函数式 (Immutable)，手动触发更新 |
| **语法** | Template (模版语法，贴近 HTML) | JSX (JS XML，All in JS) |
| **数据流** | 双向绑定 (v-model) | 单向数据流 (State -> View) |
| **优化** | 自动 Diff 优化 | 需要 `useMemo`, `React.memo` 手动优化 |

#### 3. 区块链 (项目相关)
- **核心**: 去中心化数据库 (Ledger)。
- **技术栈**: Solidity (智能合约), Web3.js (前端交互库), IPFS (分布式存储)。

---

## 滴普科技 (广州)

### 📌 面试概览
- **时长**：1小时 (线下 OC)
- **业务**：公司内部管理系统 (Vue 2 技术栈)。
- **特点**：场景题多，考察解决问题的能力。

### 📝 场景题深度解析

#### 1. 定时器 vs 倒计时 (暂停功能)
- **核心差异**：
  - `setInterval`：每隔固定时间执行，易产生累积误差。
  - `setTimeout`：递归调用模拟，精度更高。
- **暂停实现**：清除定时器 (`clearTimeout`)，记录剩余时间。

**代码示例 (带暂停的倒计时)**：
```javascript
class Timer {
  constructor(duration) {
    this.remaining = duration;
    this.timerId = null;
    this.start = Date.now();
  }

  run() {
    this.start = Date.now();
    this.timerId = setTimeout(() => {
      console.log('Finished');
    }, this.remaining);
  }

  pause() {
    clearTimeout(this.timerId);
    this.remaining -= Date.now() - this.start; // 扣除已过时间
  }
}
```

#### 2. 并发请求优先级控制
- **场景**：前三个请求慢，第四个请求快，如何保证渲染顺序？
- **解法**：
  1. **取消请求**：发送新请求时取消旧请求 (`AbortController`)。
  2. **版本号/时间戳**：响应返回时对比 ID，丢弃旧 ID 的数据。

**代码示例 (竞态处理)**：
```javascript
let currentId = 0;
async function fetchWithOrder(id) {
  currentId = id;
  const data = await api.get(id);
  if (id !== currentId) return; // ID 不匹配，丢弃结果
  render(data);
}
```

#### 3. 内存泄漏检测与优化
- **排查工具**：Chrome DevTools -> Memory 面板 -> Heap Snapshot (堆快照对比)。
- **常见原因**：
  - 全局变量。
  - 遗忘的定时器/事件监听。
  - 闭包引用 DOM。
- **Vue 优化**：在 `beforeUnmount` / `destroyed` 中销毁定时器和监听器。

#### 4. 白屏问题排查
1. **资源加载**：查看 Network 是否有 JS/CSS 加载失败 (CDN 挂了？)。
2. **代码报错**：Console 是否有语法错误 (ES6 兼容性)。
3. **路由模式**：History 模式刷新 404 (Nginx 未配置)。

#### 5. Vue 2 监听数组
- **原理**：Vue 2 改写了数组的 7 个变异方法 (`push`, `pop`, `shift`...)。
- **缺陷**：无法监听 `arr[0] = 1` 或 `arr.length = 0`。
- **解决**：使用 `this.$set(arr, 0, 1)` 或 `arr.splice()`。

#### 6. H5 / ES6 新特性
- **H5**: Semantic tags (`<header>`, `<nav>`), LocalStorage, Canvas, WebSocket.
- **ES6**: Arrow Function, Promise, Let/Const, Module (`import/export`), Class.

#### 7. CSS 样式穿透
- **场景**：修改第三方组件库 (如 Element UI) 的内部样式。
- **Vue Scoped 穿透**：
  - CSS: `>>>`
  - Sass/Less: `/deep/` (已废弃) 或 `::v-deep`

#### 8. 组件通信 (Vue)
- **父子**: `props` / `$emit`.
- **兄弟**: EventBus / Vuex.
- **跨层级**: `provide` / `inject`.
- **全局**: Window 对象 (不推荐，污染全局).

#### 9. Git Merge vs Rebase
| 命令 | 作用 | 提交历史 | 适用场景 |
| :--- | :--- | :--- | :--- |
| **Merge** | 合并分支 | 产生新的 Merge Commit，非线性 | 主分支合并，保留完整记录 |
| **Rebase** | 变基 | 线性历史，无分叉 | 个人开发分支同步主分支代码 |

---

## 汇量科技 (广州)

### 📌 面试概览
- **时长**：OC
- **业务**：官网、后台管理、大屏可视化。
- **重点**：浏览器原理、SEO、动画。

### 📝 知识点解析

#### 1. 垃圾回收 (GC) 机制
- **标记清除 (Mark-and-Sweep)**：
  1. **标记**：从根对象 (Root) 出发，遍历所有可达对象并标记。
  2. **清除**：清除所有未标记的对象 (不可达)。
- **引用计数**：记录对象被引用的次数 (循环引用会导致内存泄漏)。

#### 2. Cookie vs LocalStorage
| 特性 | Cookie | LocalStorage |
| :--- | :--- | :--- |
| **大小** | 4KB | 5MB |
| **传输** | 每次请求自动携带 | 不携带，手动操作 |
| **有效期** | 可设置过期时间 | 永久有效 |
| **用途** | 身份认证 (Session) | 缓存数据 |

**修改 Cookie**:
```javascript
// 设置/修改 (覆盖同名 Key)
// 必须路径 path 一致才能覆盖
document.cookie = "username=Tom; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
```

#### 3. 轮播图动画思路
1. **DOM 结构**：`Container > Wrapper (Flex) > Slides`。
2. **动画**：改变 Wrapper 的 `transform: translateX(-100%)`。
3. **无缝循环**：在首尾克隆第一张和最后一张图，动画到克隆图瞬间重置位置 (禁用 transition)。

#### 4. 0-100 数字增长动画 (手撕题)
**思路**：使用 `requestAnimationFrame` 保证动画流畅，根据时间进度 (`progress`) 计算当前值。
```javascript
function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    // 计算进度 (0 ~ 1)
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    // 计算当前值并取整
    obj.innerHTML = Math.floor(progress * (end - start) + start);
    // 继续下一帧
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}
```

#### 5. 浏览器 SEO 优化
- **SSR (服务端渲染)**: Next.js / Nuxt.js，直接返回 HTML，爬虫易抓取。
- **语义化标签**: 使用 `<article>`, `<section>`, `<h1>`。
- **Meta 标签**: 设置 `keywords`, `description`。
- **Sitemap**: 提供站点地图。

#### 6. 浏览器渲染过程 (完整版)
1. **HTML -> DOM**: 解析 HTML 标记，构建 DOM 树。
2. **CSS -> CSSOM**: 解析 CSS，构建 CSSOM 树。
3. **Render Tree**: 结合 DOM 和 CSSOM，生成渲染树 (去除 `display: none` 的节点)。
4. **Layout (回流)**: 计算节点在屏幕上的几何位置 (位置、大小)。
5. **Paint (重绘)**: 绘制节点的像素 (颜色、阴影)。
6. **Composite (合成)**: 将多个图层 (Layer) 合成最终图像 (GPU 加速)。

#### 7. 页面布局方案
- **PC 端**: 
  - **定宽 + 自适应**: 两边固定，中间 Flex 自适应。
  - **Grid 布局**: 适合复杂的二维布局。
- **移动端**:
  - **Rem / Em**: 基于根元素字体大小适配。
  - **VW / VH**: 基于视口百分比。
  - **Flex**: 万能布局。

---

## 三维家 (广州)

### 📌 面试概览
- **时长**：OC
- **重点**：算法、TS、Web3D。

### 📝 知识点解析

#### 1. 欧几里得算法 (求最大公约数 GCD)
```javascript
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}
// 示例: gcd(48, 18) -> gcd(18, 12) -> gcd(12, 6) -> gcd(6, 0) -> 6
```

#### 2. 排序算法对比
| 算法 | 平均复杂度 | 最差复杂度 | 稳定性 | 适用场景 |
| :--- | :--- | :--- | :--- | :--- |
| **冒泡排序** | O(n²) | O(n²) | 稳定 | 数据量小，教学用 |
| **快速排序** | O(n log n) | O(n²) | 不稳定 | 大数据量排序 (V8 引擎采用 Timsort) |

#### 3. 数组 vs 链表
| 维度 | 数组 (Array) | 链表 (Linked List) |
| :--- | :--- | :--- |
| **内存** | 连续内存 | 离散内存 (节点含指针) |
| **查找** | O(1) (下标访问) | O(n) (遍历) |
| **增删** | O(n) (需移动元素) | O(1) (修改指针) |

#### 4. TypeScript Any 类型避免
- **使用 `unknown`**：比 `any` 安全，使用前必须类型收窄。
- **类型断言**：`as SomeType` (当你比编译器更了解类型时)。
- **泛型**: 让类型与变量关联。

**代码示例 (unknown 类型收窄)**：
```typescript
function handle(val: unknown) {
  // val.toLowerCase() // ❌ 报错，不能直接调用
  if (typeof val === 'string') {
    console.log(val.toLowerCase()); // ✅ 类型收窄为 string
  }
}
```

#### 5. GLTF 模型加载 (Three.js)
- **GLTF**: 3D 领域的 JPEG，体积小，加载快，支持动画、材质。
- **加载器**: `GLTFLoader`。

**代码示例**:
```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const loader = new GLTFLoader();
loader.load(
  'path/to/model.gltf', 
  (gltf) => {
    scene.add(gltf.scene);
    // 处理动画
    const mixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded'); // 加载进度
  },
  (error) => {
    console.error('An error happened', error);
  }
);
```

#### 6. 内存泄漏排查 (实习亮点)
- **背景**: 页面切换后内存飙升，导致卡顿。
- **定位**: 使用 Chrome Performance 录制，发现 DOM 节点数只增不减。
- **原因**: 
  1. Three.js 的 `geometry`, `material`, `texture` 未调用 `.dispose()` 手动释放。
  2. `requestAnimationFrame` 在组件销毁后仍在运行。
- **解决**: 在 `beforeUnmount` 生命周期中遍历场景图，递归释放所有资源，并取消 RAF 循环。

#### 7. Git Merge vs Rebase (公司习惯)
- **公司习惯**: 多数公司 (如三维家) 推荐使用 `git rebase`。
- **原因**: 保持提交历史是一条干净的直线，没有杂乱的 Merge 节点，方便 Code Review 和回滚。

---

## 太平洋网络
### 📌 面试概览
- **时长**：24分钟（20分钟八股 + 4分钟反问）
- **形式**：线上
- **体验**：疑似 KPI 面试，面试官反馈较少。
- **业务**：汽车 To B 系统。

### 📝 知识点深度解析

#### 1. 水平垂直居中方案
**方案一：Flex 布局 (最推荐)**
```css
.container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
}
```

**方案二：绝对定位 + Transform**
```css
.box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

**方案三：Grid 布局 (极简)**
```css
.container {
  display: grid;
  place-items: center;
}
```

#### 2. Flex 布局属性
**代码示例**：
```css
.container {
  display: flex;
  flex-direction: row;        /* 主轴方向：横向 */
  justify-content: space-between; /* 主轴对齐：两端对齐 */
  align-items: stretch;       /* 交叉轴：拉伸填满 */
  flex-wrap: wrap;            /* 允许换行 */
}

.item {
  flex: 1; /* 均分剩余空间 (flex-grow: 1) */
}
```

#### 3. 盒子模型 (Box Model)
**代码对比**：
```css
/* 标准模型 (width = content) */
.standard {
  box-sizing: content-box;
  width: 100px;
  padding: 10px;
  /* 实际占据宽度 = 100 + 10*2 = 120px */
}

/* 怪异模型 (width = content + padding + border) */
.ie-box {
  box-sizing: border-box;
  width: 100px;
  padding: 10px;
  /* 实际占据宽度 = 100px (内容被压缩为 80px) */
}
```
> 💡 **最佳实践**：推荐全局设置 `* { box-sizing: border-box; }`。

#### 4. CSS 选择器优先级
**计算规则**：(ID, 类, 标签)
```css
#id .class div {}  /* 权重: 1, 1, 1 */
.class .class {}   /* 权重: 0, 2, 0 */
div p {}           /* 权重: 0, 0, 2 */
```
> `!important` 优先级最高，尽量少用。

#### 5. JS 数据类型
**基本类型 vs 引用类型**：
```javascript
// 基本类型 (栈内存，值不可变)
let a = 10;
let b = a;
b = 20;
console.log(a); // 10 (不受影响)

// 引用类型 (堆内存，地址引用)
let obj1 = { x: 1 };
let obj2 = obj1;
obj2.x = 2;
console.log(obj1.x); // 2 (受影响)
```

#### 6. 前端工程化
**配置示例 (Vite)**：
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://backend.com' // 接口代理
    }
  },
  build: {
    minify: 'terser' // 代码压缩
  }
})
```

#### 7. 自动化测试工具
**Jest 单元测试示例**：
```javascript
// sum.js
function sum(a, b) { return a + b }
module.exports = sum

// sum.test.js
const sum = require('./sum')
test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})
```

#### 8. Vue 指令
**常用指令示例**：
```html
<!-- 条件渲染 -->
<div v-if="show">I am here</div>

<!-- 列表循环 -->
<li v-for="item in list" :key="item.id">{{ item.name }}</li>

<!-- 双向绑定 -->
<input v-model="username" />
<!-- 等价于 -->
<input :value="username" @input="username = $event.target.value" />
```

#### 9. Vue 3 提升点
**Composition API 示例**：
```javascript
import { ref, onMounted } from 'vue'

// 逻辑复用：鼠标追踪
function useMouse() {
  const x = ref(0)
  const y = ref(0)
  window.addEventListener('mousemove', e => {
    x.value = e.pageX
    y.value = e.pageY
  })
  return { x, y }
}
```

#### 10. Vite vs Webpack
- **Vite**: 开发环境使用 ES Modules (`<script type="module">`)，浏览器直接加载文件。
- **Webpack**: 开发环境需要将所有文件打包成 bundle.js，项目越大启动越慢。

---

## 钛动科技

### 📌 面试概览
- **时长**：23分钟
- **重点**：项目深度拷打 (模块联邦, 首屏优化, 大文件上传)
- **业务**：广告投放系统

### 📝 项目难点解析

#### 1. 模块联邦 (Module Federation)
**Webpack 配置示例**：
```javascript
// host (主应用)
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
new ModuleFederationPlugin({
  name: 'app1',
  remotes: {
    app2: 'app2@http://localhost:3002/remoteEntry.js', // 引用远程应用
  },
})

// remote (子应用)
new ModuleFederationPlugin({
  name: 'app2',
  filename: 'remoteEntry.js',
  exposes: {
    './Button': './src/Button', // 暴露组件给外部使用
  },
})
```

#### 2. 首屏优化策略
**代码示例 (路由懒加载)**：
```javascript
// router.js
const routes = [
  {
    path: '/dashboard',
    // 只有访问该路由时才加载 Dashboard.js
    component: () => import('./views/Dashboard.vue')
  }
]
```

#### 3. 大文件上传 (核心难点)
**分片上传 + 并发控制实现**：
```javascript
// 1. 文件切片
const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB
function createChunks(file) {
  const chunks = [];
  let cur = 0;
  while (cur < file.size) {
    chunks.push(file.slice(cur, cur + CHUNK_SIZE));
    cur += CHUNK_SIZE;
  }
  return chunks;
}

// 2. 并发控制上传
async function uploadChunks(chunks, maxRequest = 3) {
  const pool = []; // 并发池
  for (const chunk of chunks) {
    const formData = new FormData();
    formData.append('file', chunk);
    
    // 发起请求
    const task = fetch('/upload', { method: 'POST', body: formData });
    
    // 任务完成后从池中移除
    task.then(() => pool.splice(pool.indexOf(task), 1));
    pool.push(task);
    
    // 池子满了就等待最快的一个完成
    if (pool.length >= maxRequest) {
      await Promise.race(pool);
    }
  }
  await Promise.all(pool); // 等待剩余所有任务完成
}
```

#### 4. 技术问题解决思路
1. **定位**: Console 报错 -> Network 请求参数/响应 -> SourceMap 断点调试。
2. **搜索**: 官方文档 -> Stack Overflow -> GitHub Issues (精准搜索报错信息)。
3. **求助**: 整理复现步骤 -> 寻求同事/社区帮助。
4. **复盘**: 记录问题原因与解决方案 (Blog/Wiki)，避免重复踩坑。

---

## 编程猫 (深圳)

### 📌 面试概览
- **时长**：45分钟
- **业务**：少儿编程教育 (Blockly, Scratch)
- **特点**：考察 Iframe 通信、微前端、工程化 CI/CD。

### 📝 核心知识点解析

#### 1. Iframe 通信
- **场景**: 嵌入第三方页面或微前端沙箱。
- **方案**: `postMessage`。

**代码示例**:
```javascript
// 父传子
const iframe = document.getElementById('myIframe');
iframe.contentWindow.postMessage('Hello Son', 'http://child.com');

// 子收父
window.addEventListener('message', (e) => {
  if (e.origin !== 'http://parent.com') return; // 安全检查
  console.log(e.data);
});
```

#### 2. 微前端 (Micro Frontend)
- **解决痛点**: 巨石应用拆分，技术栈无关 (React/Vue 共存)。
- **常见方案**:
  - **qiankun** (基于 single-spa，HTML Entry)。
  - **Iframe** (完美隔离，但体验差，路由状态难同步)。
  - **Module Federation** (Webpack 5 模块联邦)。

#### 3. CI/CD (持续集成/持续部署)
- **流程**:
  1. **Push Code**: 提交代码到 Git。
  2. **GitLab CI / Jenkins**: 触发 Hook，启动 Runner。
  3. **Install & Build**: `npm install` -> `npm run build`。
  4. **Test**: 运行单元测试。
  5. **Deploy**: 将 `dist` 产物推送到 Nginx 服务器或上传 CDN。

#### 4. React Hooks: useLayoutEffect vs useEffect
- **useEffect**: **异步**执行，渲染**后**触发。不会阻塞浏览器绘制。
- **useLayoutEffect**: **同步**执行，DOM 更新后，浏览器绘制**前**触发。会阻塞绘制。
- **场景**: 如果需要在 Effect 中修改 DOM 且防止闪烁，用 `useLayoutEffect`。

#### 5. Vue nextTick 原理
- **核心**: 利用微任务 (`Promise.then`, `MutationObserver`) 或宏任务 (`setTimeout`) 将回调推入异步队列。
- **目的**: 等待同一事件循环中的所有数据变更完成后，再统一更新 DOM，避免不必要的计算。

#### 6. Webpack Loader vs Plugin
| 维度 | Loader | Plugin |
| :--- | :--- | :--- |
| **作用** | 转换器 (Translator) | 扩展器 (Extender) |
| **功能** | 将非 JS 文件 (CSS, Vue, PNG) 转为 JS | 打包优化、资源管理、注入环境变量 |
| **运行时机** | 打包模块源码时 | 整个构建周期的特定生命周期钩子中 |
| **示例** | `css-loader`, `babel-loader` | `HtmlWebpackPlugin`, `DefinePlugin` |

---

## 吉比特 / 雷霆游戏 (深圳)

### 📌 经历一：游戏开发岗 (40分钟)
- **业务**：游戏开发 (雷霆游戏)
- **特点**：计算机基础扎实 (网络, 操作系统, 渲染原理)。

### 📝 核心知识点解析 (基础篇)

#### 1. 进程 (Process) vs 线程 (Thread)
- **进程**: 资源分配的最小单位 (如一个 Chrome Tab 标签页)。拥有独立的内存空间。
- **线程**: CPU 调度的最小单位。共享进程的内存。
- **关系**: 一个进程包含多个线程 (JS 引擎线程, GUI 渲染线程, 网络线程)。
- **JS 单线程**: 避免 DOM 渲染冲突 (如一个线程删 DOM，一个线程改 DOM)。

#### 2. Node.js Event Loop vs 浏览器 Event Loop
- **浏览器**: 
  - 每执行完一个宏任务，清空微任务队列。
  - 渲染 UI。
- **Node.js (旧版 < 11)**: 
  - 分阶段 (Timers, Poll, Check)。
  - 切换阶段时才清空微任务。
- **Node.js (新版 >= 11)**: 
  - 行为与浏览器基本一致。

#### 3. TCP vs UDP
| 特性 | TCP (传输控制协议) | UDP (用户数据报协议) |
| :--- | :--- | :--- |
| **连接** | 面向连接 (三次握手) | 无连接 |
| **可靠性** | 可靠 (重传, 排序, 拥塞控制) | 不可靠 (丢包不重发) |
| **速度** | 慢 | 快 |
| **场景** | 网页, 文件传输, 邮件 | 视频直播, 语音通话, 游戏 (低延迟) |

#### 4. 浏览器渲染原理 (重排/重绘)
- **重排 (Reflow)**: 元素几何属性 (宽/高/位置) 变化，浏览器需重新计算布局。**开销大**。
- **重绘 (Repaint)**: 元素外观 (颜色/背景) 变化，布局不变。**开销小**。
- **优化**:
  - 避免频繁读取导致回流的属性 (`offsetTop`, `scrollTop`)。
  - 使用 `transform` (GPU 合成层) 代替 `top/left` 动画。
  - 批量修改 DOM (使用 `documentFragment` 或 `class` 切换)。

### 📌 经历二：前端实习 (两轮)
- **岗位**：前端实习
- **特点**：考察开源项目 (OMI)、编辑器开发、Web3D、底层原理 (Vue源码/Webpack)。

### 📝 核心知识点解析 (进阶篇)

#### 1. OMI 框架 (腾讯开源)
- **核心**: 基于 **Web Components** 的跨框架 UI 库。
- **技术栈**: `Shadow DOM` (样式隔离), `Custom Elements` (自定义标签)。
- **优势**: 
  - **框架无关**: 可以在 Vue/React/原生中直接使用。
  - **体积小**: 只有几 KB。
- **兼容性**: React 和 Vue 封装组件时，通过 Props 传参，Event 监听事件。

#### 2. 无重复字符的最长子串 (算法)
- **思路**: 滑动窗口 (Sliding Window)。
- **代码**:
```javascript
var lengthOfLongestSubstring = function(s) {
    let map = new Map();
    let left = 0, maxLen = 0;
    for(let i = 0; i < s.length; i++){
        if(map.has(s[i])){
            left = Math.max(left, map.get(s[i]) + 1);
        }
        map.set(s[i], i);
        maxLen = Math.max(maxLen, i - left + 1);
    }
    return maxLen;
};
```

#### 3. Vue 2 vs Vue 3 响应式原理
- **Vue 2**: `Object.defineProperty`。
  - **缺陷**: 需递归遍历，无法监听新增属性 (`Vue.set`)，无法监听数组索引。
  - **数组重写**: 重写 `push/pop/shift/unshift/splice/sort/reverse` 7个方法，手动 `notify`。
- **Vue 3**: `Proxy`。
  - **优势**: 代理整个对象，惰性递归 (访问时才代理下一层)，支持 Map/Set/数组索引。

#### 4. Webpack 优化 (S5编辑器项目)
- **打包速度**: `cache-loader` (缓存), `thread-loader` (多线程)。
- **体积优化**: 
  - `Tree Shaking` (移除未引用代码)。
  - `SplitChunks` (提取公共依赖)。
  - **WebP**: 图片体积减少 30%~50%，兼容性通过 `<picture>` 标签或 JS 检测降级。
- **热更新 (HMR)**: 
  - `webpack-dev-server` 建立 WebSocket 连接。
  - 文件修改 -> 重新编译 -> 推送 Hash -> 浏览器请求新模块 -> `module.hot.accept` 热替换。

#### 5. 移动端适配：Rem vs Px
- **Rem**: 早期主流，基于 `html` 字体大小。
- **Px + Viewport**: 现代主流。
  - 插件: `postcss-px-to-viewport`。
  - 优势: 直接写 px，插件自动转为 `vw`，无需 JS 计算根字体。

#### 6. HTTPS 原理 (握手过程)
1. **Client Hello**: 客户端发送支持的加密套件、随机数 R1。
2. **Server Hello**: 服务端返回选定的加密套件、证书 (含公钥)、随机数 R2。
3. **验证证书**: 客户端验证证书合法性 (CA 签名)。
4. **密钥交换**: 客户端生成随机数 (Pre-master)，用公钥加密发送给服务端。
5. **生成会话密钥**: 双方用 R1 + R2 + Pre-master 生成最终的对称密钥 (Session Key)。
6. **加密通信**: 后续数据使用 Session Key 进行对称加密传输。

#### 7. 深拷贝 (递归实现)
```javascript
function deepClone(obj, map = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (map.has(obj)) return map.get(obj); // 防止循环引用
    
    const clone = Array.isArray(obj) ? [] : {};
    map.set(obj, clone);
    
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            clone[key] = deepClone(obj[key], map);
        }
    }
    return clone;
}
```

#### 8. Web3D 优化 (Three.js / ECharts-GL)
- **切换**: 2D (Canvas/SVG) 与 3D (WebGL) 混合渲染，使用 CSS `z-index` 叠加层。
- **卡顿优化**:
  - **InstancedMesh**: 实例化渲染 (大量重复物体)。
  - **LOD (Level of Detail)**: 远得模糊，近的清晰。
  - **Dispose**: 及时销毁几何体和材质，避免显存泄漏。

#### 9. 继承与原型链
- **原型链**: `Instance.__proto__ === Prototype`, `Prototype.constructor === Class`.
- **继承**: 
  - **ES5**: 组合继承 (Call + Prototype)。
  - **ES6**: `class Child extends Parent` (`super()`).

---

## 新通教育 (杭州)

### 📌 面试概览
- **时长**：1小时 (技术+老板+HR 三人混面)
- **压力**：⭐⭐⭐⭐⭐ (老板气场强，抓包质问)
- **业务**：教育科技
- **特点**：全方位考察 (CSS, 缓存, 协议, 智力题)。

### 📝 核心知识点解析

#### 1. 智力题：8个球，一次拿1-2个，几种拿法？
- **本质**：斐波那契数列 (爬楼梯问题)。
- **推导**：
  - f(1) = 1
  - f(2) = 2 (1+1, 2)
  - f(n) = f(n-1) + f(n-2)
- **计算**：1, 2, 3, 5, 8, 13, 21, **34**。
- **答案**：34种。

#### 2. 数据安全：HTTPS 抓包与加密
- **老板质问**："抓包发现数据是明文，怎么加密？不是指 HTTPS。"
- **解析**：HTTPS 保证传输层安全，但在客户端/服务端内存中是明文，且可能被中间人攻击 (MITM) 抓包 (如 Fiddler 安装证书)。
- **应用层加密方案**：
  - **敏感字段加密**：密码/身份证号使用 RSA (前端公钥加密，后端私钥解密) 或 AES (对称加密) 处理后再发送。
  - **防篡改 (签名)**：参数排序 + AppKey 生成 MD5 签名 (Sign)，后端校验。

#### 3. 弹性盒子 (Flex) 水平垂直居中
```css
.container {
  display: flex;
  justify-content: center; /* 主轴 (水平) */
  align-items: center;     /* 交叉轴 (垂直) */
}
```

#### 4. BFC (块级格式化上下文)
- **触发**: `overflow: hidden`, `display: flex/inline-block`, `position: absolute/fixed`。
- **作用**: 解决 Margin 塌陷，清除浮动，隔离元素。

#### 5. 数组去重
- **Set**: `Array.from(new Set(arr))`。
- **Map**: 利用 `map.has()` 判断。
- **Filter**: `arr.filter((item, idx) => arr.indexOf(item) === idx)`。

#### 6. 浏览器缓存 (Browser Cache)
- **Service Worker**: 离线缓存。
- **Memory Cache**: 内存缓存 (页面关闭即逝)。
- **Disk Cache**: 硬盘缓存 (持久)。
- **Push Cache**: HTTP/2 推送缓存。

---

## 上海数数科技

### 📌 面试概览
- **结果**：凉经
- **业务**：大数据分析 (React 技术栈)
- **反评**：面试官认为原理挖掘不够深，Vue 转 React 需加强。

### 📝 核心知识点解析

#### 1. React vs Vue (原理层面)
- **响应式**: Vue (Proxy 自动收集依赖) vs React (State 变化全量 Diff，需手动优化)。
- **组件更新**: Vue 精确更新组件; React 默认父组件更新引发子组件全部更新 (需 `memo`/`useMemo` 优化)。
- **复用**: Vue (Mixins/Composition API) vs React (HOC/Render Props/Hooks)。

#### 2. 网页渲染慢排查 (Debug)
1.  **Network**: 检查资源加载 (大图? 慢接口? 队头阻塞?)。
2.  **Performance**: 录制性能分析，查看 `Main` 线程火焰图 (Long Task? 重排重绘?)。
3.  **Lighthouse**: 生成评分报告，获取优化建议。
4.  **React Profiler**: 检查组件渲染耗时，找出不必要的重渲染。

#### 3. 组件传值 (React)
- **父子**: Props / Callback。
- **跨层级**: Context API (`createContext`, `useContext`)。
- **全局**: Redux / MobX / Zustand。

---

## 上海游族网络

### 📌 面试概览
- **体验**：轻松，面试官吐槽加班无加班费。
- **业务**：游戏官网/运营活动。

### 📝 核心知识点解析

#### 1. 内存泄漏排查 (实际项目)
- **现象**: 页面长时间运行后卡顿，Chrome 任务管理器内存占用飙升。
- **排查**: DevTools Memory -> Heap Snapshot (堆快照)。
  - 1. 刚加载时拍快照 A。
  - 2. 执行操作 (如弹窗打开关闭 10 次)。
  - 3. 拍快照 B。
  - 4. 对比 (Comparison) 发现 `Detached DOM Tree` (分离的 DOM 树) 或未释放的事件监听器。

#### 2. 项目难点挖掘
- **切入点**: 不要只背八股，结合业务。
  - **大屏**: 性能优化 (Canvas/WebGL), 适配 (Scale/Rem)。
  - **复杂表单**: 动态配置, 校验逻辑解耦.
  - **CI/CD**: 自动化部署流程搭建，提升团队效率。
<!-- Duplicate content removed -->

