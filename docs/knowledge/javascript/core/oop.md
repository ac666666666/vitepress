# 面向对象编程 (OOP) 与继承

[MDN JavaScript 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

## 1. 继承的实现方式

JavaScript 中的继承主要经历了从“原型链继承”到“寄生组合式继承”，再到 ES6 `class` 语法糖的演变过程。

### 1.1 原型链继承 (Prototype Chain Inheritance)

最原始的继承方式，直接将子类的原型指向父类的**实例**。

```javascript
function Parent() {
  this.names = ["kevin", "daisy"];
}

function Child() {}

Child.prototype = new Parent(); // 核心：子类原型指向父类实例

const child1 = new Child();
child1.names.push("yayu");
console.log(child1.names); // ["kevin", "daisy", "yayu"]

const child2 = new Child();
console.log(child2.names); // ["kevin", "daisy", "yayu"] (被 child1 修改了！)
```

#### 为什么会有这两个缺点？

1.  **关于引用共享**：
    - 因为 `Child.prototype` 是 `Parent` 的一个实例（`new Parent()` 只有一次）。
    - `names` 属性存在于 `Child.prototype` 上，而不是每个 `Child` 实例上。
    - 所有 `Child` 实例的 `__proto__` 都指向同一个对象（`Child.prototype`），所以它们共享同一个 `names` 数组。
    - 当 `child1` 修改数组时，实际上是修改了原型上的那个数组，所以 `child2` 看到的也是修改后的。

2.  **关于无法传参**：
    - `Child.prototype = new Parent()` 这行代码是在**定义 Child 类**的时候执行的，只执行一次。
    - 当我们后来调用 `new Child('Tom')` 时，无法把 `'Tom'` 这个参数传递给那个**早已执行完毕**的 `new Parent()`。
    - 即使你写成 `Child.prototype = new Parent('name')`，那也只能给所有子类实例一个固定的名字，无法根据每个实例定制。

### 1.2 构造函数继承 (Constructor Inheritance)

为了解决引用共享问题，在子类构造函数中调用父类构造函数。

```javascript
function Parent(name) {
  this.name = name;
}

function Child(name) {
  Parent.call(this, name); // 核心：借用构造函数
}

const child1 = new Child("kevin");
const child2 = new Child("daisy");
```

- **优点**：解决了引用共享问题；可以传参。
- **缺点**：方法都在构造函数中定义，每次创建实例都要重新创建方法，**无法复用**。而且无法继承父类原型上的方法。

### 1.3 组合继承 (Combination Inheritance)

结合了上述两者的优点：用原型链继承方法，用构造函数继承属性。

```javascript
function Parent(name) {
  this.name = name;
  this.colors = ["red", "blue"];
}
Parent.prototype.getName = function () {
  console.log(this.name);
};

function Child(name, age) {
  Parent.call(this, name); // 第二次调用 Parent()
  this.age = age;
}
Child.prototype = new Parent(); // 第一次调用 Parent()
Child.prototype.constructor = Child;
```

- **优点**：融合了优点，是 ES5 中常用的继承模式。
- **缺点**：调用了**两次**父类构造函数，造成性能浪费。

### 1.4 寄生组合式继承 (Parasitic Combination Inheritance) - **ES5 最佳实践**

只调用一次父类构造函数，并且避免了在 `Child.prototype` 上创建不必要的、多余的属性。

```javascript
function Parent(name) {
  this.name = name;
  this.colors = ["red", "blue"];
}
Parent.prototype.getName = function () {
  console.log(this.name);
};

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

// 核心：不直接调用父类构造函数，而是创建一个空对象作为桥梁
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child; // 修复 constructor 指向

const child1 = new Child("kevin", "18");
```

### 1.5 ES6 Class 继承 (现代标准)

ES6 提供了 `class` 和 `extends` 关键字，语法更清晰，但底层依然是基于原型的。

```javascript
class Parent {
  constructor(name) {
    this.name = name;
  }
  sayHello() {
    console.log("Hello, " + this.name);
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name); // 必须在 this 之前调用 super()
    this.age = age;
  }
}
```

- **区别**：
  1.  ES5 的继承，实质是先创造子类的实例对象 `this`，然后再将父类的方法添加到 `this` 上面（`Parent.apply(this)`）。
  2.  ES6 的继承，实质是先将父类实例对象的属性和方法，加到 `this` 上面（所以必须先调用 `super` 方法），然后再用子类的构造函数修改 `this`。

## 2. 在线演示：继承方式对比

点击下方按钮，切换**原型链继承**和**类继承**，观察修改引用类型属性时的不同表现。

<InheritanceDemo />

## 3. `new` 操作符原理

`new` 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。

**执行过程**：

1.  **创建一个新对象**：`const obj = {}`
2.  **链接原型**：`obj.__proto__ = Constructor.prototype`
3.  **绑定 this**：`Constructor.apply(obj, arguments)`，执行构造函数代码，为这个新对象添加属性。
4.  **返回对象**：如果构造函数返回了一个对象，则返回该对象；否则返回创建的新对象。

## 4. `new` vs `Object.create`

| 特性         | `new Constructor()`                       | `Object.create(proto)`                     |
| :----------- | :---------------------------------------- | :----------------------------------------- |
| **作用**     | 创建构造函数的实例                        | 创建一个新对象，并将该对象设为新对象的原型 |
| **原型链**   | `obj.__proto__ === Constructor.prototype` | `obj.__proto__ === proto`                  |
| **构造函数** | **会执行**构造函数代码                    | **不会执行**任何构造函数代码               |
| **用途**     | 创建类的实例                              | 用于纯粹的对象继承 (如寄生组合继承)        |

## 5. 面试高频考点

### 5.1 ES5 和 ES6 继承的区别？

- **语法**：ES6 使用 `class/extends`，ES5 使用函数和原型操作。
- **this 创建时机**：ES5 先创建子类实例 `this` 再加父类属性；ES6 先创建父类实例 `this` (通过 `super`) 再修饰。
- **静态方法**：ES6 子类可以直接通过类名继承父类的静态方法，ES5 需要手动拷贝。

### 5.2 为什么 `super()` 必须在 `this` 之前调用？

因为 ES6 的继承机制是先将父类的属性和方法加到 `this` 上，如果不调用 `super()`，子类就没有 `this`，访问 `this` 会报错。

### 5.3 手写 `Object.create`

```javascript
function create(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
}
```
