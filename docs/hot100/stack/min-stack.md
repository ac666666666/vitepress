# 最小栈

[LeetCode 官方题目链接](https://leetcode.cn/problems/min-stack/)

## 1. 题目呈现

[LeetCode 链接](https://leetcode.cn/problems/min-stack/)

设计一个支持 `push` ，`pop` ，`top` 操作，并能在常数时间内检索到最小元素的栈。

实现 `MinStack` 类:
*   `MinStack()` 初始化堆栈对象。
*   `void push(int val)` 将元素 `val` 推入堆栈。
*   `void pop()` 删除堆栈顶部的元素。
*   `int top()` 获取堆栈顶部的元素。
*   `int getMin()` 获取堆栈中的最小元素。

**示例 1：**
```text
输入：
["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]

输出：
[null,null,null,null,-3,null,0,-2]

解释：
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin();   --> 返回 -3.
minStack.pop();
minStack.top();      --> 返回 0.
minStack.getMin();   --> 返回 -2.
```

## 2. 思路拆解

我们需要在常数时间 $O(1)$ 内获取最小元素。普通的栈只能在 $O(1)$ 时间内获取栈顶元素，如果要求最小元素，通常需要 $O(n)$ 时间遍历。

为了满足 $O(1)$ 的要求，我们可以使用 **辅助栈** 的思想：
1.  **数据栈 (`stack`)**：用于存储所有元素，保证正常的 `push`、`pop`、`top` 操作。
2.  **辅助栈 (`min_stack`)**：用于存储当前的最小值。
    *   当一个元素入栈时，如果它小于等于辅助栈的栈顶元素（或者辅助栈为空），则将该元素也推入辅助栈。这样，辅助栈的栈顶永远是当前数据栈中的最小值。
    *   当一个元素出栈时，如果它等于辅助栈的栈顶元素，则将辅助栈的栈顶元素也弹出。

这样，`getMin()` 操作只需要返回辅助栈的栈顶元素即可，时间复杂度为 $O(1)$。

## 3. 代码实现

```javascript
var MinStack = function() {
    this.stack = [];
    this.min_stack = [];
};

/** 
 * @param {number} val
 * @return {void}
 */
MinStack.prototype.push = function(val) {
    this.stack.push(val);
    // 如果辅助栈为空，或者新元素小于等于辅助栈栈顶，则推入辅助栈
    if (this.min_stack.length === 0 || val <= this.min_stack[this.min_stack.length - 1]) {
        this.min_stack.push(val);
    }
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function() {
    // 如果弹出的元素等于辅助栈栈顶，则辅助栈也要弹出
    if (this.stack.pop() === this.min_stack[this.min_stack.length - 1]) {
        this.min_stack.pop();
    }
};

/**
 * @return {number}
 */
MinStack.prototype.top = function() {
    return this.stack[this.stack.length - 1];
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function() {
    return this.min_stack[this.min_stack.length - 1];
};
```

## 4. 运行 Demo

```javascript
const minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
console.log(minStack.getMin()); // -3
minStack.pop();
console.log(minStack.top());    // 0
console.log(minStack.getMin()); // -2
```

## 5. 复杂度分析

-   **时间复杂度**：
    -   `push`：$O(1)$
    -   `pop`：$O(1)$
    -   `top`：$O(1)$
    -   `getMin`：$O(1)$
-   **空间复杂度**：$O(n)$，其中 $n$ 是总操作数。我们需要额外的辅助栈来存储最小值。
