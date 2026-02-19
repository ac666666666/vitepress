# 执行机制与作用域

[MDN JavaScript 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

## 1. 事件循环 (Event Loop)

JavaScript 是单线程的。

- **同步任务**: 直接在主线程执行。
- **异步任务**: 进入任务队列，等待主线程空闲。

## 2. 宏任务与微任务 (MacroTask vs MicroTask)

JavaScript 的异步任务分为两类：**宏任务**和**微任务**。它们的执行时机不同，这直接决定了代码的输出顺序。

### 2.1 分类

| 类型                   | 代表 API                                                                                      | 执行时机                                                         |
| :--------------------- | :-------------------------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| **微任务 (MicroTask)** | `Promise.then/catch/finally`、`MutationObserver`、`process.nextTick` (Node.js)                | 当前同步代码执行完后，**立即执行所有微任务**，然后再执行宏任务。 |
| **宏任务 (MacroTask)** | `script` (整体代码)、`setTimeout`、`setInterval`、`setImmediate` (Node.js)、I/O、UI Rendering | 微任务队列清空后，从宏任务队列中取出一个执行。                   |

### 2.2 事件循环 (Event Loop) 流程

1. **执行同步代码** (这本身就是一个宏任务)。
2. **清空微任务队列**：执行所有微任务。
3. **尝试 DOM 渲染** (如果有必要)。
4. **执行一个宏任务**。
5. **回到步骤 2**。

**口诀**：同步 -> 微任务 -> 渲染 -> 宏任务 (每次宏任务执行完都要去清空微任务)。

### 2.3 经典面试题：执行顺序

```javascript
console.log("1"); // 同步

setTimeout(() => {
  console.log("2"); // 宏任务
}, 0);

Promise.resolve().then(() => {
  console.log("3"); // 微任务
});

new Promise((resolve) => {
  console.log("4"); // 同步 (构造函数是立即执行的)
  resolve();
}).then(() => {
  console.log("5"); // 微任务
});

console.log("6"); // 同步
```

**输出结果**：

```
1
4
6
3
5
2
```

**解析**：

1.  **同步阶段**：
    - 输出 `1`。
    - 遇到 `setTimeout`，将其回调放入 **宏任务队列**。
    - 遇到 `Promise.resolve().then`，回调放入 **微任务队列** (记为微1)。
    - 遇到 `new Promise`，立即执行构造函数，输出 `4`。
    - `resolve()` 触发 `then`，回调放入 **微任务队列** (记为微2)。
    - 输出 `6`。
2.  **清空微任务**：
    - 执行微1，输出 `3`。
    - 执行微2，输出 `5`。
3.  **执行宏任务**：
    - 取出 `setTimeout` 回调，输出 `2`。

### 2.3.1 变体：如果用 reject 呢？

如果是 `reject()`，它会触发 `then` 的第二个回调参数，或者 `catch` 回调。**这些回调依然是微任务**。

```javascript
console.log("1");

new Promise((resolve, reject) => {
  console.log("2");
  reject("error"); // 状态变为 rejected
})
  .then(
    () => console.log("3"), // 成功回调 (不执行)
    (err) => console.log("4: " + err), // 失败回调 (进入微任务队列)
  )
  .then(() => {
    console.log("5"); // 链式调用 (前一个 then 执行完后，产生新的微任务)
  });

console.log("6");
```

**输出结果**：

```
1
2
6
4: error
5
```

**解析**：

1.  **同步阶段**：输出 `1` -> `2` -> `6`。
2.  `reject('error')` 把 `.then` 的第二个回调（失败回调）放入**微任务队列**。
3.  **清空微任务**：
    - 执行失败回调，输出 `4: error`。
    - 该回调执行完毕后，默认返回 `undefined` (相当于 resolved)，所以触发下一个 `.then`，将其回调放入**微任务队列**。
    - 执行下一个 `.then`，输出 `5`。

---

### 2.4 详解 MutationObserver

你提到的 `MutationObserver` 是一个 **HTML5 新特性**，它是一个用于**监视 DOM 变动**的接口。

#### 核心特点

1.  **它是微任务**：当 DOM 发生变化时，它不会立即触发回调，而是等待所有脚本执行完，进入微任务阶段时才触发。这保证了性能，避免频繁的 DOM 变动导致页面卡顿。
2.  **批量处理**：如果在一个事件循环中 DOM 发生了多次变化，`MutationObserver` 会把这些变化记录下来，一次性传给回调函数（也就是它把多次变动合并成一次回调）。

#### 适用场景

- 监听去广告插件是否删除了你的 DOM。
- 监听第三方库（如富文本编辑器）是否修改了 DOM 结构。
- 实现“撤销/重做”功能（记录 DOM 变化）。

#### 代码示例

```javascript
// 1. 选择需要观察的 DOM 节点
const targetNode = document.getElementById("some-id") || document.body;

// 2. 配置观察选项 (需要观察什么变动)
const config = {
  attributes: true, // 观察属性变动
  childList: true, // 观察子节点变动 (添加/删除节点)
  subtree: true, // 观察后代节点 (不仅是直接子节点)
};

// 3. 创建观察者实例 (回调函数)
const callback = function (mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      console.log("子节点发生变化 (添加或删除)");
    } else if (mutation.type === "attributes") {
      console.log("属性发生变化: " + mutation.attributeName);
    }
  }
};

const observer = new MutationObserver(callback);

// 4. 开始观察
observer.observe(targetNode, config);

// --- 测试一下 ---
// 修改属性 -> 触发微任务
targetNode.setAttribute("data-test", "123");
// 添加节点 -> 触发微任务
const p = document.createElement("p");
targetNode.appendChild(p);

// 控制台会在当前同步代码执行完后，输出变化记录
```

## 3. 作用域与作用域链

- **作用域**: 变量的可访问范围（全局、函数、块级）。
- **作用域链**: 查找变量时，先在当前作用域找，找不到则向上一级查找，直到全局作用域。

## 4. this 指向

1. **全局/普通函数调用**: 指向 `window` (严格模式下为 `undefined`)。
2. **对象方法调用**: 指向调用该方法的对象。
3. **构造函数调用**: 指向新创建的实例。
4. **箭头函数**: 继承外层作用域的 `this`。
5. **显式绑定**: `call`, `apply`, `bind` 指定 `this`。

## 5. bind, call, apply 的区别与手写实现

这三个方法都用于**改变函数执行时的 `this` 指向**。

### 5.1 区别对比

| 方法      | 参数形式                     | 执行时机       | 返回值         | 适用场景                   |
| :-------- | :--------------------------- | :------------- | :------------- | :------------------------- |
| **call**  | `fn.call(obj, arg1, arg2)`   | **立即执行**   | 函数执行结果   | 对象继承、借用方法         |
| **apply** | `fn.apply(obj, [argsArray])` | **立即执行**   | 函数执行结果   | 数组求最大值、数组合并     |
| **bind**  | `fn.bind(obj, arg1, arg2)`   | **不立即执行** | 返回一个新函数 | React/Vue 事件绑定、柯里化 |

**记忆口诀**：

- `call` 逗号隔开，`apply` 数组传参 (C-Comma, A-Array)。
- `bind` 不执行，返回新函数 (B-Bind, B-Back)。

### 5.2 常见应用场景

```javascript
// 1. 数组求最大值 (利用 apply 展开数组)
const arr = [1, 5, 3];
Math.max.apply(null, arr); // 5

// 2. 判断数据类型 (利用 call 借用 Object 原型方法)
Object.prototype.toString.call([]); // "[object Array]"

// 3. 类数组转数组 (利用 call 借用 slice)
function listToArray() {
  return Array.prototype.slice.call(arguments);
}
```

### 5.3 手写实现 (高频考点)

#### (1) 手写 `call`

**核心原理**：将函数作为对象的属性来调用 (`obj.fn()`)，这样 `this` 就指向了 `obj`。

```javascript
Function.prototype.myCall = function (context, ...args) {
  // 1. 如果 context 是 null/undefined，默认指向 window
  context = context || window;

  // 2. 为了避免属性名冲突，使用 Symbol
  const fnSymbol = Symbol();

  // 3. 将当前函数 (this) 赋值给 context 的属性
  context[fnSymbol] = this;

  // 4. 执行函数，并传入参数
  const result = context[fnSymbol](...args);

  // 5. 删除临时属性，保持对象原样
  delete context[fnSymbol];

  // 6. 返回执行结果
  return result;
};
```

#### (2) 手写 `apply`

与 `call` 类似，只是参数处理不同。

```javascript
Function.prototype.myApply = function (context, argsArr) {
  context = context || window;
  const fnSymbol = Symbol();
  context[fnSymbol] = this;

  // 处理参数：apply 的第二个参数是数组，如果没有传参则给个空数组
  const result = argsArr ? context[fnSymbol](...argsArr) : context[fnSymbol]();

  delete context[fnSymbol];
  return result;
};
```

#### (3) 手写 `bind` (难点)

`bind` 比较复杂，因为它返回的是一个函数，且需要考虑**作为构造函数** (`new`) 调用的情况。

```javascript
Function.prototype.myBind = function (context, ...args) {
  // 保存当前的函数 (fn)
  const fn = this;

  // 返回一个新的函数
  return function newFn(...newArgs) {
    // 合并参数：bind 时的参数 + 调用时的参数
    const allArgs = [...args, ...newArgs];

    // 判断是否被当做构造函数使用 (new newFn())
    // 如果是 new 调用，this 指向实例，不能被 context 覆盖
    if (this instanceof newFn) {
      return new fn(...allArgs);
    }

    // 普通调用，改变 this 指向 context
    return fn.apply(context, allArgs);
  };
};
```

## 6. 函数柯里化 (Currying)

将接受多个参数的函数变换成接受一个单一参数的函数，并且返回接受余下参数的新函数。

```javascript
function add(a) {
  return function (b) {
    return a + b;
  };
}
add(1)(2); // 3
```

## 7. setTimeout 误差与解决方案

`setTimeout` 和 `setInterval` 的延时并**不准确**，这在做动画或倒计时时需要特别注意。

### 7.1 误差产生的原因

1.  **事件循环机制 (Event Loop)**：
    `setTimeout` 只是负责在指定时间后，将回调函数**放入宏任务队列**。
    如果此时**主线程 (Call Stack)** 还有任务在执行（例如一个耗时的 `for` 循环），或者微任务队列里有任务，那么 `setTimeout` 的回调必须等待，直到主线程空闲。

    > **比喻**：你点了外卖（setTimeout），外卖员准时送到了楼下（进入队列），但你正在打游戏（主线程忙），必须等你打完这局（主线程空闲）才能去拿外卖。这个等待时间就是误差。

2.  **浏览器最小延时限制**：
    - HTML5 标准规定，`setTimeout` 嵌套层级超过 5 层时，最小延时为 **4ms**。
    - 未激活的标签页（后台运行），最小延时可能被浏览器强制设为 **1000ms** (为了省电)。

### 7.2 误差演示 (在线交互)

点击下方按钮，直接在页面上体验 `setTimeout` 的误差。

<TimeoutDemo />

#### 实验说明

1.  **测试自然误差**：
    - 即使主线程不阻塞，`setTimeout` 也会因为浏览器调度机制产生微小的误差（通常几毫秒）。
    - 你会看到每次执行的误差值。

2.  **测试阻塞误差** (慎点)：
    - 点击后，我们会先设定一个 **1秒** 的定时器。
    - 紧接着，我们会运行一个 **2秒** 的死循环来阻塞主线程。
    - **观察结果**：你会发现原本应该在 1秒后执行的定时器，硬生生被拖到了 2秒多才执行。这就证明了：**宏任务必须等待主线程空闲才能执行**。

```javascript
// 阻塞测试的核心代码逻辑
setTimeout(() => {
  console.log("定时器执行了！");
}, 1000);

// 模拟主线程阻塞 2秒
const start = Date.now();
while (Date.now() - start < 2000) {
  // 死循环...
}
```

### 7.3 解决方案

#### (1) 系统时间补偿法 (修正倒计时)

不要完全依赖 `setTimeout` 的自动计时，而是每次执行时，计算与**预定开始时间**的偏差，并在下一次 `setTimeout` 中减去这个偏差。

```javascript
function run(interval) {
  const startTime = Date.now(); // 记录开始时间
  let count = 0;

  function loop() {
    count++;
    // 理想的下一次执行时间
    const idealTime = startTime + count * interval;
    // 当前时间
    const now = Date.now();
    // 计算偏差 (当前时间 - 理想时间)
    const offset = now - idealTime;

    console.log(`第 ${count} 次, 偏差: ${offset}ms`);

    // 下一次执行时间 = 间隔 - 偏差 (若偏差太大，设为0尽快执行)
    const nextTime = Math.max(0, interval - offset);

    setTimeout(loop, nextTime);
  }

  setTimeout(loop, interval);
}

run(1000); // 启动修正版定时器
```

#### (2) requestAnimationFrame (动画专用)

如果是做动画，**强烈推荐**使用 `requestAnimationFrame`。

- **优势**：它由浏览器控制，与屏幕刷新率同步（通常 60Hz，即约 16.7ms 一次）。
- **特性**：如果页面在后台，它会暂停，节省 CPU。

```javascript
function animate() {
  // 更新动画逻辑
  element.style.left = parseInt(element.style.left) + 1 + "px";

  // 递归调用
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

#### (3) Web Worker (另起线程)

如果主线程计算量实在太大，可以把计时逻辑放到 `Web Worker` 中。Worker 运行在后台线程，不受主线程 UI 渲染和脚本执行的阻塞影响。
