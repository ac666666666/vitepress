# 原型与原型链详解

[MDN JavaScript 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

JavaScript 是一门基于**原型 (Prototype)** 的语言，这与基于**类 (Class)** 的语言（如 Java、C++）有很大不同。

## 1. 核心概念

### 1.1 `prototype` (显式原型)
- **只有函数 (Function)** 才有 `prototype` 属性。
- 它是构造函数的一个属性，指向一个对象（即原型对象）。
- 这个对象包含了可以由该构造函数的所有实例**共享**的属性和方法。

### 1.2 `__proto__` (隐式原型)
- **所有对象** (除了 `Object.create(null)`) 都有 `__proto__` 属性。
- 它指向创建该对象的构造函数的 `prototype`。
- **作用**：构成原型链的关键。当访问一个对象的属性时，如果对象本身没有，就会去 `__proto__` 指向的对象里找。

### 1.3 `constructor` (构造器)
- 原型对象默认有一个 `constructor` 属性，指向关联的构造函数。
- `Person.prototype.constructor === Person`

---

## 2. 经典三角关系图解

```javascript
function Person() {}
const p = new Person();
```

它们的关系如下：

1.  **构造函数 -> 原型**：`Person.prototype`
2.  **原型 -> 构造函数**：`Person.prototype.constructor === Person`
3.  **实例 -> 原型**：`p.__proto__ === Person.prototype`
4.  **实例 -> 构造函数**：`p.constructor === Person` (通过原型链找到的)

---

## 3. 原型链 (Prototype Chain)

当访问一个对象的属性时，JavaScript 引擎的查找过程：
1.  先查找对象**自身**是否有该属性。
2.  如果没有，就去对象的 `__proto__` (即构造函数的 `prototype`) 中查找。
3.  如果还没有，就去原型的 `__proto__` (即 `Object.prototype`) 中查找。
4.  如果一直查找到 `Object.prototype.__proto__` (即 `null`) 还没找到，则返回 `undefined`。

这条由 `__proto__` 串起来的链条，就是**原型链**。

### 示例代码

```javascript
function Animal() {
  this.type = '动物';
}
Animal.prototype.eat = function() {
  console.log('吃东西');
};

const cat = new Animal();
cat.name = '喵喵';

// 1. 访问自身属性
console.log(cat.name); // '喵喵'

// 2. 访问原型属性 (自身没有，去 __proto__ 找)
console.log(cat.type); // '动物' (来自 Animal 实例，这里稍微特殊，因为是 new Animal)
cat.eat(); // '吃东西' (来自 Animal.prototype)

// 3. 访问顶层原型属性
console.log(cat.toString()); // '[object Object]' (来自 Object.prototype)

// 4. 访问不存在的属性
console.log(cat.fly); // undefined (找完了整条链都没找到)
```

---

## 4. 在线演示：原型链可视化

点击下方按钮，切换不同类型的对象，直观查看其原型链结构。

<PrototypeChainDemo />

---

## 5. 面试高频考点

### 5.1 `instanceof` 原理
检查**右边构造函数的 `prototype`** 是否出现在**左边实例的原型链**上。

```javascript
function myInstanceOf(left, right) {
  let proto = Object.getPrototypeOf(left); // 获取对象的原型
  const prototype = right.prototype; // 获取构造函数的原型

  while (true) {
    if (!proto) return false; // 查到了尽头 null
    if (proto === prototype) return true; // 找到了
    proto = Object.getPrototypeOf(proto); // 继续向上查找
  }
}
```

### 5.2 `new` 操作符原理
1.  创建一个新对象。
2.  将新对象的 `__proto__` 指向构造函数的 `prototype`。
3.  执行构造函数，将 `this` 绑定到新对象。
4.  如果构造函数返回了一个对象，则返回该对象；否则返回新对象。

```javascript
function myNew(Constructor, ...args) {
  // 1. 创建新对象，并链接原型
  const obj = Object.create(Constructor.prototype);
  // 2. 执行构造函数
  const result = Constructor.apply(obj, args);
  // 3. 返回结果 (如果构造函数返回了引用类型，就用它；否则用新对象)
  return result instanceof Object ? result : obj;
}
```

### 5.3 继承方式 (ES5 vs ES6)

#### ES5: 寄生组合式继承 (最佳实践)
解决父类构造函数被调用两次的问题。

```javascript
function Parent(name) {
  this.name = name;
}
Parent.prototype.say = function() { console.log(this.name); }

function Child(name, age) {
  Parent.call(this, name); // 1. 借用构造函数继承属性
  this.age = age;
}

// 2. 寄生式继承方法
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child; // 修正 constructor

const c = new Child('Tom', 18);
```

#### ES6: `class` 与 `extends`
语法糖，底层依然是原型继承。

```javascript
class Parent {
  constructor(name) {
    this.name = name;
  }
  say() { console.log(this.name); }
}

class Child extends Parent {
  constructor(name, age) {
    super(name); // 必须先调用 super
    this.age = age;
  }
}
```

### 5.4 Object.create(null)
创建一个**没有原型**的对象。通常用作纯净的字典/Map，防止原型链上的属性干扰（如 `toString`, `hasOwnProperty`）。

```javascript
const normalObj = {};
console.log(normalObj.toString); // function toString() { ... }

const nullObj = Object.create(null);
console.log(nullObj.toString); // undefined
```
