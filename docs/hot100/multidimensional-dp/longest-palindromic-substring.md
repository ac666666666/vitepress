# 最长回文子串

## 题目描述

给你一个字符串 `s`，找到 `s` 中最长的回文子串。

如果字符串的反序与原始字符串相同，则该字符串称为回文字符串。

**示例 1：**

```text
输入：s = "babad"
输出："bab"
解释："aba" 同样是符合题意的答案。
```

**示例 2：**

```text
输入：s = "cbbd"
输出："bb"
```

## 思路拆解

这道题有多种解法，最经典的是 **动态规划** 和 **中心扩展法**。

### 方法一：动态规划
1. **定义状态**：`dp[i][j]` 表示字符串 `s` 从下标 `i` 到 `j` 的子串是否是回文串。
2. **状态转移方程**：
   - 如果 `s[i] === s[j]`：
     - 如果子串长度小于等于 2（即 `j - i < 3`），比如 `aa` 或 `aba`，直接是回文，`dp[i][j] = true`。
     - 否则，取决于去掉首尾后的子串是否是回文，即 `dp[i][j] = dp[i+1][j-1]`。
   - 如果 `s[i] !== s[j]`，则 `dp[i][j] = false`。
3. **遍历顺序**：
   - 因为 `dp[i][j]` 依赖于 `dp[i+1][j-1]`（左下角），所以需要 **从下到上**（`i` 递减），**从左到右**（`j` 递增）遍历。
4. **返回值**：
   - 记录最长的回文子串的起始位置和长度。

### 方法二：中心扩展法（推荐）
- 回文串一定是对称的。我们可以枚举回文串的 **中心**，然后向两边扩展。
- 中心有两种情况：
  - 一个字符（如 `aba` 的中心是 `b`）。
  - 两个字符（如 `abba` 的中心是 `bb`）。
- 我们遍历字符串，对每个位置都尝试作为中心（包括单字符中心和双字符中心），记录最长的回文串。
- 这种方法空间复杂度更低，为 $O(1)$。

## 代码实现（中心扩展法）

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    if (s.length < 2) return s;
    
    let start = 0;
    let maxLength = 1;
    
    function expandAroundCenter(left, right) {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            if (right - left + 1 > maxLength) {
                start = left;
                maxLength = right - left + 1;
            }
            left--;
            right++;
        }
    }
    
    for (let i = 0; i < s.length; i++) {
        // 情况 1：单字符中心 (aba)
        expandAroundCenter(i, i);
        // 情况 2：双字符中心 (abba)
        expandAroundCenter(i, i + 1);
    }
    
    return s.substring(start, start + maxLength);
};
```

## 运行演示

假设 `s = "babad"`：

1. `i = 0 ('b')`:
   - 单中心 `b`: `left=0, right=0` -> 匹配 -> 扩展失败。 `maxLen=1`。
   - 双中心 `ba`: `left=0, right=1` -> 不匹配。
2. `i = 1 ('a')`:
   - 单中心 `a`: `left=1, right=1` -> 匹配 -> 扩展 `b...b` -> 匹配 -> 扩展失败。 `maxLen=3` ("bab")。
   - 双中心 `ab`: 不匹配。
3. `i = 2 ('b')`:
   - 单中心 `b`: `left=2, right=2` -> 匹配 -> 扩展 `a...a` -> 匹配 -> 扩展 `b...d` -> 不匹配。 `maxLen=3` ("aba")。如果不更新起始位置，还是 "bab"。
   - 双中心 `ba`: 不匹配。
...

最终返回 "bab" 或 "aba"。

## 复杂度分析

- **时间复杂度**：$O(n^2)$，每个位置扩展一次。
- **空间复杂度**：$O(1)$，只使用了常数个变量。
