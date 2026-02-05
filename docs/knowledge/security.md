# 前端安全

## 1. XSS (跨站脚本攻击)
- **原理**：攻击者在网页中注入恶意脚本。
- **类型**：存储型、反射型、DOM 型。
- **防御**：
  - 转义 HTML 特殊字符
  - 开启 CSP (内容安全策略)
  - HttpOnly Cookie

## 2. CSRF (跨站请求伪造)
- **原理**：利用用户已登录的身份，在用户不知情的情况下发送恶意请求。
- **防御**：
  - SameSite Cookie
  - CSRF Token
  - 验证 Referer/Origin

## 3. SQL 注入
- **原理**：通过构造恶意的 SQL 语句，实现对数据库的非法操作。
- **防御**：使用参数化查询 (PreparedStatement)，避免字符串拼接 SQL。
