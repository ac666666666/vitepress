# 划分字母区间

[LeetCode 官方题目链接](https://leetcode.cn/problems/partition-labels/)

## 题目描述

给你一个字符串 `s` 。我们要把这个字符串划分为尽可能多的片段，同一字母最多出现在一个片段中。

注意，划分结果需要满足：将所有划分结果按顺序连接，得到的字符串仍然是 `s` 。

返回一个表示每个字符串片段的长度的列表。

**示例 1：**

```text
输入：s = "ababcbacadefegdehijhklij"
输出：[9,7,8]
解释：
划分结果为 "ababcbaca", "defegde", "hijhklij"。
每个字母最多出现在一个片段中。
像 "ababcbacadefegde", "hijhklij" 这样的划分是错误的，因为划分的片段数较少。
```

**示例 2：**

```text
输入：s = "eccbbbbdec"
输出：[10]
```

## 思路拆解

题目要求同一个字母最多出现在一个片段中，这意味着：如果一个片段包含字母 'a'，那么字符串中所有的 'a' 都必须在这个片段中。

### 贪心策略
1. **预处理**：首先遍历一遍字符串，记录每个字母最后出现的位置。
2. **扫描与更新**：
   - 维护当前片段的开始下标 `start` 和结束下标 `end`。
   - 遍历字符串，对于当前字符 `c`，更新 `end = Math.max(end, last[c])`。这意味着当前片段至少要延伸到 `c` 最后出现的位置。
   - 如果当前遍历到的下标 `i` 等于 `end`，说明当前片段已经包含了所有涉及到的字母的最后出现位置，可以进行切割。
   - 将当前片段长度 `end - start + 1` 加入结果，并更新 `start = i + 1`，开始下一个片段。

## 代码实现

```javascript
/**
 * @param {string} s
 * @return {number[]}
 */
var partitionLabels = function(s) {
    const last = new Array(26).fill(0);
    const codePointA = 'a'.codePointAt(0);

    // 1. 记录每个字符最后出现的位置
    for (let i = 0; i < s.length; i++) {
        last[s.codePointAt(i) - codePointA] = i;
    }

    const partition = [];
    let start = 0;
    let end = 0;

    // 2. 遍历字符串，找到切割点
    for (let i = 0; i < s.length; i++) {
        end = Math.max(end, last[s.codePointAt(i) - codePointA]);
        
        // 如果当前位置是当前片段的结束位置
        if (i === end) {
            partition.push(end - start + 1);
            start = i + 1;
        }
    }

    return partition;
};
```

## 运行演示

假设 `s = "ababcbacadefegdehijhklij"`

1. **预处理**：
   - 'a': 8, 'b': 5, 'c': 7, 'd': 14, 'e': 15, 'f': 11, ...

2. **扫描**：
   - `i = 0 ('a')`: `end = max(0, 8) = 8`
   - `i = 1 ('b')`: `end = max(8, 5) = 8`
   - ...
   - `i = 8 ('a')`: `end` 依然是 8。此时 `i == end`。
   - **切割**：长度 `8 - 0 + 1 = 9`。`start` 更新为 9。

   - `i = 9 ('d')`: `end = max(0, 14) = 14`
   - ...
   - `i = 15 ('e')`: `end` 是 15。此时 `i == end`。
   - **切割**：长度 `15 - 9 + 1 = 7`。`start` 更新为 16。

   - ... 直到结束。

## 复杂度分析

- **时间复杂度**：$O(n)$，其中 $n$ 是字符串长度。我们需要遍历两次字符串（一次记录最后位置，一次寻找切割点）。
- **空间复杂度**：$O(1)$。虽然我们开辟了 `last` 数组，但它的大小固定为 26，与输入规模无关。
