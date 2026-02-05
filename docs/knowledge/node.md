# Node.js 全栈开发

## 1. 事件循环 (Event Loop)
- **宏任务 (MacroTask)**: setTimeout, setInterval, I/O.
- **微任务 (MicroTask)**: Promise.then, process.nextTick.
- **执行顺序**: 同步代码 -> 清空微任务队列 -> 执行一个宏任务 -> 清空微任务队列 -> ...

## 2. 核心模块
- **fs**: 文件系统操作。
- **http**: 创建 HTTP 服务器。
- **path**: 路径处理。
- **stream**: 流式处理数据（如大文件读写）。

## 3. 常见框架
- **Express**: 极简、灵活，基于中间件。
- **Koa**: 由 Express 原班人马打造，基于 async/await，更轻量。
- **NestJS**: 基于 TypeScript，借鉴 Angular 思想，适合企业级大型应用。
