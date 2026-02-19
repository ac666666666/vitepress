# 闭包 (Closure)

[MDN JavaScript 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

## 定义
闭包是指有权访问另一个函数作用域中的变量的函数。

## 作用
1. 保护变量不被外部污染（私有变量）
2. 让变量始终保持在内存中

## 缺点
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
