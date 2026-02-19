# Webpack 深度解析

[Webpack 官方文档](https://webpack.docschina.org/)

## 1. Webpack 核心概念

Webpack 本质上是一个用于现代 JavaScript 应用程序的**静态模块打包工具**。

*   **Entry**: 入口，Webpack 从这里开始构建依赖图。
*   **Output**: 输出，打包后的文件放在哪里。
*   **Loader**: 模块转换器。Webpack 原生只懂 JS/JSON，Loader 让它能处理 CSS, Images, TS 等。
*   **Plugin**: 插件。执行范围更广的任务，如打包优化、资源管理、注入环境变量。
*   **Mode**: 模式 (`development` / `production`)，开启内置优化。

---

## 2. 构建流程 (面试高频)

1.  **初始化参数**: 读取配置文件和 Shell 语句中的参数。
2.  **开始编译**: 用参数初始化 `Compiler` 对象，加载插件，执行 `run` 方法。
3.  **确定入口**: 根据 `entry` 找出所有入口文件。
4.  **编译模块**: 从入口出发，调用 `Loader` 翻译模块，再找出该模块依赖的模块，递归进行。
5.  **完成编译**: 得到每个模块被翻译后的最终内容和依赖关系。
6.  **输出资源**: 根据依赖关系，组装成一个个包含多个模块的 `Chunk`，再把 `Chunk` 转换成文件加入输出列表。
7.  **写入文件**: 根据 `output` 配置，将文件写入文件系统。

> **Tapable**: Webpack 的核心库，实现了发布订阅模式的插件机制。Webpack 在构建流程的各个阶段触发钩子，插件监听这些钩子来改变构建行为。

---

## 3. Loader vs Plugin

| 特性 | Loader | Plugin |
| :--- | :--- | :--- |
| **作用** | **转换器**。将 A 文件转换为 B 文件 (e.g., Scss -> CSS, TS -> JS)。 | **扩展器**。监听构建生命周期，执行特定任务 (e.g., 压缩代码, 拷贝文件)。 |
| **运行时机** | 在读取文件内容时执行。 | 在整个构建周期的特定钩子触发时执行。 |
| **配置方式** | `module.rules` 中配置。 | `plugins` 数组中 `new Plugin()`。 |
| **例子** | `babel-loader`, `css-loader`, `vue-loader` | `HtmlWebpackPlugin`, `MiniCssExtractPlugin`, `CleanWebpackPlugin` |

---

## 4. 常用 Loader 与 Plugin

### 4.1 常用 Loader
*   **babel-loader**: ES6+ 转 ES5。
*   **css-loader**: 处理 CSS 中的 `@import` 和 `url()`。
*   **style-loader**: 将 CSS 注入到 DOM 的 `<style>` 标签中。
*   **postcss-loader**: 自动添加浏览器前缀 (Autoprefixer)。
*   **file-loader / url-loader**: 处理图片/字体 (Webpack 5 已被 Asset Modules 取代)。
*   **ts-loader**: 编译 TypeScript。

### 4.2 常用 Plugin
*   **HtmlWebpackPlugin**: 自动生成 HTML 并注入打包后的 JS/CSS。
*   **MiniCssExtractPlugin**: 将 CSS 提取为单独文件 (生产环境推荐)。
*   **DefinePlugin**: 定义全局环境变量 (如 `process.env.NODE_ENV`)。
*   **CleanWebpackPlugin**: 每次打包前清空 dist 目录。
*   **TerserPlugin**: 压缩 JS (生产环境默认开启)。

---

## 5. 性能优化 (实战重点)

### 5.1 构建速度优化
1.  **Cache (持久化缓存)**: Webpack 5 内置 `cache: { type: 'filesystem' }`。
2.  **Thread-loader**: 多进程打包 (适合耗时的 Loader)。
3.  **Exclude/Include**: 缩小 Loader 作用范围 (如 `exclude: /node_modules/`)。
4.  **Resolve.alias**: 配置别名，减少文件搜索范围。

### 5.2 打包体积优化
1.  **Tree Shaking**: 移除未引用的代码 (依赖 ES Modules)。
    *   生产环境 (`mode: 'production'`) 默认开启。
    *   `package.json` 中配置 `"sideEffects": false`。
2.  **Code Splitting (代码分割)**:
    *   `optimization.splitChunks`: 提取公共代码 (如 `vendor` 第三方库)。
    *   **动态导入**: `import('./module').then(...)` 实现路由懒加载。
3.  **压缩资源**: JS (Terser), CSS (CssMinimizer), 图片压缩。
4.  **CDN 加速**: 配置 `externals`，将 React/Vue 等库通过 CDN 引入，不打入 bundle。

---

## 6. HMR (热更新) 原理

**Hot Module Replacement**: 在不刷新页面的情况下替换模块。

1.  **Webpack Compile**: 服务端监听文件变化，重新编译，生成 Hash 和 Manifest。
2.  **Socket Server**: 服务端通过 WebSocket 推送更新消息 (Hash) 给浏览器。
3.  **HMR Runtime**: 浏览器端收到消息，请求更新的 Chunk (`.hot-update.json` 和 `.hot-update.js`)。
4.  **HMR Bubble**: 运行时替换模块。如果模块没有实现 HMR 接口，更新会冒泡，最终可能导致页面刷新。
