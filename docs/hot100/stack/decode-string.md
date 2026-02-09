# 字符串解码

## 1. 题目呈现

[LeetCode 链接](https://leetcode.cn/problems/decode-string/)

给定一个经过编码的字符串，返回它解码后的字符串。

编码规则为: `k[encoded_string]`，表示其中方括号内部的 `encoded_string` 正好重复 `k` 次。注意 `k` 保证为正整数。

你可以认为输入字符串总是有效的；输入字符串中没有额外的空格，且输入的方括号总是符合格式要求的。

此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 `k` ，例如不会出现像 `3a` 或 `2[4]` 的输入。

**示例 1：**
```text
输入：s = "3[a]2[bc]"
输出："aaabcbc"
```

**示例 2：**
```text
输入：s = "3[a2[c]]"
输出："accaccacc"
```

**示例 3：**
```text
输入：s = "2[abc]3[cd]ef"
输出："abcabccdcdcdef"
```

**示例 4：**
```text
输入：s = "abc3[cd]xyz"
输出："abccdcdcdxyz"
```

## 2. 思路拆解

这道题存在嵌套的结构（例如 `3[a2[c]]`），非常适合使用 **栈** 来处理。

1.  **辅助栈**：我们需要两个栈，或者一个栈存储对象。
    *   `numStack`: 存储数字（重复次数 `k`）。
    *   `strStack`: 存储字符串（当前已经解码的部分）。
2.  **遍历字符串**：
    *   如果遇到 **数字**：解析出完整的数字（可能是多位数），存入 `numStack`。
    *   如果遇到 **左括号 `[`**：
        *   将当前已经解码的字符串 `res` 推入 `strStack`。
        *   将 `res` 重置为空，准备记录新的括号内的字符串。
        *   （数字已经入栈了，等待匹配的右括号来使用）。
    *   如果遇到 **右括号 `]`**：
        *   取出 `numStack` 栈顶的数字 `repeatTimes`。
        *   取出 `strStack` 栈顶的字符串 `lastRes`（这是括号外面的前缀）。
        *   将当前括号内的字符串 `res` 重复 `repeatTimes` 次，并拼接到 `lastRes` 后面。
        *   更新 `res` 为拼接后的结果。
    *   如果遇到 **普通字符**：
        *   直接拼接到当前字符串 `res` 后面。

## 3. 代码实现

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var decodeString = function(s) {
    let numStack = [];
    let strStack = [];
    let num = 0;
    let res = "";

    for (let char of s) {
        if (!isNaN(char)) {
            // 如果是数字，可能是多位数
            num = num * 10 + Number(char);
        } else if (char === '[') {
            // 遇到 [，将当前的 num 和 res 入栈
            numStack.push(num);
            strStack.push(res);
            // 重置 num 和 res
            num = 0;
            res = "";
        } else if (char === ']') {
            // 遇到 ]，出栈
            let repeatTimes = numStack.pop();
            let lastRes = strStack.pop();
            // 构建新的 res：外层字符串 + 内层字符串 * 次数
            res = lastRes + res.repeat(repeatTimes);
        } else {
            // 遇到普通字符，追加到 res
            res += char;
        }
    }

    return res;
};
```

## 4. 运行 Demo

```javascript
console.log(decodeString("3[a]2[bc]")); // "aaabcbc"
console.log(decodeString("3[a2[c]]")); // "accaccacc"
console.log(decodeString("2[abc]3[cd]ef")); // "abcabccdcdcdef"
```

## 5. 复杂度分析

-   **时间复杂度**：$O(S)$，其中 $S$ 是解码后字符串的长度。因为我们需要构造出最终的字符串，每个字符都会被访问和拼接。
-   **空间复杂度**：$O(S)$，最坏情况下（例如嵌套层数很深），栈的深度可能与 $S$ 相关，且需要存储生成的字符串。
