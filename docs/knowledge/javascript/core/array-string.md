# 数组与字符串方法

[MDN JavaScript 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

<ArrayMethodsDemo />

## 1. Array 方法详解

### 1.1 改变原数组的方法 (Mutator Methods)

这 7 个方法会直接修改调用它们的数组，**不会**创建新数组。Vue 2.x 正是通过重写这 7 个方法来实现数组响应式的。

| 方法 | 描述 | 返回值 | 示例 |
| :--- | :--- | :--- | :--- |
| `push` | 向数组末尾添加一个或多个元素 | 新数组的长度 | `arr.push(1) // [..., 1]` |
| `pop` | 删除数组最后一个元素 | 被删除的元素 | `arr.pop() // 删除末尾` |
| `shift` | 删除数组第一个元素 | 被删除的元素 | `arr.shift() // 删除头部` |
| `unshift` | 向数组开头添加一个或多个元素 | 新数组的长度 | `arr.unshift(0) // [0, ...]` |
| `splice` | 添加或删除数组中的元素 | 被删除元素组成的数组 | `arr.splice(1, 1) // 删除索引1` |
| `sort` | 对数组元素进行排序 | 排序后的数组引用 | `arr.sort((a,b)=>a-b)` |
| `reverse` | 颠倒数组中元素的顺序 | 颠倒后的数组引用 | `arr.reverse()` |

### 1.2 不改变原数组的方法 (Accessor/Iteration Methods)

这些方法**不会**修改原数组，而是返回一个新的数组或值。在 React 或 Vue 中，为了保持数据的不可变性 (Immutability)，通常推荐使用这些方法。

| 方法 | 描述 | 返回值 | 示例 |
| :--- | :--- | :--- | :--- |
| `concat` | 合并两个或多个数组 | 新数组 | `[1].concat([2]) // [1,2]` |
| `slice` | 截取数组的一部分 | 新数组 | `arr.slice(1, 3)` |
| `join` | 将数组所有元素连接成字符串 | 字符串 | `arr.join('-')` |
| `map` | 创建新数组，其结果是调用函数的返回值 | 新数组 | `arr.map(x=>x*2)` |
| `filter` | 创建新数组，包含所有通过测试的元素 | 新数组 | `arr.filter(x=>x>10)` |
| `reduce` | 对数组中的每个元素执行 reducer 函数 | 单个值 | `arr.reduce((a,b)=>a+b)` |
| `forEach` | 对数组的每个元素执行一次给定的函数 | `undefined` | `arr.forEach(x=>console.log(x))` |
| `find` | 返回数组中满足提供的测试函数的第一个元素的值 | 元素值 / undefined | `arr.find(x=>x>10)` |
| `some` | 测试数组中是不是至少有1个元素通过了被提供的函数测试 | Boolean | `arr.some(x=>x>10)` |
| `every` | 测试一个数组内的所有元素是否都能通过某个指定函数的测试 | Boolean | `arr.every(x=>x>10)` |

### 1.3 map 和 forEach 的详细对比

| 特性 | `map` | `forEach` |
| :--- | :--- | :--- |
| **返回值** | 返回一个**新数组** | 返回 `undefined` |
| **原数组** | 不改变 (除非在回调中手动修改) | 不改变 (除非在回调中手动修改) |
| **链式调用** | 支持 (`.map().filter()...`) | 不支持 |
| **用途** | 映射，数据转换 (1对1) | 遍历，执行副作用 (如打印日志) |
| **中断** | 不可中断 | 不可中断 (除非抛出异常) |

```javascript
// 场景：将数组中的对象 id 提取出来
const users = [{id: 1, name: 'A'}, {id: 2, name: 'B'}];

// 推荐：使用 map
const ids = users.map(u => u.id); // [1, 2]

// 不推荐：使用 forEach
const ids2 = [];
users.forEach(u => ids2.push(u.id)); // 需要维护外部变量
```

### 1.4 reduce 的高级用法

`reduce` 是数组中最强大的方法，可以实现 map, filter, 去重, 扁平化等所有功能。

**基本语法**: `arr.reduce(callback(accumulator, currentValue, index, array), initialValue)`

1.  **数组求和**:
    ```javascript
    const sum = [1, 2, 3].reduce((acc, cur) => acc + cur, 0); // 6
    ```

2.  **二维数组扁平化**:
    ```javascript
    const matrix = [[1, 2], [3, 4], [5, 6]];
    const flat = matrix.reduce((acc, cur) => acc.concat(cur), []); // [1, 2, 3, 4, 5, 6]
    ```

3.  **计算元素出现次数**:
    ```javascript
    const names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice'];
    const countedNames = names.reduce((allNames, name) => {
      if (name in allNames) {
        allNames[name]++;
      } else {
        allNames[name] = 1;
      }
      return allNames;
    }, {});
    // { 'Alice': 2, 'Bob': 1, 'Tiff': 1, 'Bruce': 1 }
    ```

### 1.5 Array.sort 实现原理

`Array.prototype.sort` 是一个**原地算法** (In-place algorithm)，它会改变原数组。

*   **V8 引擎实现**:
    *   **长度 <= 10**: 使用**插入排序** (Insertion Sort)。因为在小数据量下，插入排序常数因子小，效率极高。
    *   **长度 > 10**: 使用**快速排序** (Quick Sort) 的变体 (TimSort)。
        *   早期的 V8 使用快速排序（不稳定）。
        *   **现在的 V8 (Chrome 70+)** 使用 **TimSort** 算法（**稳定排序**）。TimSort 是一种混合排序算法，结合了合并排序 (Merge Sort) 和插入排序 (Insertion Sort)。

*   **稳定性**:
    *   **稳定排序**: 如果 `a` 原本在 `b` 前面，且 `a == b`，排序后 `a` 仍然在 `b` 前面。
    *   **不稳定排序**: 排序后 `a` 可能会跑到 `b` 后面。
    *   **现状**: 现代浏览器 (Chrome, Firefox, Safari) 的 `sort` 均已实现为**稳定排序**。

## 2. 类数组 (Array-like Object)

类数组对象是一个对象，它拥有：
1.  `length` 属性。
2.  若干索引属性 (`0`, `1`, `2`...)。
3.  **但是**它没有数组的原型方法 (如 push, forEach)。

**常见类数组**:
*   `arguments` 对象 (函数参数)
*   DOM `NodeList` (如 `document.querySelectorAll('div')` 返回的结果)

**如何转换为真数组**:

```javascript
// 1. Array.from (ES6 推荐)
const arr1 = Array.from(arguments);

// 2. 扩展运算符 (ES6 推荐，仅适用于可迭代对象)
const arr2 = [...arguments];

// 3. slice (ES5 兼容写法)
const arr3 = Array.prototype.slice.call(arguments);
```

## 3. 字符串 (String) 常用方法

字符串在 JavaScript 中是**不可变**的 (Immutable)。所有字符串方法都会返回一个新的字符串，而不会修改原字符串。

| 方法 | 描述 | 示例 |
| :--- | :--- | :--- |
| `charAt(index)` | 返回指定位置的字符 | `'abc'.charAt(1) // 'b'` |
| `includes(str)` | 判断是否包含子串 | `'hello'.includes('ell') // true'` |
| `startsWith(str)` | 判断是否以子串开头 | `'hello'.startsWith('he') // true'` |
| `endsWith(str)` | 判断是否以子串结尾 | `'hello'.endsWith('lo') // true'` |
| `slice(start, end)` | 提取字符串的一部分 | `'hello'.slice(1, 3) // 'el'` |
| `substring(start, end)`| 提取字符串的一部分 (不接受负数) | `'hello'.substring(1, 3) // 'el'` |
| `split(separator)` | 将字符串分割成数组 | `'a-b-c'.split('-') // ['a','b','c']` |
| `trim()` | 去除两端空格 | `'  abc  '.trim() // 'abc'` |
| `replace(search, repl)`| 替换子串 (默认只替换第一个) | `'aba'.replace('a', 'c') // 'cba'` |
| `replaceAll(search, repl)`| 替换所有子串 (ES2021) | `'aba'.replaceAll('a', 'c') // 'cbc'` |

## 4. Object 常用静态方法

| 方法 | 描述 | 示例 |
| :--- | :--- | :--- |
| `Object.keys(obj)` | 返回对象自身可枚举属性名的数组 | `Object.keys({a:1}) // ['a']` |
| `Object.values(obj)` | 返回对象自身可枚举属性值的数组 | `Object.values({a:1}) // [1]` |
| `Object.entries(obj)` | 返回 `[key, value]` 键值对数组 | `Object.entries({a:1}) // [['a', 1]]` |
| `Object.assign(target, ...sources)` | 将源对象属性复制到目标对象 (浅拷贝) | `Object.assign({}, {a:1})` |
| `Object.create(proto)` | 使用指定的原型创建新对象 | `Object.create(null)` |
| `Object.freeze(obj)` | 冻结对象 (不可修改、不可添加、不可删除) | `Object.freeze(obj)` |
| `Object.is(v1, v2)` | 判断两个值是否相同 (比 `===` 更严格) | `Object.is(NaN, NaN) // true` |
