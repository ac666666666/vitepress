# 包管理与 Monorepo

[pnpm 官方文档](https://pnpm.io/zh/)

## 1. 包管理工具进化史

### 1.1 npm (Node Package Manager)
*   **v1/v2**: 嵌套依赖树 (Nested)。依赖包的依赖包会重复安装，导致 `node_modules` 体积巨大，路径过深 (Windows 路径限制)。
*   **v3+**: 扁平化 (Flat)。将依赖尽可能提升到顶层 `node_modules`。
    *   **问题**: **幽灵依赖 (Phantom Dependencies)**。你可以 require 一个你没有在 package.json 中声明的包 (因为被你的依赖提升上来了)。

### 1.2 yarn
*   Facebook 推出，为了解决 npm 安装慢、版本不一致的问题。
*   引入 `yarn.lock` 锁定版本。
*   支持离线模式。
*   后来 npm v5+ 吸取了 yarn 的优点 (package-lock.json)，两者现在差异不大。

### 1.3 pnpm (Performant npm)
目前最推荐的包管理工具。

*   **原理**: 使用 **硬链接 (Hard link)** 和 **符号链接 (Symbolic link / Soft link)**。
    *   全局 Store 存储所有包。项目中的 `node_modules` 里的文件硬链接到 Store。**节省磁盘空间**。
    *   项目 `node_modules` 结构与依赖树一致 (非扁平)，通过软链解决路径问题。
*   **优势**:
    1.  **快**: 安装速度极快。
    2.  **省空间**: 多个项目共用同一个包。
    3.  **安全**: **彻底解决幽灵依赖**。你只能访问 package.json 中声明的包。

---

## 2. Monorepo (单体仓库)

**Monorepo**: 在一个 Git 仓库中管理多个项目 (Packages)。
**Multirepo**: 每个项目一个 Git 仓库。

### 2.1 为什么用 Monorepo?
*   **代码共享**: 公共库 (UI 组件、Utils) 可以直接被业务项目引用，无需发 npm 包。
*   **依赖管理**: 统一管理依赖版本，避免差异。
*   **原子提交**: 一个功能涉及多个包的修改，可以一次 Commit。

### 2.2 常见方案

#### 2.2.1 pnpm workspace (推荐)
配置简单，原生支持。

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

#### 2.2.2 Turborepo
Vercel 出品。
*   **特点**: 增量构建 (只构建变动的部分)，远程缓存 (云端加速)。
*   配合 pnpm 使用效果最佳。

#### 2.2.3 Lerna
老牌工具，现在多用于发包版本管理 (Versioning & Publishing)。

---

## 3. 依赖版本符号

| 符号 | 含义 | 例子 (`1.2.3`) |
| :--- | :--- | :--- |
| **^** (Caret) | 锁定主版本号 (Major)，更新次版本和补丁 | `^1.2.3` -> `1.x.x` (e.g., `1.3.0`, `1.2.4`) |
| **~** (Tilde) | 锁定主版本和次版本 (Minor)，只更新补丁 | `~1.2.3` -> `1.2.x` (e.g., `1.2.4`) |
| **无符号** | 锁定确切版本 | `1.2.3` -> 必须是 `1.2.3` |

> **最佳实践**: Library 开发建议用 `peerDependencies` 声明宿主环境需要的依赖 (如 React 组件库依赖 React)。
