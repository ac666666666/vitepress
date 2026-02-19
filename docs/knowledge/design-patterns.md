# 前端常用设计模式

[设计模式参考](https://refactoring.guru/design-patterns)

设计模式是解决特定问题的成熟方案。

## 1. 创建型模式

### 1.1 单例模式 (Singleton)
保证一个类仅有一个实例，并提供一个全局访问点。
*   **场景**: Vuex/Redux 的 Store，全局唯一的 Dialog/Toast，Axios 实例。

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

### 1.2 工厂模式 (Factory)
根据不同的参数，返回不同类的实例。
*   **场景**: `React.createElement`，Vue 的 `h` 函数，根据权限生成不同路由。

---

## 2. 结构型模式

### 2.1 代理模式 (Proxy)
为对象提供一个代理，控制对该对象的访问。
*   **场景**:
    *   **Vue 3 响应式**: `Proxy` 拦截数据读写。
    *   **网络代理**: Nginx, Webpack DevServer Proxy。
    *   **事件代理**: 委托给父元素处理事件。

### 2.2 装饰器模式 (Decorator)
不改变原对象的基础上，动态添加功能。
*   **场景**: HOC (高阶组件)，React 的 `withRouter`，ES7 Decorator (`@connect`).

### 2.3 适配器模式 (Adapter)
解决接口不兼容问题。
*   **场景**: 封装 Axios (适配不同后端接口格式)，Vue 的 `computed` (将数据适配为视图需要的格式)。

---

## 3. 行为型模式

### 3.1 观察者模式 (Observer)
一对多依赖。当一个对象改变时，所有依赖它的对象都会收到通知。
*   **场景**: DOM 事件监听，Vue 2 的 `Dep` 和 `Watcher`。

```javascript
// 被观察者
class Subject {
  constructor() { this.observers = []; }
  add(observer) { this.observers.push(observer); }
  notify() { this.observers.forEach(o => o.update()); }
}
// 观察者
class Observer {
  update() { console.log('Updated!'); }
}
```

### 3.2 发布-订阅模式 (Pub-Sub)
与观察者类似，但多了一个**调度中心 (Event Bus)**。发布者和订阅者互不认识。
*   **场景**: Vue 的 `$on/$emit`，Node.js 的 `EventEmitter`。

```javascript
class EventEmitter {
  constructor() { this.events = {}; }
  on(type, handler) {
    if (!this.events[type]) this.events[type] = [];
    this.events[type].push(handler);
  }
  emit(type, ...args) {
    if (this.events[type]) {
      this.events[type].forEach(cb => cb(...args));
    }
  }
}
```

> **面试题: 观察者 vs 发布订阅**
> *   **观察者**: 观察者直接订阅目标，目标直接通知观察者。耦合度较紧。
> *   **发布订阅**: 有中间人 (Broker)。耦合度更松。

### 3.3 策略模式 (Strategy)
定义一系列算法，把它们封装起来，并使它们可以相互替换。
*   **场景**: 表单验证 (不同规则)，缓动动画 (不同算法)。
*   **优势**: 避免大量的 `if-else` 或 `switch`。

```javascript
// 策略表
const strategies = {
  'A': (salary) => salary * 2,
  'B': (salary) => salary * 3
};
// 环境
const calculateBonus = (level, salary) => strategies[level](salary);
```
