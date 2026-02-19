# Node.js 全栈开发详解

[Node.js 官方文档](https://nodejs.org/zh-cn/docs/)

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境，它让 JavaScript 可以运行在服务端。

## 1. 核心运行机制

### 1.1 单线程与异步 I/O

- **单线程**: JS 代码在主线程运行，无法利用多核 CPU (需配合 Cluster/Worker Threads)。
- **非阻塞 I/O**: 遇到 I/O 操作 (文件/网络)，交给底层 C++ 线程池 (libuv) 处理，主线程继续执行。
- **优势**: 高并发，适合 I/O 密集型应用。
- **劣势**: CPU 密集型任务 (如图像处理、加密) 会阻塞主线程。

### 1.2 事件循环 (Event Loop) 深度解析

Node.js 的事件循环分为 6 个阶段，按顺序执行：

1.  **Timers**: 执行 `setTimeout` 和 `setInterval` 的回调。
2.  **Pending Callbacks**: 执行系统操作的回调 (如 TCP 错误)。
3.  **Idle, Prepare**: 内部使用。
4.  **Poll (轮询)**: 获取新的 I/O 事件；执行 I/O 回调。**这是最主要的阶段**。
5.  **Check**: 执行 `setImmediate` 的回调。
6.  **Close Callbacks**: 执行关闭回调 (如 `socket.on('close', ...)`).

> **微任务 (Microtasks)**: `Promise.then`, `process.nextTick`。
>
> - 注意: 微任务不在 Event Loop 的阶段中，而是在**每个阶段结束后**立即执行。
> - `process.nextTick` 优先级高于 `Promise`。

#### 代码演示: 执行顺序

```javascript
console.log("1");

setTimeout(() => {
  console.log("2");
  process.nextTick(() => console.log("3"));
  new Promise((r) => r()).then(() => console.log("4"));
}, 0);

new Promise((r) => r()).then(() => console.log("5"));

process.nextTick(() => console.log("6"));

setImmediate(() => console.log("7"));

console.log("8");

// 输出顺序: 1 -> 8 -> 6 -> 5 -> 2 -> 3 -> 4 -> 7
// 解析:
// 1. 同步代码: 1, 8
// 2. 微任务 (Tick): 6
// 3. 微任务 (Promise): 5
// 4. 进入 Timers 阶段 (setTimeout): 打印 2
//    - 在 setTimeout 回调里产生了新的微任务 (3, 4)
//    - Timers 阶段结束前，清空微任务: 3, 4
// 5. 进入 Check 阶段 (setImmediate): 7
```

---

## 2. 核心模块与实战

### 2.1 Stream (流)

处理大文件或网络数据时的神器。避免一次性将文件读入内存 (OOM)。

- **四种类型**: Readable (读), Writable (写), Duplex (双向), Transform (变换)。
- **管道 (Pipe)**: `source.pipe(dest)`。

#### 演示: 大文件复制 (内存优化)

```javascript
const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  // 错误做法: fs.readFile 读取整个文件 (内存爆炸)
  // fs.readFile('./big-file.mp4', (err, data) => res.end(data));

  // 正确做法: Stream
  const src = fs.createReadStream("./big-file.mp4");
  src.pipe(res); // 边读边发
});

server.listen(8000);
```

### 2.2 Buffer (缓冲区)

用于处理二进制数据 (TCP 流、文件流)。`Buffer` 是在 V8 堆外分配的内存。

```javascript
// 创建
const buf1 = Buffer.from("Hello");
const buf2 = Buffer.alloc(10); // 分配 10 字节，自动归零

// 拼接
const buf3 = Buffer.concat([buf1, buf2]);
```

### 2.3 Process & Cluster

利用多核 CPU。

```javascript
const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`主进程 ${process.pid} 正在运行`);

  // 衍生工作进程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
  });
} else {
  // 工作进程可以共享任何 TCP 连接
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end("Hello World\n");
    })
    .listen(8000);

  console.log(`工作进程 ${process.pid} 已启动`);
}
```

---

## 3. 框架对比: Express vs Koa

### 3.1 Express

- **模型**: 线性中间件。
- **特点**: 内置功能多 (路由、模板引擎)，社区最大。
- **缺点**: 回调地狱 (虽支持 Async/Await 但核心仍是 Callback)，错误处理麻烦。

### 3.2 Koa

- **模型**: 洋葱模型 (Onion Model)。
- **特点**: 极简 (核心只有 500 行)，基于 `async/await`，中间件控制权更强 (可以控制 `next()` 后的逻辑)。

#### 演示: 洋葱模型

```javascript
const Koa = require("koa");
const app = new Koa();

// 中间件 1
app.use(async (ctx, next) => {
  console.log("1. Start");
  await next(); // 等待下一个中间件执行完
  console.log("1. End");
});

// 中间件 2
app.use(async (ctx, next) => {
  console.log("2. Start");
  await next();
  console.log("2. End");
});

app.use(async (ctx) => {
  console.log("3. Business Logic");
  ctx.body = "Hello Koa";
});

// 输出:
// 1. Start
// 2. Start
// 3. Business Logic
// 2. End
// 1. End
```

---

## 4. 面试常考题

### Q1: `module.exports` 和 `exports` 的区别？

- `exports` 只是 `module.exports` 的一个引用 (快捷方式)。
- 最终导出的是 `module.exports` 指向的对象。
- **坑**: 如果直接给 `exports` 赋值 (`exports = { a: 1 }`)，会切断它与 `module.exports` 的联系，导致导出失败。

### Q2: `process.nextTick` vs `setImmediate`？

- `nextTick`: 当前操作结束，**下一阶段开始前**执行 (插队，优先级最高)。
- `setImmediate`: 在 **Check 阶段**执行 (类似 `setTimeout(..., 0)`，但性能更好)。
- 如果递归调用 `process.nextTick`，会导致 Event Loop 饥饿 (后续阶段无法执行)。

### Q3: 如何解决 Node.js 的 CPU 密集型任务问题？

1.  **Worker Threads**: 使用 Node.js 内置的多线程模块。
2.  **Child Process**: `fork` 子进程计算。
3.  **Cluster**: 多进程集群。
4.  **C++ Addons**: 编写 C++ 插件处理计算。

### Q4: Stream 的背压 (Backpressure) 是什么？

- **现象**: 读流速度 (Read) > 写流速度 (Write)。会导致数据积压在内存中，可能导致崩溃。
- **解决**: `pipe` 方法自动处理了背压。当写流缓冲区满时，暂停读流；当写流缓冲区排空 (`drain` 事件) 时，恢复读流。
