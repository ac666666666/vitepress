# JavaScript 核心知识点

## 1. 原型与原型链

### 什么是原型？
每个 JavaScript 对象（除了 `null`）在创建的时候就会与之关联另一个对象，这个对象就是我们所说的原型，每一个对象都会从原型"继承"属性。

### 原型链
当读取实例的属性时，如果找不到，就会查找与对象关联的原型中的属性，如果还查不到，就去找原型的原型，一直找到最顶层为止。

```javascript
function Person() {}
const p = new Person();

console.log(p.__proto__ === Person.prototype); // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
```

## 2. 闭包 (Closure)

### 定义
闭包是指有权访问另一个函数作用域中的变量的函数。

### 作用
1. 保护变量不被外部污染（私有变量）
2. 让变量始终保持在内存中

### 缺点
滥用闭包会导致内存泄漏。

```javascript
function createCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```

## 3. 防抖与节流

### 防抖 (Debounce)
触发高频事件后 n 秒内函数只会执行一次，如果 n 秒内高频事件再次被触发，则重新计算时间。
> 适用场景：搜索框输入、窗口大小调整

### 节流 (Throttle)
高频事件触发，但在 n 秒内只会执行一次，所以节流会稀释函数的执行频率。
> 适用场景：滚动加载、按钮防止重复点击
