# 分割回文串

## 1. 题目呈现

[LeetCode 131. Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning/)

给你一个字符串 `s`，请你将 `s` 分割成一些子串，使每个子串都是 **回文串** 。返回 `s` 所有可能的分割方案。

**回文串** 是指正着读和反着读都一样的字符串。

**示例 1：**

```
输入：s = "aab"
输出：[["a","a","b"],["aa","b"]]
```

**示例 2：**

```
输入：s = "a"
输出：[["a"]]
```

## 2. 思路拆解

这也是一道经典的组合类题目，要求找出所有的分割方案。

**核心思想**：
我们需要在字符串的不同位置进行切割，判断切割出来的子串是否是回文串。如果是，则继续对剩下的部分进行切割。

**回溯法框架**：
1.  **切割点**：我们从字符串的起始位置 `start` 开始，尝试在 `start` 后面的每一个位置 `i` 进行切割。切割出来的子串是 `s[start...i]`。
2.  **合法性检查**：判断子串 `s[start...i]` 是否是回文串。
    -   如果**是**回文串，则将其加入当前路径 `path`，并递归处理剩余字符串（从 `i + 1` 开始）。
    -   如果**不是**回文串，则说明这种切割方式不可行，直接跳过（剪枝）。
3.  **终止条件**：当起始位置 `start` 等于字符串长度 `s.length` 时，说明已经切割到了字符串末尾，且之前的每一次切割都是合法的回文串，因此将当前 `path` 加入结果集。

**优化**：
判断回文串通常需要 $O(N)$ 的时间。我们可以通过动态规划预处理出一个二维数组 `dp[i][j]`，表示子串 `s[i...j]` 是否为回文串，从而将判断回文的时间优化到 $O(1)$。

## 3. 代码实现

这里展示朴素判断回文串的方法，代码更简洁易懂。

```javascript
/**
 * @param {string} s
 * @return {string[][]}
 */
var partition = function(s) {
    const res = [];
    
    // 辅助函数：判断字符串是否是回文串
    const isPalindrome = (l, r) => {
        while (l < r) {
            if (s[l] !== s[r]) {
                return false;
            }
            l++;
            r--;
        }
        return true;
    };
    
    // backtrack 函数
    // start: 当前切割的起始位置
    // path: 当前已收集的回文子串列表
    const backtrack = (start, path) => {
        // 终止条件：切割到了字符串末尾
        if (start === s.length) {
            res.push([...path]);
            return;
        }
        
        // 遍历所有可能的切割结束位置
        for (let i = start; i < s.length; i++) {
            // 判断 s[start...i] 是否是回文串
            if (isPalindrome(start, i)) {
                // 如果是，加入 path
                const sub = s.substring(start, i + 1);
                path.push(sub);
                
                // 递归处理剩余部分
                backtrack(i + 1, path);
                
                // 回溯
                path.pop();
            }
        }
    };
    
    backtrack(0, []);
    return res;
};
```

## 4. 运行结果

```javascript
console.log(partition("aab"));
// 输出: [["a","a","b"],["aa","b"]]

console.log(partition("a"));
// 输出: [["a"]]
```

## 5. 复杂度分析

-   **时间复杂度**：$O(N \cdot 2^N)$。
    -   最坏情况下（例如全是相同字符 "aaaa"），分割方案有 $2^{N-1}$ 种。
    -   对于每种方案，我们需要 $O(N)$ 的时间来构造解（字符串切片和复制）。
    -   判断回文串的时间在朴素解法中累积起来也是指数级的，但通过 DP 优化可以降下来，不过总的时间复杂度主要由解的数量决定。
-   **空间复杂度**：$O(N)$。
    -   递归调用栈的深度最大为 $N$。
    -   `path` 数组的大小最大为 $N$。
