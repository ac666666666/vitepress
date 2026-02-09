# 电话号码的字母组合

## 1. 题目呈现

[LeetCode 17. Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/)

给定一个仅包含数字 `2-9` 的字符串，返回所有它能表示的字母组合。答案可以按 **任意顺序** 返回。

给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。

![phone_keyboard](https://assets.leetcode.com/uploads/2022/03/15/1200px-telephone-keypad2svg.png)

**示例 1：**

```
输入：digits = "23"
输出：["ad","ae","af","bd","be","bf","cd","ce","cf"]
```

**示例 2：**

```
输入：digits = ""
输出：[]
```

**示例 3：**

```
输入：digits = "2"
输出：["a","b","c"]
```

## 2. 思路拆解

这道题是组合问题的变种，我们可以将其看作是一个多叉树的遍历问题。

**核心思想**：
输入的数字字符串长度为 `n`，那么我们生成的每个字母组合的长度也必须是 `n`。
-   第 0 层节点选择 `digits[0]` 对应的字母。
-   第 1 层节点选择 `digits[1]` 对应的字母。
-   ...
-   第 `n-1` 层节点选择 `digits[n-1]` 对应的字母。

**回溯法框架**：
1.  **映射表**：首先需要建立一个数字到字母的映射表（Map 或 Object）。
2.  **递归函数 `backtrack(index, currentStr)`**：
    -   `index`：当前正在处理 `digits` 中的第几个数字。
    -   `currentStr`：当前已经生成的字母组合。
3.  **终止条件**：当 `index` 等于 `digits.length` 时，说明已经处理完所有数字，将 `currentStr` 加入结果集。
4.  **单层搜索逻辑**：
    -   取出当前数字 `digits[index]` 对应的字母集合。
    -   遍历该集合中的每一个字母。
    -   递归调用 `backtrack(index + 1, currentStr + letter)`。

## 3. 代码实现

```javascript
/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function(digits) {
    // 特殊情况处理：如果输入为空，返回空数组
    if (digits.length === 0) {
        return [];
    }
    
    // 数字到字母的映射
    const map = {
        '2': 'abc',
        '3': 'def',
        '4': 'ghi',
        '5': 'jkl',
        '6': 'mno',
        '7': 'pqrs',
        '8': 'tuv',
        '9': 'wxyz'
    };
    
    const res = [];
    
    // backtrack 函数
    // index: 当前处理到 digits 的第几位
    // currentStr: 当前已拼接的字符串
    const backtrack = (index, currentStr) => {
        // 终止条件：生成的字符串长度等于 digits 的长度
        if (index === digits.length) {
            res.push(currentStr);
            return;
        }
        
        // 取出当前数字对应的字母字符串
        const digit = digits[index];
        const letters = map[digit];
        
        // 遍历可选的字母
        for (const letter of letters) {
            // 递归进入下一层
            // 这里利用了字符串的不可变性，currentStr + letter 会生成新字符串传入下一层
            // 相当于隐式地进行了"回溯"（不需要显式 pop）
            backtrack(index + 1, currentStr + letter);
        }
    };
    
    backtrack(0, "");
    return res;
};
```

## 4. 运行结果

```javascript
console.log(letterCombinations("23"));
// 输出: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
```

## 5. 复杂度分析

-   **时间复杂度**：$O(3^m \times 4^n)$。
    -   其中 $m$ 是对应 3 个字母的数字个数（如 2, 3, 4, 5, 6, 8），$n$ 是对应 4 个字母的数字个数（如 7, 9）。
    -   总的组合数是每一位可选字母数量的乘积。
-   **空间复杂度**：$O(m + n)$。
    -   递归调用栈的深度为输入数字的长度，即 $m + n$。
    -   不考虑结果集 `res` 占用的空间。
