# 自动化部署 (CI/CD)

[GitHub Actions 文档](https://docs.github.com/zh/actions)

## 1. 概念理解

*   **CI (Continuous Integration - 持续集成)**:
    *   开发人员频繁提交代码。
    *   自动触发构建、测试 (Unit Test)、代码检查 (Lint)。
    *   目的：尽早发现错误，保证主干代码质量。
*   **CD (Continuous Delivery/Deployment - 持续交付/部署)**:
    *   **持续交付**: 代码通过 CI 后，自动部署到预发布环境 (Staging)，等待人工审核上线。
    *   **持续部署**: 代码通过所有检查后，**自动** 部署到生产环境 (Production)。

---

## 2. GitHub Actions 实战

GitHub 免费提供的 CI/CD 服务。配置文件在 `.github/workflows/*.yml`。

### 2.1 示例：自动构建并部署到 GitHub Pages

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ] # 监听 main 分支的 push 事件

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest # 运行环境

    steps:
      - name: Checkout # 拉取代码
        uses: actions/checkout@v3

      - name: Setup Node.js # 安装 Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install Dependencies # 安装依赖
        run: npm install

      - name: Build # 构建
        run: npm run build

      - name: Deploy # 部署
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist # 构建输出目录
          branch: gh-pages # 推送到哪个分支
```

---

## 3. Nginx 基础配置

前端项目 (SPA) 打包后通常是一堆静态文件 (html, css, js)，最常用的部署方式是使用 Nginx。

### 3.1 核心配置 (解决 History 模式 404)

SPA 应用使用 History 路由时，刷新页面会向服务器请求 `http://site.com/about`，但服务器只有 `index.html`，没有 `about` 目录，导致 404。

**解决方案**: 配置 `try_files`，将所有找不到的资源都重定向到 `index.html`，交给前端路由处理。

```nginx
server {
    listen       80;
    server_name  localhost;

    # 静态资源目录
    root   /usr/share/nginx/html;
    index  index.html index.htm;

    location / {
        # 核心：尝试查找文件($uri)，找不到找目录($uri/)，还找不到就返回 index.html
        try_files $uri $uri/ /index.html;
    }

    # 反向代理接口
    location /api/ {
        proxy_pass http://backend-server:8080/;
        proxy_set_header Host $host;
    }
}
```

---

## 4. Docker 容器化

将前端应用打包成 Docker 镜像，保证环境一致性 ("Build once, run anywhere")。

### 4.1 Dockerfile 编写

```dockerfile
# 阶段 1: 构建 (Build Stage)
FROM node:18 as builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# 阶段 2: 运行 (Production Stage)
FROM nginx:alpine
# 将构建阶段生成的 dist 目录复制到 Nginx 目录
COPY --from=builder /app/dist /usr/share/nginx/html
# 复制自定义 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 4.2 常用命令
*   `docker build -t my-app .`: 构建镜像。
*   `docker run -d -p 80:80 my-app`: 运行容器。
