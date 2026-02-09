# 单词拆分

## 题目描述

给你一个字符串 `s` 和一个字符串列表 `wordDict` 作为字典。请你判断是否可以利用字典中出现的单词拼接出 `s` 。

**注意：**不要求字典中出现的单词全部都使用，并且字典中的单词可以重复使用。

**示例 1：**

```text
输入: s = "leetcode", wordDict = ["leet", "code"]
输出: true
解释: 返回 true 因为 "leetcode" 可以由 "leet" 和 "code" 拼接成。
```

**示例 2：**

```text
输入: s = "applepenapple", wordDict = ["apple", "pen"]
输出: true
解释: 返回 true 因为 "applepenapple" 可以由 "apple" "pen" "apple" 拼接成。
     注意，你可以重复使用字典中的单词。
```

**示例 3：**

```text
输入: s = "catsandog", wordDict = ["cats", "dog", "sand", "and", "cat"]
输出: false
```

## 思路拆解

这也是一道完全背包问题的变种，或者说是分割类型的问题。

### 动态规划
1. **定义状态**：`dp[i]` 表示字符串 `s` 的前 `i` 个字符（`s[0...i-1]`）是否能被空格拆分为字典中的单词。
2. **状态转移方程**：
   - 对于每个位置 `i`，我们需要枚举分割点 `j`（`0 <= j < i`）。
   - 如果 `dp[j]` 为 `true`（即前 `j` 个字符可以被拆分），且 `s[j...i-1]` 这个子串存在于 `wordDict` 中，那么 `dp[i]` 也就为 `true`。
   - 转移方程：`dp[i] = dp[j] && wordDict.includes(s.substring(j, i))`。
3. **初始条件**：
   - `dp[0] = true`（空串可以被视作合法的）。
4. **返回值**：
   - `dp[s.length]`。

## 代码实现

```javascript
/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function(s, wordDict) {
    const wordSet = new Set(wordDict); // 转换为 Set 加速查询
    const dp = new Array(s.length + 1).fill(false);
    dp[0] = true;

    for (let i = 1; i <= s.length; i++) {
        for (let j = 0; j < i; j++) {
            // 如果前 j 个字符可以拆分，且 j 到 i 的子串也在字典中
            if (dp[j] && wordSet.has(s.substring(j, i))) {
                dp[i] = true;
                break; // 只要找到一种分割方式即可
            }
        }
    }

    return dp[s.length];
};
```

## 运行演示

假设 `s = "leetcode"`, `wordDict = ["leet", "code"]`：

1. `wordSet = {"leet", "code"}`
2. `dp = [true, false, ..., false]`
3. `i = 1...3`: 找不到 `s[0...i]` 在字典里，`dp[1...3] = false`
4. `i = 4`:
   - `j = 0`: `dp[0] = true`, `s[0...4] = "leet"` 在字典里 -> `dp[4] = true`
5. `i = 5`: `dp[5] = false` (无法从前面任何一个 true 的点跳过来)
6. ...
7. `i = 8`:
   - `j = 0`: `dp[0]=true`, `s[0...8]="leetcode"` (no)
   - `j = 4`: `dp[4]=true`, `s[4...8]="code"` (yes) -> `dp[8] = true`

返回 `true`。

## 复杂度分析

- **时间复杂度**：$O(n^2)$，其中 $n$ 是字符串长度。外层循环 $n$ 次，内层循环 $n$ 次，子串查询和切片操作也耗时（虽然 JS 引擎有优化，但最坏情况仍需考虑）。
- **空间复杂度**：$O(n)$，需要 `dp` 数组。
