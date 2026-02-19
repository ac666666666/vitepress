# ES6 基础特性

[MDN JavaScript 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

## 1. let 和 const

- `let`：块级作用域，不存在变量提升，不允许重复声明。
- `const`：声明常量，必须初始化，值（内存地址）不可变。

### 暂时性死区 (TDZ)

在代码块内，使用 `let` 或 `const` 命令声明变量之前，该变量都是不可用的。这在语法上称为“暂时性死区”。

```javascript
if (true) {
  // TDZ 开始
  tmp = "abc"; // ReferenceError
  console.log(tmp); // ReferenceError

  let tmp; // TDZ 结束
  console.log(tmp); // undefined
}
```

## 2. 箭头函数

- 更简洁的语法。
- 没有自己的 `this`，继承外层作用域的 `this`。
- 不能作为构造函数。

## 3. 解构赋值

```javascript
const [a, b] = [1, 2];
const { name, age } = { name: "Alice", age: 20 };
```
