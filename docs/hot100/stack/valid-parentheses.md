# 有效的括号

[LeetCode 官方题目链接](https://leetcode.cn/problems/valid-parentheses/)

## 1. 题目呈现

[LeetCode 链接](https://leetcode.cn/problems/valid-parentheses/)

给定一个只包括 `'('`，`')'`，`'{'`，`'}'`，`'['`，`']'` 的字符串 `s` ，判断字符串是否有效。

有效字符串需满足：
1. 左括号必须用相同类型的右括号闭合。
2. 左括号必须以正确的顺序闭合。
3. 每个右括号都有一个对应的相同类型的左括号。

**示例 1：**
```text
输入：s = "()"
输出：true
```

**示例 2：**
```text
输入：s = "()[]{}"
输出：true
```

**示例 3：**
```text
输入：s = "(]"
输出：false
```

## 2. 思路拆解

这道题是栈（Stack）的经典应用场景。

1.  **数据结构选择**：由于需要匹配最近的左括号，即“后进先出”的特性，因此使用栈最合适。
2.  **遍历过程**：
    *   遍历字符串中的每个字符。
    *   如果是左括号（`(`、`{`、`[`），将其推入栈中。
    *   如果是右括号（`)`、`}`、`]`），检查栈顶元素是否是对应的左括号：
        *   如果栈为空，说明右括号多余，无效。
        *   如果栈顶元素不匹配，说明括号顺序错误或类型不匹配，无效。
        *   如果匹配，将栈顶元素弹出。
3.  **最终判断**：遍历结束后，如果栈为空，说明所有左括号都已闭合，字符串有效；否则无效。

为了方便匹配，我们可以使用一个哈希表（Map）来存储右括号到左括号的映射关系。

## 3. 代码实现

```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    const stack = [];
    const map = {
        ')': '(',
        ']': '[',
        '}': '{'
    };

    for (let char of s) {
        if (char === '(' || char === '[' || char === '{') {
            // 如果是左括号，入栈
            stack.push(char);
        } else {
            // 如果是右括号
            // 检查栈是否为空，或者栈顶元素是否与当前右括号匹配
            if (stack.length === 0 || stack[stack.length - 1] !== map[char]) {
                return false;
            }
            // 匹配成功，弹出栈顶元素
            stack.pop();
        }
    }

    // 遍历结束后，栈必须为空才算有效
    return stack.length === 0;
};
```

## 4. 运行 Demo

```javascript
const s1 = "()[]{}";
console.log(isValid(s1)); // true

const s2 = "(]";
console.log(isValid(s2)); // false

const s3 = "([)]";
console.log(isValid(s3)); // false

const s4 = "{[]}";
console.log(isValid(s4)); // true
```

## 5. 复杂度分析

-   **时间复杂度**：$O(n)$，其中 $n$ 是字符串的长度。我们只需要遍历一次字符串。
-   **空间复杂度**：$O(n)$，最坏情况下（例如全是左括号），栈的大小为 $n$。
