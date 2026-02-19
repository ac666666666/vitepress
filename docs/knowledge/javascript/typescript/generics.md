# 泛型 (Generics)

[TypeScript 官方文档](https://www.typescriptlang.org/zh/)

在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

```typescript
function identity<T>(arg: T): T {
  return arg;
}

let output = identity<string>("myString");
```
