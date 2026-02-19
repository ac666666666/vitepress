# 接口 (Interface)

[TypeScript 官方文档](https://www.typescriptlang.org/zh/)

用于定义对象的形状。

```typescript
interface Person {
  name: string;
  age?: number; // 可选属性
  readonly id: number; // 只读属性
}

const user: Person = {
  name: "Alice",
  id: 1
};
```
