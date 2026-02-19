# React Router 路由原理

[React 官方文档](https://react.dev/)

React Router 是 React 生态中最流行的路由库。

## 1. 路由模式 (Hash vs History)

### Hash 模式
URL 中包含 `#` 符号 (e.g., `http://example.com/#/home`)。
- **原理**：监听 `hashchange` 事件。
- **优点**：兼容性好 (IE8+)，无需服务端配置。
- **缺点**：URL 不美观，SEO 较差。

### History 模式
URL 看起来像普通的路径 (e.g., `http://example.com/home`)。
- **原理**：基于 HTML5 History API (`pushState`, `replaceState`) 和 `popstate` 事件。
- **优点**：URL 美观，SEO 友好。
- **缺点**：兼容性稍差 (IE10+)，**需要服务端配置** (否则刷新页面 404)。

---

## 2. 核心组件

- **BrowserRouter**: 使用 HTML5 history API。
- **HashRouter**: 使用 hash 模式。
- **Routes**: 路由匹配规则容器 (React Router v6)。
- **Route**: 定义路径与组件的映射。
- **Link / NavLink**: 声明式导航 (会被渲染为 `<a>` 标签)。
- **Navigate**: 重定向。
- **Outlet**: 嵌套路由渲染位置 (类似 Vue 的 `<router-view>`)。

---

## 3. Hooks API

- **useNavigate**: 编程式导航。
- **useParams**: 获取动态路由参数。
- **useLocation**: 获取当前 location 对象 (state, hash, search)。
- **useSearchParams**: 获取查询参数 (query string)。

```javascript
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/about")}>Go to About</button>
  );
}
```
