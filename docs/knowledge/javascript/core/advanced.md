# JavaScript 进阶话题

[MDN JavaScript 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

## 1. 函数式编程 (Functional Programming)

函数式编程是一种编程范式，核心思想是将运算过程抽象成函数。它强调**不可变性 (Immutability)** 和**纯函数 (Pure Functions)**。

### 1.1 核心概念

*   **纯函数 (Pure Function)**: 
    *   **定义**: 相同的输入永远得到相同的输出，且无副作用（不修改外部状态，不发起网络请求，不修改参数）。
    *   **优势**: 可缓存 (Memoization)、可测试、并行处理安全。
    *   **示例**: `slice` (纯) vs `splice` (不纯)。
*   **高阶函数 (Higher-Order Function)**: 
    *   **定义**: 接受函数作为参数或返回函数的函数。
    *   **示例**: `map`, `filter`, `reduce`。
*   **不可变性 (Immutability)**:
    *   **定义**: 数据一旦创建就不能被修改。
    *   **优势**: 避免副作用，利于状态管理（如 Redux）。

### 1.2 柯里化 (Currying)

将一个多参数函数转换成一系列单参数函数的技术。

**作用**:
1.  **参数复用**: 固定部分参数，生成功能更具体的函数。
2.  **延迟执行**: 攒够参数再执行。

**实现**:

```javascript
// 通用柯里化函数
function curry(fn) {
  return function curried(...args) {
    // 如果传入参数个数 >= 原函数需要的参数个数，则执行原函数
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      // 否则返回一个新函数，接收剩余参数
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  }
}

// 示例
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
```

### 1.3 组合 (Composition)

将多个函数组合成一个新函数，数据流从右向左流动。`compose(f, g)(x)` 等价于 `f(g(x))`。

**作用**:
解决“洋葱代码” (嵌套调用) 问题，使代码扁平化，逻辑清晰。

**实现**:

```javascript
// Redux 中的 compose 实现
function compose(...funcs) {
  if (funcs.length === 0) return arg => arg;
  if (funcs.length === 1) return funcs[0];
  
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

// 示例
const toUpperCase = str => str.toUpperCase();
const addExclamation = str => str + '!';
const split = str => str.split('');

const process = compose(split, addExclamation, toUpperCase);
console.log(process('hello')); // ['H', 'E', 'L', 'L', 'O', '!']
// 执行顺序: toUpperCase -> addExclamation -> split
```

## 2. 依赖注入 (Dependency Injection)

一种设计模式，用于解耦。核心思想是：**依赖对象不由内部生产，而是由外部传入**。

### 2.1 为什么需要它？

*   **解耦**: 模块间依赖关系更灵活。
*   **可测试性**: 单元测试时可以轻松注入 Mock 对象。

### 2.2 代码对比

```javascript
// 耦合 (Coupling)
class Engine {
  start() { console.log('Engine started'); }
}

class Car {
  constructor() {
    this.engine = new Engine(); // 🔴 强依赖：Car 必须知道 Engine 的具体实现
  }
  drive() {
    this.engine.start();
  }
}

// 解耦 (Dependency Injection)
class Car {
  constructor(engine) {
    this.engine = engine; // 🟢 依赖注入：Car 只关心 engine 有 start 方法
  }
  drive() {
    this.engine.start();
  }
}

// 使用
const v8 = new Engine();
const myCar = new Car(v8);
```

## 3. 常见设计模式 (Design Patterns)

### 3.1 单例模式 (Singleton)

保证一个类仅有一个实例，并提供一个访问它的全局访问点。
**应用**: Vuex Store, Window 对象, 全局模态框。

```javascript
class Singleton {
  static instance = null;
  constructor(name) {
    if (Singleton.instance) return Singleton.instance;
    this.name = name;
    Singleton.instance = this;
  }
}
```

### 3.2 发布订阅模式 (Publish/Subscribe)

订阅者 (Subscriber) 订阅事件，发布者 (Publisher) 发布事件，两者通过调度中心解耦。
**应用**: Vue EventBus, Node.js EventEmitter。

```javascript
class EventEmitter {
  constructor() { this.events = {}; }
  on(name, fn) {
    if (!this.events[name]) this.events[name] = [];
    this.events[name].push(fn);
  }
  emit(name, ...args) {
    if (this.events[name]) {
      this.events[name].forEach(fn => fn(...args));
    }
  }
}
```

### 3.3 观察者模式 (Observer)

目标 (Subject) 维护观察者 (Observer) 列表，当目标状态发生改变时，通知所有观察者。
**应用**: Vue 2 响应式原理 (Dep 和 Watcher)。

*   **区别**: 发布订阅模式有“中间人”（调度中心），观察者模式是直接通信。

### 3.4 策略模式 (Strategy)

定义一系列算法，把它们一个个封装起来，并且使它们可以相互替换。
**应用**: 表单验证、多种支付方式。

```javascript
// 🔴 Bad: 很多 if-else
if (type === 'S') return salary * 4;
if (type === 'A') return salary * 3;
if (type === 'B') return salary * 2;

// 🟢 Good: 策略模式
const strategies = {
  'S': (salary) => salary * 4,
  'A': (salary) => salary * 3,
  'B': (salary) => salary * 2
};
const calculateBonus = (type, salary) => strategies[type](salary);
```

## 4. 垃圾回收 (Garbage Collection)

JavaScript 引擎自动管理内存，主要使用 **标记清除 (Mark-and-Sweep)** 算法。

### 4.1 标记清除算法
1.  **标记**: 从根对象 (Root, 如 window) 出发，递归遍历所有能访问到的对象，标记为“可达”。
2.  **清除**: 遍历堆内存中所有对象，回收未被标记（不可达）的对象。

### 4.2 内存泄漏 (Memory Leak)
不再需要的内存没有被释放。

**常见场景**:
1.  **意外的全局变量**: 未声明直接赋值。
2.  **被遗忘的定时器**: `setInterval` 未清除。
3.  **闭包**: 长期持有的引用。
4.  **DOM 引用**: 删除了 DOM 节点，但 JS 变量还持有其引用。
