# 浏览器原理与网络

[MDN HTTP 文档](https://developer.mozilla.org/zh-CN/docs/Web/HTTP)

## 1. 浏览器架构 (Process & Threads)

现代浏览器是**多进程**架构。

### 1.1 核心进程
*   **Browser 进程**: 主进程，负责协调、主控 (地址栏、书签、前进后退)、网络资源管理。
*   **GPU 进程**: 负责 3D 绘制，硬件加速。
*   **Renderer 进程 (内核)**: 负责页面渲染，脚本执行。**每个 Tab 页通常对应一个渲染进程** (互不影响)。
*   **Plugin 进程**: 负责插件运行。

### 1.2 渲染进程中的线程
渲染进程是多线程的，但在执行 JS 时是单线程的。
1.  **GUI 渲染线程**: 解析 HTML/CSS，构建 DOM 树，布局绘制。**与 JS 引擎互斥** (JS 执行时 GUI 挂起)。
2.  **JS 引擎线程**: 执行 JavaScript (V8)。
3.  **事件触发线程**: 管理事件队列 (Event Loop)。
4.  **定时器触发线程**: `setTimeout`, `setInterval`。
5.  **异步 HTTP 请求线程**: 处理 Ajax 请求。

> **面试题: 为什么 JS 是单线程的？**
> 防止 DOM 操作冲突。如果多线程同时操作同一个 DOM (一个删除，一个修改)，浏览器无法判断以哪个为准。

---

## 2. 从输入 URL 到页面展示

### 2.1 导航流程
1.  **URL 解析**: 检查合法性，HSTS 强制 HTTPS。
2.  **DNS 解析**: 域名 -> IP (浏览器缓存 -> 系统缓存 -> 路由器 -> ISP -> 根域名)。
3.  **TCP 连接**: 三次握手。
4.  **HTTP 请求**:
    *   **并发限制**: 浏览器对同一域名有并发请求限制 (Chrome 为 6 个)。HTTP/2 多路复用解决了此问题。
5.  **服务器响应**: 状态码与内容。
6.  **渲染流程**: 解析 HTML/CSS -> 渲染树 -> 布局 -> 绘制。
7.  **断开连接**: 四次挥手。

### 2.2 渲染流程详解 (Critical Rendering Path)
1.  **DOM Tree**: 解析 HTML。
2.  **CSSOM Tree**: 解析 CSS。
3.  **Render Tree**: DOM + CSSOM (不包含 `display: none`，包含 `visibility: hidden`)。
4.  **Layout (回流/重绘)**: 计算几何位置。
5.  **Paint**: 绘制像素。
6.  **Composite**: 图层合成 (GPU 加速)。

---

## 3. 跨域解决方案 (Cross-Origin)

**同源策略 (Same Origin Policy)**: 协议、域名、端口必须完全一致。

### 3.1 JSONP
利用 `<script>` 标签不受同源策略限制的特性。**仅支持 GET 请求**。

**原理**:
1.  客户端定义一个回调函数 `function handleData(data) { ... }`。
2.  动态创建 `<script src="http://api.com?callback=handleData">`。
3.  服务端返回 `handleData({ "name": "Jack" })`。
4.  脚本加载后立即执行回调。

**手写 JSONP**:
```javascript
function jsonp({ url, params, callbackName }) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        // 将参数拼接到 URL
        const queryString = Object.entries(params)
            .map(([k, v]) => `${k}=${v}`).join('&');
        script.src = `${url}?${queryString}&callback=${callbackName}`;
        
        // 定义全局回调
        window[callbackName] = (data) => {
            resolve(data);
            document.body.removeChild(script);
            delete window[callbackName];
        };
        
        script.onerror = reject;
        document.body.appendChild(script);
    });
}
```

### 3.2 CORS (跨域资源共享)
W3C 标准，服务端设置响应头。

*   **简单请求 (Simple Request)**: GET/POST/HEAD，且 Header 简单。直接发送。
*   **预检请求 (Preflight Request)**: OPTIONS 方法。
    *   当使用 `PUT/DELETE` 或自定义 Header (`Authorization`) 时触发。
    *   浏览器先发 OPTIONS 询问服务器 `Access-Control-Allow-Methods` 等。
    *   服务器通过后，浏览器才发送实际请求。

### 3.3 代理 (Proxy)
*   **Nginx 反向代理**: 生产环境常用。前端请求同域 `/api`，Nginx 转发到后端目标域。
*   **DevServer Proxy**: 开发环境 (Vite/Webpack) 使用 Node 中间件转发。

---

## 4. 本地存储 (Storage)

| 特性 | Cookie | LocalStorage | SessionStorage | Session (服务端) |
| :--- | :--- | :--- | :--- | :--- |
| **数据量** | 4KB | 5MB | 5MB | 无限制 (服务器内存/库) |
| **有效期** | Expires 设置，默认会话级 | 永久有效，除非手动清除 | 仅当前 Tab 页有效 | 自定义 |
| **网络请求** | **每次请求自动携带** | 不参与网络传输 | 不参与网络传输 | - |
| **作用** | 身份维持 (Session ID) | 长期配置/数据缓存 | 表单临时数据 | 存储用户敏感数据 |

### 4.1 Token vs Cookie (身份认证)
*   **Cookie 认证**:
    *   有状态 (Stateful): 服务端需要存储 Session。
    *   自动携带: 容易导致 **CSRF** 攻击。
*   **Token (JWT) 认证**:
    *   无状态 (Stateless): 服务端只验签，不存状态。
    *   手动携带:通常放在 `Authorization: Bearer <token>` 头中。
    *   存储: 可以存 LocalStorage (易受 XSS 攻击) 或 HttpOnly Cookie (防 XSS)。

---

## 5. 浏览器缓存 (Caching)

### 5.1 强缓存 (本地命中)
不需要发请求，返回 200 (Memory/Disk Cache)。
*   **Cache-Control** (HTTP/1.1):
    *   `max-age=3600`: 3600秒内有效。
    *   `no-cache`: 跳过强缓存，走协商缓存。
    *   `no-store`: 不缓存。

### 5.2 协商缓存 (服务器询问)
发请求询问服务器。如果未修改，返回 **304**；修改了，返回 200。
*   **ETag / If-None-Match**: 基于内容 Hash (优先级高)。
*   **Last-Modified / If-Modified-Since**: 基于修改时间。
