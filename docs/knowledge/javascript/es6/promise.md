# Promise

[MDN JavaScript 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

异步编程的解决方案，解决了回调地狱问题。

- 三种状态：Pending, Fulfilled, Rejected。
- 方法：`then`, `catch`, `finally`, `all`, `race`.

```javascript
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
  }, 1000);
});

p.then((res) => {
  console.log(res);
});
```

## 常见面试题

### forEach 中使用 async/await

`forEach` 不支持异步等待。它会直接同步执行完所有回调，不会等待内部的 `await`。
如果需要顺序执行异步操作，请使用 `for...of` 循环。

```javascript
// 错误示例：无法等待
list.forEach(async (item) => {
  await doSomething(item);
});

// 正确示例
for (const item of list) {
  await doSomething(item);
}
```

### Promise 异常穿透

如果在 Promise 链中没有 `catch` 捕获错误，错误会一直向后传递，直到被捕获或抛出全局错误。
