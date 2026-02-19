# Vue Router 进阶指南

[Vue.js 官方文档](https://cn.vuejs.org/)

Vue Router 是 Vue.js 官方的路由管理器。除了基础的跳转，它还提供了强大的守卫、动态匹配和元信息功能。

## 1. 路由模式原理 (Hash vs History)

### Hash 模式

- **URL**: `http://example.com/#/home`
- **原理**: 基于 `window.onhashchange` 事件监听 hash 值的变化。
- **优点**: 兼容性好 (IE8+)，无需服务端配置。
- **缺点**: URL 带有 `#`，不够美观；SEO 相对较差。

### History 模式

- **URL**: `http://example.com/home`
- **原理**: 基于 HTML5 History API (`pushState`, `replaceState`) 改变 URL 而不刷新页面。通过 `popstate` 事件监听浏览器的前进后退。
- **优点**: URL 美观，符合标准。
- **缺点**: **必须服务端配置**。如果直接访问子路径，服务器会报 404，需要配置 fallback 到 index.html。

**Nginx 配置示例**:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## 2. 导航守卫 (Navigation Guards) 完整流程

这是面试中的**超高频考点**。请务必背诵以下流程：

1.  **导航被触发**。
2.  在失活的组件里调用 `beforeRouteLeave`。
3.  调用全局的 `beforeEach` 守卫。
4.  在重用的组件里调用 `beforeRouteUpdate` (2.2+)。
5.  在路由配置里调用 `beforeEnter`。
6.  解析异步路由组件。
7.  在被激活的组件里调用 `beforeRouteEnter`。
8.  调用全局的 `beforeResolve` 守卫 (2.5+)。
9.  **导航被确认**。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。

### 实战：全局登录拦截

```javascript
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  // 判断该路由是否需要登录权限
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      next({
        path: "/login",
        query: { redirect: to.fullPath }, // 登录后重定向回原页面
      });
    } else {
      next();
    }
  } else {
    next();
  }
});
```

---

## 3. 动态路由 (Dynamic Routing)

在后台管理系统中，通常需要根据用户角色 (RBAC) 动态生成菜单和路由。

### 3.1 addRoute (Vue Router 4)

Vue Router 4 废弃了 `addRoutes`，改为 `addRoute`。

```javascript
// 1. 定义静态路由 (Login, 404 等)
const routes = [
  /* ... */
];

// 2. 登录后获取用户权限
const userRoles = ["admin"];

// 3. 过滤出有权限的路由表
const accessRoutes = filterAsyncRoutes(asyncRoutes, userRoles);

// 4. 动态添加到路由实例
accessRoutes.forEach((route) => {
  router.addRoute(route);
});

// 5. 解决刷新 404 问题
// 在 beforeEach 中判断，如果路由尚未添加，则添加并触发重定向
```

---

## 4. 路由懒加载 (Lazy Loading)

为了优化首屏加载速度，我们将不同路由对应的组件分割成不同的代码块，当路由被访问时才加载对应组件。

```javascript
const User = () => import(/* webpackChunkName: "group-user" */ "./User.vue");

const routes = [{ path: "/user", component: User }];
```

**原理**: 结合 webpack 的 Code Splitting 功能，生成独立的文件 (chunk)。

---

## 5. 滚动行为 (Scroll Behavior)

切换路由时，页面滚动条的处理。

```javascript
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // 浏览器的后退/前进按钮触发时，恢复之前位置
      return savedPosition;
    } else {
      // 普通跳转，滚动到顶部
      return { top: 0 };
    }
  },
});
```

---

## 6. 路由传参: Params vs Query

### Params

- **语法**: `/user/:id`
- **跳转**: `router.push({ name: 'user', params: { id: 123 } })`
- **表现**: `/user/123`
- **注意**: 必须在路由配置中定义 `:id`，否则刷新页面参数会丢失 (除非使用 Vue Router 4 的状态保存，但不推荐)。

### Query

- **语法**: `/user`
- **跳转**: `router.push({ path: '/user', query: { id: 123 } })`
- **表现**: `/user?id=123`
- **特点**: 参数拼接在 URL 后面，刷新不丢失。
