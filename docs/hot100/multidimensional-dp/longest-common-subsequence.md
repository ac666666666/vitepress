# 最长公共子序列

[LeetCode 官方题目链接](https://leetcode.cn/problems/longest-common-subsequence/)

## 题目描述

给定两个字符串 `text1` 和 `text2`，返回这两个字符串的 **最长公共子序列** 的长度。如果不存在 公共子序列 ，返回 0 。

一个字符串的 **子序列** 是指这样一个新的字符串：它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。
例如，`"ace"` 是 `"abcde"` 的子序列，但 `"aec"` 不是 `"abcde"` 的子序列。

两个字符串的 **公共子序列** 是这两个字符串所共同拥有的子序列。

**示例 1：**

```text
输入：text1 = "abcde", text2 = "ace" 
输出：3  
解释：最长公共子序列是 "ace" ，它的长度为 3 。
```

**示例 2：**

```text
输入：text1 = "abc", text2 = "abc"
输出：3
解释：最长公共子序列是 "abc" ，它的长度为 3 。
```

**示例 3：**

```text
输入：text1 = "abc", text2 = "def"
输出：0
解释：两个字符串没有公共子序列，返回 0 。
```

## 思路拆解

这是一道经典的二维动态规划题目。

### 动态规划
1. **定义状态**：`dp[i][j]` 表示 `text1` 的前 `i` 个字符和 `text2` 的前 `j` 个字符的最长公共子序列的长度。
2. **状态转移方程**：
   - 比较 `text1[i-1]` 和 `text2[j-1]`（注意 `dp` 索引从 1 开始，对应字符串索引要减 1）：
     - 如果 `text1[i-1] === text2[j-1]`，说明找到了一个公共字符。
       - `dp[i][j] = dp[i-1][j-1] + 1`。
     - 如果 `text1[i-1] !== text2[j-1]`，说明这两个字符不同时属于公共子序列，我们需要继承之前的最大值。
       - `dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1])`。
3. **初始条件**：
   - `dp[0][...]` 和 `dp[...][0]` 均为 0（空字符串与任何字符串的公共子序列长度为 0）。
4. **返回值**：
   - `dp[m][n]`，其中 `m` 和 `n` 分别是两个字符串的长度。

## 代码实现

```javascript
/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
var longestCommonSubsequence = function(text1, text2) {
    const m = text1.length;
    const n = text2.length;
    const dp = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[m][n];
};
```

## 运行演示

假设 `text1 = "abcde"`, `text2 = "ace"`：

1. 初始化 `dp` 全 0。
2. `i = 1 ('a')`:
   - `j = 1 ('a')`: 相等 -> `dp[1][1] = dp[0][0] + 1 = 1`。
   - `j = 2 ('c')`: 不等 -> `max(dp[0][2], dp[1][1]) = 1`。
   - `j = 3 ('e')`: 不等 -> `max(dp[0][3], dp[1][2]) = 1`。
3. `i = 2 ('b')`:
   - `j = 1 ('a')`: 不等 -> `max(dp[1][1], dp[2][0]) = 1`。
   - ...
4. `i = 3 ('c')`:
   - ...
   - `j = 2 ('c')`: 相等 -> `dp[3][2] = dp[2][1] + 1 = 1 + 1 = 2`。
   - ...
5. `i = 5 ('e')`:
   - ...
   - `j = 3 ('e')`: 相等 -> `dp[5][3] = dp[4][2] + 1 = 2 + 1 = 3`。

返回 `3`。

## 复杂度分析

- **时间复杂度**：$O(m \times n)$，需要遍历 `dp` 数组。
- **空间复杂度**：$O(m \times n)$，需要二维数组（可以优化到 $O(\min(m, n))$）。
