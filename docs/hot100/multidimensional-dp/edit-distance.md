# 编辑距离

## 题目描述

给你两个单词 `word1` 和 `word2`， 请返回将 `word1` 转换成 `word2` 所使用的最少操作数  。

你可以对一个单词进行如下三种操作：

1. 插入一个字符
2. 删除一个字符
3. 替换一个字符

**示例 1：**

```text
输入：word1 = "horse", word2 = "ros"
输出：3
解释：
horse -> rorse (将 'h' 替换为 'r')
rorse -> rose (删除 'r')
rose -> ros (删除 'e')
```

**示例 2：**

```text
输入：word1 = "intention", word2 = "execution"
输出：5
解释：
intention -> inention (删除 't')
inention -> enention (将 'i' 替换为 'e')
enention -> exention (将 'n' 替换为 'x')
exention -> exection (将 'n' 替换为 'c')
exection -> execution (插入 'u')
```

## 思路拆解

这也是一道经典的二维动态规划题目，是「最长公共子序列」的升级版。

### 动态规划
1. **定义状态**：`dp[i][j]` 表示将 `word1` 的前 `i` 个字符转换成 `word2` 的前 `j` 个字符所需要的最少操作数。
2. **状态转移方程**：
   - 比较 `word1[i-1]` 和 `word2[j-1]`：
     - 如果 `word1[i-1] === word2[j-1]`，不需要进行任何操作，操作数等于之前的状态：
       - `dp[i][j] = dp[i-1][j-1]`。
     - 如果 `word1[i-1] !== word2[j-1]`，我们可以进行三种操作，取最小值并加 1：
       - **插入**：相当于在 `word1` 的前 `i` 个字符后插入一个字符变成 `word2` 的前 `j` 个。这等价于将 `word1` 的前 `i` 个字符转换成 `word2` 的前 `j-1` 个字符，然后插入 `word2[j-1]`。即 `dp[i][j-1] + 1`。
       - **删除**：相当于删除 `word1` 的第 `i` 个字符，使其变成 `word2` 的前 `j` 个。这等价于将 `word1` 的前 `i-1` 个字符转换成 `word2` 的前 `j` 个字符。即 `dp[i-1][j] + 1`。
       - **替换**：相当于将 `word1` 的第 `i` 个字符替换成 `word2` 的第 `j` 个字符。即 `dp[i-1][j-1] + 1`。
       - 综上：`dp[i][j] = Math.min(dp[i][j-1], dp[i-1][j], dp[i-1][j-1]) + 1`。
3. **初始条件**：
   - `dp[0][j] = j`：空字符串变到长度 `j` 的字符串，需要插入 `j` 次。
   - `dp[i][0] = i`：长度 `i` 的字符串变到空字符串，需要删除 `i` 次。
4. **返回值**：
   - `dp[m][n]`。

## 代码实现

```javascript
/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
var minDistance = function(word1, word2) {
    const m = word1.length;
    const n = word2.length;
    const dp = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0));
    
    // 初始化第一行和第一列
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j],    // 删除
                    dp[i][j - 1],    // 插入
                    dp[i - 1][j - 1] // 替换
                ) + 1;
            }
        }
    }
    
    return dp[m][n];
};
```

## 运行演示

假设 `word1 = "horse", word2 = "ros"`：

1. 初始化：
   - `dp` 第一行：`0, 1, 2, 3`
   - `dp` 第一列：`0, 1, 2, 3, 4, 5`
2. `i = 1 ('h')`:
   - `j = 1 ('r')`: 不等 -> `min(dp[0][1], dp[1][0], dp[0][0]) + 1 = min(1, 1, 0) + 1 = 1` (替换 h->r)。
   - `j = 2 ('o')`: 不等 -> `min(dp[0][2], dp[1][1], dp[0][1]) + 1 = min(2, 1, 1) + 1 = 2`。
   - `j = 3 ('s')`: 不等 -> `3`。
3. `i = 2 ('o')`:
   - `j = 1 ('r')`: 不等 -> `2`。
   - `j = 2 ('o')`: 相等 -> `dp[1][1] = 1`。
   - `j = 3 ('s')`: 不等 -> `2`。
4. ...
5. 最终结果为 3。

## 复杂度分析

- **时间复杂度**：$O(m \times n)$，需要遍历 `dp` 数组。
- **空间复杂度**：$O(m \times n)$，需要二维数组。
