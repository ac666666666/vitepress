# 前端规范化

[ESLint 官方文档](https://eslint.org/)

## 1. 为什么需要规范？
*   **统一风格**: 避免 "Tab vs Space"、"分号 vs 无分号" 的争论。
*   **减少 Bug**: 静态分析发现潜在错误 (如使用未定义的变量)。
*   **提高 Review 效率**: 关注逻辑而非格式。

---

## 2. 核心工具链

### 2.1 ESLint (Code Quality)
**关注代码质量** (和部分格式)。
*   **Rule**: 规则。`"no-unused-vars": "error"`.
*   **Plugin**: 扩展规则集。`eslint-plugin-vue`, `eslint-plugin-react`.
*   **Config**: 配置集合。`eslint-config-airbnb`, `eslint-config-standard`.

### 2.2 Prettier (Code Formatting)
**只关注代码格式**。
*   强制统一换行、引号、缩进、尾逗号。
*   **ESLint vs Prettier**: ESLint 也可以管格式，但 Prettier 更专业。
*   **冲突解决**: 使用 `eslint-config-prettier` 关闭 ESLint 中所有与 Prettier 冲突的格式规则。

### 2.3 Stylelint
CSS/Less/Scss 的 Linter。
*   检查 CSS 语法错误。
*   强制 CSS 书写顺序 (Order)。
*   禁止无效的 CSS 属性。

---

## 3. Git 工作流规范

### 3.1 Husky
Git Hooks 工具。在 Git 操作 (commit, push) 发生时触发脚本。

### 3.2 Lint-staged
只检查**暂存区 (Staged)** 的文件。
*   避免每次提交都检查整个项目 (太慢)。
*   配合 Husky 使用：`pre-commit` 钩子 -> 执行 `lint-staged` -> 执行 `eslint --fix`。

**配置示例 (package.json)**:
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,vue,ts}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

### 3.3 Commitlint
检查 Git Commit Message 是否符合规范。

**常用规范 (Conventional Commits)**:
`type(scope): subject`

*   **feat**: 新功能
*   **fix**: 修补 Bug
*   **docs**: 文档
*   **style**: 格式 (不影响代码运行)
*   **refactor**: 重构 (无新功能，无 Bug 修复)
*   **chore**: 构建过程或辅助工具的变动

**示例**: `feat(user): add login page`

---

## 4. 总结：一个健壮的项目配置
1.  **VSCode**: 安装 ESLint, Prettier 插件。
2.  **DevDependencies**: 安装 eslint, prettier, husky, lint-staged, commitlint。
3.  **Config Files**: `.eslintrc.js`, `.prettierrc`, `commitlint.config.js`。
4.  **Scripts**: `npm run lint`。
5.  **Git Hooks**: 确保代码提交前自动修复格式，且 Commit 信息规范。
