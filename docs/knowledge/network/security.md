# 网络安全：XSS 与 CSRF

[MDN HTTP 文档](https://developer.mozilla.org/zh-CN/docs/Web/HTTP)

## 1. XSS (Cross-Site Scripting)

**跨站脚本攻击**。攻击者在目标网站中注入恶意脚本，当用户访问时，脚本在用户浏览器中执行，窃取 Cookie、Session ID 等敏感信息，或进行恶意重定向。

<SecurityXSSDemo />

### 1.1 攻击类型详解

| 类型           | 描述                                                           | 典型场景                               |
| :------------- | :------------------------------------------------------------- | :------------------------------------- |
| **反射型 XSS** | 恶意脚本作为 URL 参数，服务器接收后直接回显到页面中            | 诱导用户点击恶意链接（邮件、社交媒体） |
| **存储型 XSS** | 恶意脚本被永久存储在数据库中，任何访问该页面的用户都会中招     | 论坛发帖、评论区、个人简介             |
| **DOM 型 XSS** | 纯前端漏洞，JS 从 URL/Input 获取数据并直接操作 DOM (innerHTML) | 前端路由参数处理不当                   |

### 1.2 防御措施

1.  **输入过滤 (Input Validation)**: 后端校验所有输入数据。
2.  **输出转义 (Output Encoding)**: 将 HTML 特殊字符 (`<`, `>`, `&`, `"`, `'`) 转义为实体编码。
    - 例如：`<` -> `&lt;`, `>` -> `&gt;`。
3.  **开启 CSP (Content Security Policy)**:
    - 限制加载外部脚本的域名。
    - 禁止内联脚本 (`<script>...`)。
4.  **HttpOnly Cookie**: 设置 Cookie 为 `HttpOnly`，禁止 JS 读取 (`document.cookie`)，防止 Session 劫持。

## 2. CSRF (Cross-Site Request Forgery)

**跨站请求伪造**。攻击者诱导已登录用户访问恶意网站，利用用户的身份（Cookie）向目标网站发送恶意请求（如转账、改密）。

### 2.1 攻击原理

1.  用户登录 `bank.com`，浏览器保留了 Cookie。
2.  用户访问恶意网站 `evil.com`。
3.  `evil.com` 页面中包含一个隐藏请求：`<img src="http://bank.com/transfer?to=hacker&amount=1000">`。
4.  浏览器自动携带 `bank.com` 的 Cookie 发送该请求。
5.  `bank.com` 验证 Cookie 有效，执行转账。

### 2.2 防御措施

1.  **SameSite Cookie 属性**:
    - `Strict`: 完全禁止跨站携带 Cookie。
    - `Lax` (现代浏览器默认): 仅允许部分导航（如 GET 链接跳转）携带。
2.  **CSRF Token**:
    - 服务端生成一个随机 Token，通过页面隐藏域或 Header 下发。
    - 提交表单时必须携带该 Token。
    - 服务端验证 Token 是否有效（攻击者无法获取 Token）。
3.  **验证 Referer/Origin Header**: 检查请求来源是否合法（但可能被伪造或缺失）。

## 3. SQL 注入

**原理**: 攻击者通过构造恶意的 SQL 语句（如 `' OR '1'='1`），欺骗数据库执行非授权操作。

**防御**:

- **使用参数化查询 (Prepared Statements)**: 数据库会将输入视为参数而非 SQL 指令。
- **ORM 框架**: 现代 ORM (如 Hibernate, Sequelize) 通常自带防护。
