# AC VitePress 网站项目

🌐 **在线访问**: [http://129.204.12.129:8882/](http://129.204.12.129:8882/)

这是一个基于 [VitePress](https://vitepress.dev/) 构建的静态文档网站/个人博客项目。集成了丰富的首页交互特效和自定义组件，旨在提供生动有趣的用户体验。

## ✨ 主要特性

- **📚 文档驱动**：利用 VitePress 强大的 Markdown 解析能力，轻松编写技术文档和博客。
- **🎨 炫酷首页交互**：
  - **🔮 七彩流光水晶球**：核心视觉元素，支持 HSL 自动变色，拥有晶莹剔透的玻璃质感。
  - **👋 互动体验**：支持鼠标/触摸跟随，抚摸球体触发爱心特效和“心情+1”反馈。
  - **💬 智能气泡君**：自带多语言梗库的对话气泡，支持自动轮播和点击切换，与用户幽默互动。
  - **✨ 粒子特效**：全屏背景自动漂浮粒子，以及鼠标点击时的随机 Emoji 爆炸效果。
- **📱 响应式设计**：完美适配移动端和桌面端，针对触摸操作进行了专门优化（如防误触、流畅度提升）。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动本地开发环境

```bash
npm run docs:dev
```

启动后访问 `http://localhost:5173` 即可预览。

### 3. 打包构建

```bash
npm run docs:build
```

构建产物将输出到 `docs/.vitepress/dist` 目录。

### 4. 本地预览构建结果

```bash
npm run docs:preview
```

## 📂 目录结构

- `docs/`: 文档源文件目录
  - `.vitepress/`: VitePress 配置、主题和自定义组件
    - `theme/components/`: 自定义 Vue 组件
      - `HomeHeroCanvas.vue`: 水晶球核心交互组件
      - `HomeParticles.vue`: 背景粒子组件
      - `ClickEffect.vue`: 鼠标点击特效组件
  - `index.md`: 首页配置
  - `knowledge/`, `interview/`, `study/`: 各分类文档

## 🛠️ 技术栈

- **VitePress**: 静态网站生成器
- **Vue 3**: 前端框架
- **TypeScript**: 类型安全
- **HTML5 Canvas**: 高性能图形绘制

## 📝 部署

本项目构建后生成纯静态文件，可部署至：

- GitHub Pages / Gitee Pages
- Vercel / Netlify
- Nginx / Apache 服务器
