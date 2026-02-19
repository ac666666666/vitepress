# 服务端渲染 (SSR) 详解

[Vue SSR 指南](https://vuejs.org/guide/scaling-up/ssr.html)

## 1. 渲染模式演进

### 1.1 传统 SSR (JSP/PHP)

- **原理**: 服务端直接拼接 HTML 字符串返回给浏览器。
- **优点**: 首屏快，SEO 好。
- **缺点**: 前后端耦合，服务器压力大，交互体验差 (每次跳转都要刷新页面)。

### 1.2 CSR (客户端渲染 - SPA)

- **原理**: 服务端只返回一个空的 `div#app` 和 JS bundle。浏览器下载 JS 后，在客户端执行 JS 渲染 DOM。
- **优点**: 交互体验好 (无刷新跳转)，前后端分离。
- **缺点**: **首屏慢** (白屏时间长)，**SEO 差** (爬虫抓不到内容)。

### 1.3 现代 SSR (同构渲染 - Isomorphic)

- **原理**:
  - **首屏**: 服务端运行 Vue/React 代码，生成 HTML 字符串返回 (类似传统 SSR)。
  - **激活 (Hydration)**: 浏览器收到 HTML 后，再下载 JS bundle，JS 接管页面 (绑定事件)，变成 SPA (类似 CSR)。
- **优点**: 兼顾了 SSR 的首屏/SEO 和 CSR 的交互体验。
- **缺点**: 开发复杂 (要注意 Node 环境差异)，服务器负载高。

### 1.4 SSG (静态站点生成)

- **原理**: 在**构建时 (Build Time)** 提前生成所有页面的 HTML。
- **场景**: 博客、文档 (如 VitePress)。
- **优点**: 纯静态文件，部署简单，性能最快。
- **缺点**: 内容更新需要重新构建。

---

## 2. SSR 核心原理 (Vue 为例)

### 2.1 两个入口

- `entry-client.js`: 客户端入口。挂载 DOM (`mount`).
- `entry-server.js`: 服务端入口。创建应用实例，返回 `app`.

### 2.2 服务端流程

1.  Node.js 接收请求。
2.  创建 Vue 实例。
3.  调用 `renderToString(app)` 将实例渲染为 HTML 字符串。
4.  将 HTML 字符串插入模板，返回给浏览器。

### 2.3 客户端流程 (Hydration)

1.  浏览器显示 HTML (此时页面有内容但不可交互)。
2.  下载 JS bundle。
3.  Vue 在客户端再次执行，**不重新渲染 DOM**，而是**复用**现有的 DOM，只做事件绑定。这个过程叫 **"注水" (Hydrate)**。

---

## 3. 常见问题 (坑)

### 3.1 生命周期差异

- 服务端**只执行** `beforeCreate` 和 `created`。
- `beforeMount`, `mounted` 等 DOM 相关的钩子**只在客户端**执行。
- **避坑**: 不要在 `created` 中访问 `window` 或 `document`，否则服务端报错。

### 3.2 数据预取 (Data Prefetching)

- **问题**: 组件在服务端渲染时，需要先请求 API 拿到数据，才能渲染出有内容的 HTML。
- **方案**: 在路由组件定义静态方法 `asyncData`。服务端在渲染前，先调用所有匹配组件的 `asyncData`，拿到数据存入 Store。
- **状态同步**: 服务端将 State 注入到 HTML 的 `window.__INITIAL_STATE__` 中。客户端初始化 Store 时，用这个状态替换初始状态。

---

## 4. Nuxt.js (Vue 生态)

Nuxt 是基于 Vue 的全栈框架，"约定优于配置" (Convention over Configuration)。

### 4.1 核心特性

- **文件系统路由**: 直接在 `pages/` 目录下创建 `.vue` 文件，自动生成路由配置。
- **自动导入**: 自动导入组件 (`components/`)、Composables (`composables/`) 和 Vue API，无需手动 `import`。
- **模块系统**: 丰富的生态模块 (Pinia, Tailwind CSS, i18n 等)，通过 `nuxt.config.ts` 轻松集成。

### 4.2 数据获取 (Data Fetching)

Nuxt 3 提供了两个主要的 Hook 用于 SSR 数据获取：

- **`useFetch`**: 最常用的数据获取方法，封装了 `useAsyncData` 和 `$fetch`。它会在服务端执行，并将数据序列化后传递给客户端，避免客户端重复请求。
  ```javascript
  const { data, pending, error } = await useFetch("/api/users");
  ```
- **`useAsyncData`**: 更加底层的 Hook，用于包裹异步逻辑。
  ```javascript
  const { data } = await useAsyncData("users", () => $fetch("/api/users"));
  ```

### 4.3 渲染模式

- **Universal Rendering (SSR)**: 默认模式。首屏服务端渲染，之后客户端接管。
- **Client-Side Rendering (SPA)**: 仅在客户端渲染，类似传统的 Vue SPA。
  ```typescript
  // nuxt.config.ts
  export default defineNuxtConfig({ ssr: false });
  ```
- **Hybrid Rendering (混合渲染)**: Nuxt 3 的杀手级特性。可以为不同的路由配置不同的缓存策略 (SWR, ISR)。
  ```typescript
  export default defineNuxtConfig({
    routeRules: {
      "/": { prerender: true }, // SSG
      "/admin/**": { ssr: false }, // SPA
      "/blog/**": { isr: 3600 }, // ISR (1小时缓存)
    },
  });
  ```

---

## 5. Next.js (React 生态)

Next.js 是 React 官方推荐的生产级框架，功能极其强大。

### 5.1 路由架构

- **Pages Router (传统)**: 基于 `pages/` 目录，文件即路由。
- **App Router (新一代)**: 基于 `app/` 目录，默认使用 **React Server Components (RSC)**。支持嵌套布局 (`layout.js`)、流式传输 (Streaming) 和 Suspense。

### 5.2 数据获取与渲染策略 (Pages Router)

在 Pages Router 中，通过导出特定的异步函数来决定页面的渲染方式：

- **`getStaticProps` (SSG)**:
  - 在**构建时**执行。
  - 用于内容不经常变动的页面 (博客、文档)。
  - 生成静态 HTML，CDN 分发，速度最快。
- **`getServerSideProps` (SSR)**:
  - 在**每次请求时**执行。
  - 用于数据实时更新的页面 (股票、个人中心)。
  - TTFB (Time To First Byte) 较慢，因为要等待服务端执行完毕。
- **`getStaticPaths`**:
  - 配合 `getStaticProps` 使用，用于动态路由 (如 `/posts/[id]`)，指定哪些路径需要预渲染。
- **ISR (增量静态再生)**:
  - 在 `getStaticProps` 中返回 `revalidate` 字段。
  - 页面在构建时生成静态 HTML，但在 `revalidate` 秒后，如果有新请求，服务端会后台重新生成页面。
  - **结合了 SSG 的速度和 SSR 的实时性**。

### 5.3 React Server Components (RSC - App Router)

Next.js 13+ App Router 的默认组件都是**服务端组件**。

- **特点**:
  - 代码只在服务端运行，**不会打包到客户端 Bundle 中** (减小体积)。
  - 可以直接访问数据库、文件系统。
  - 不能使用 Hooks (`useState`, `useEffect`) 和浏览器 API。
- **客户端组件**:
  - 需要在文件顶部声明 `'use client'`。
  - 可以使用 Hooks 和交互逻辑。

```javascript
// app/page.tsx (Server Component by default)
async function getData() {
  const res = await fetch("https://api.example.com/...");
  return res.json();
}

export default async function Page() {
  const data = await getData(); // 直接在组件里写 async/await
  return <main>{data.title}</main>;
}
```

---

## 6. Nuxt vs Next 对比

| 特性         | Nuxt.js (Vue)                       | Next.js (React)                                           |
| :----------- | :---------------------------------- | :-------------------------------------------------------- |
| **核心哲学** | 约定优于配置，自动导入，模块化      | 灵活性高，API 丰富，强调 Server Components                |
| **路由**     | 文件系统路由 (`pages/`)             | 文件系统路由 (`pages/` 或 `app/`)                         |
| **数据获取** | `useFetch`, `useAsyncData`          | `getStaticProps`, `getServerSideProps`, Server Components |
| **渲染模式** | SSR, CSR, SSG, Hybrid (Route Rules) | SSR, SSG, ISR, RSC                                        |
| **状态管理** | 内置 useState, 轻松集成 Pinia       | Context API, Zustand, Redux 等                            |
| **适用场景** | Vue 技术栈团队，快速开发            | React 技术栈，大型应用，高性能要求                        |
