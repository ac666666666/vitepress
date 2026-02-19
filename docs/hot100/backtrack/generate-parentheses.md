# 括号生成

[LeetCode 官方题目链接](https://leetcode.cn/problems/generate-parentheses/)

## 1. 题目呈现

[LeetCode 22. Generate Parentheses](https://leetcode.com/problems/generate-parentheses/)

数字 `n` 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 **有效的** 括号组合。

**示例 1：**

```
输入：n = 3
输出：["((()))","(()())","(())()","()(())","()()()"]
```

**示例 2：**

```
输入：n = 1
输出：["()"]
```

## 2. 思路拆解

**括号生成** 是一道非常经典的回溯题目，它考察了如何通过限制条件来生成合法的组合。

**核心思想**：
我们要生成 $2n$ 个字符的字符串，每个位置只能放 `(` 或 `)`。
为了保证生成的括号组合是 **有效的**，我们需要遵守以下规则：
1.  **左括号数量限制**：左括号的总数量不能超过 $n$。
2.  **右括号数量限制**：任何时候，已经放入的右括号数量不能超过已经放入的左括号数量（否则会出现 `)(` 这种非法情况）。

**回溯法框架**：
1.  **状态**：我们需要跟踪当前已经放入的左括号数量 `left` 和右括号数量 `right`，以及当前生成的字符串 `str`。
2.  **选择**：
    -   如果 `left < n`，我们可以放一个左括号 `(`。
    -   如果 `right < left`，我们可以放一个右括号 `)`。
3.  **终止条件**：当生成的字符串长度达到 $2n$ 时，说明我们完成了一个合法的组合，将其加入结果集。

## 3. 代码实现

```javascript
/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
    const res = [];
    
    // backtrack 函数
    // left: 当前已使用的左括号数量
    // right: 当前已使用的右括号数量
    // str: 当前已生成的字符串
    const backtrack = (left, right, str) => {
        // 终止条件：字符串长度达到 2n
        if (str.length === 2 * n) {
            res.push(str);
            return;
        }
        
        // 尝试添加左括号
        // 只要左括号数量小于 n，就可以添加
        if (left < n) {
            backtrack(left + 1, right, str + '(');
        }
        
        // 尝试添加右括号
        // 只有在右括号数量小于左括号数量时，才可以添加（保证合法性）
        if (right < left) {
            backtrack(left, right + 1, str + ')');
        }
    };
    
    backtrack(0, 0, '');
    return res;
};
```

## 4. 运行结果

```javascript
console.log(generateParenthesis(3));
// 输出: ["((()))","(()())","(())()","()(())","()()()"]

console.log(generateParenthesis(1));
// 输出: ["()"]
```

## 5. 复杂度分析

-   **时间复杂度**：$O(\frac{4^n}{\sqrt{n}})$。
    -   这是一个卡特兰数（Catalan Number）问题。生成的有效括号组合数量是第 $n$ 个卡特兰数 $\frac{1}{n+1}\binom{2n}{n}$。
    -   其渐进时间复杂度为 $O(\frac{4^n}{\sqrt{n}})$。
-   **空间复杂度**：$O(n)$。
    -   递归调用栈的深度为 $2n$，即 $O(n)$。
    -   我们需要存储结果集，但这通常不计入算法的空间复杂度。
