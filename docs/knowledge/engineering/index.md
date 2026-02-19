# 前端工程化体系

前端工程化是指使用软件工程的技术和方法，将前端开发流程标准化、规范化、自动化，以提高开发效率、代码质量和可维护性。

## 1. 核心领域

### 1.1 构建工具 (Build Tools)
*   **Webpack**: 静态模块打包器，生态最丰富，适合大型项目。
*   **Vite**: 基于 ESM 的新一代构建工具，开发服务器秒开，生产环境使用 Rollup。
*   **Rollup**: 专注于库 (Library) 的打包，Tree Shaking 效果好。
*   **Esbuild**: 基于 Go 编写，速度极快，常用于加速构建。

### 1.2 包管理 (Package Management)
*   **npm / yarn**: 传统的包管理工具。
*   **pnpm**: 基于软链和硬链，节省磁盘空间，解决幽灵依赖。
*   **Monorepo**: 单体仓库管理 (pnpm workspace, Turborepo, Lerna)。

### 1.3 代码规范 (Standardization)
*   **Linter**: ESLint (JS/TS), Stylelint (CSS)。
*   **Formatter**: Prettier。
*   **Git Hooks**: Husky + Lint-staged (提交前自动检查)。
*   **Commit规范**: Commitlint + Commitizen。

### 1.4 模块化 (Modularity)
*   **CommonJS**: Node.js 标准。
*   **ES Modules (ESM)**: 浏览器和新版 Node.js 标准。
*   **UMD**: 兼容多种模块规范。

### 1.5 自动化部署 (CI/CD)
*   **CI (持续集成)**: GitHub Actions, GitLab CI, Jenkins。
*   **CD (持续部署)**: Docker, Nginx, K8s。

---

## 2. 为什么需要工程化？

1.  **解决复杂性**: 随着项目规模扩大，手动管理依赖和文件变得不可能。
2.  **团队协作**: 统一规范，降低沟通成本。
3.  **性能优化**: 自动压缩、代码分割、Tree Shaking。
4.  **开发体验**: 热更新 (HMR)、TypeScript 支持、CSS 预处理。
