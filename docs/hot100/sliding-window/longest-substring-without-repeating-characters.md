# 无重复字符的最长子串

[LeetCode 官方题目链接](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)

## 1. 题目呈现

**难度等级**：🟡 中等  
**核心考察点**：哈希表、字符串、滑动窗口

给定一个字符串 `s` ，请你找出其中不含有重复字符的 **最长子串** 的长度。

> **示例 1：**
>
> **输入**：s = "abcabcbb"  
> **输出**：3  
> **解释**：因为无重复字符的最长子串是 "abc"，所以其长度为 3。

> **示例 2：**
>
> **输入**：s = "bbbbb"  
> **输出**：1  
> **解释**：因为无重复字符的最长子串是 "b"，所以其长度为 1。

> **示例 3：**
>
> **输入**：s = "pwwkew"  
> **输出**：3  
> **解释**：因为无重复字符的最长子串是 "wke"，所以其长度为 3。  
> 请注意，你的答案必须是 **子串** 的长度，"pwke" 是一个*子序列*，不是子串。

---

## 2. 解题思路拆解

### 方法：滑动窗口

我们需要维护一个窗口 `[left, right]`，保证这个窗口内的所有字符都是**不重复**的。

1.  **定义窗口**：使用双指针 `left` 和 `right`，初始都指向 0。
2.  **扩张窗口**：
    *   移动 `right` 指针，将字符 `s[right]` 加入窗口。
    *   使用一个哈希集合 `Set` 或者哈希表 `Map` 来记录窗口内出现过的字符。
3.  **收缩窗口**：
    *   如果 `s[right]` 已经在窗口中存在（即在 `Set` 中），说明出现了重复。
    *   此时需要移动 `left` 指针，不断将 `s[left]` 移出窗口，直到窗口内不再包含重复的 `s[right]` 为止。
4.  **更新答案**：
    *   在每次窗口调整为“无重复”状态后，更新最大长度 `maxLen = max(maxLen, right - left + 1)`。

---

## 3. 代码实现

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    let left = 0;
    let maxLen = 0;
    const set = new Set();
    
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        
        // 如果窗口内已经有这个字符，左指针右移，直到移除该字符
        while (set.has(char)) {
            set.delete(s[left]);
            left++;
        }
        
        // 将当前字符加入窗口
        set.add(char);
        
        // 更新最大长度
        maxLen = Math.max(maxLen, right - left + 1);
    }
    
    return maxLen;
};
```

#### 优化版（使用 Map 跳跃移动）
上面的解法中，`left` 是一步步移动的。如果我们知道重复字符上一次出现的位置，可以直接把 `left` 跳到那个位置的下一位。

```javascript
var lengthOfLongestSubstring = function(s) {
    let left = 0;
    let maxLen = 0;
    // Map 记录字符上一次出现的索引
    const map = new Map();
    
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        
        if (map.has(char)) {
            // 如果字符出现过，left 需要跳到重复字符的下一位
            // 注意：left 只能向右移动，不能回头（比如 "abba"，处理第二个 a 时，left 已经在 2 了，不能回到 1）
            left = Math.max(left, map.get(char) + 1);
        }
        
        // 更新当前字符的最新索引
        map.set(char, right);
        
        // 更新最大长度
        maxLen = Math.max(maxLen, right - left + 1);
    }
    
    return maxLen;
};
```

#### 代码执行演示 (Map版)
输入 `s = "abcabcbb"`

1.  `R=0 ('a')`：Map无'a'。Map={'a':0}。`Len = 1`。
2.  `R=1 ('b')`：Map无'b'。Map={'a':0, 'b':1}。`Len = 2`。
3.  `R=2 ('c')`：Map无'c'。Map={'a':0, 'b':1, 'c':2}。`Len = 3`。
4.  `R=3 ('a')`：Map有'a'(idx=0)。`L` 跳到 `0+1=1`。Map更新{'a':3...}。`Len = 3-1+1 = 3`。
5.  `R=4 ('b')`：Map有'b'(idx=1)。`L` 跳到 `1+1=2`。Map更新{'b':4...}。`Len = 4-2+1 = 3`。
6.  `R=5 ('c')`：Map有'c'(idx=2)。`L` 跳到 `2+1=3`。Map更新{'c':5...}。`Len = 5-3+1 = 3`。
7.  `R=6 ('b')`：Map有'b'(idx=4)。`L` 跳到 `4+1=5`。Map更新{'b':6...}。`Len = 6-5+1 = 2`。
8.  ...

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(n)$。`Set` 版左右指针各遍历一次；`Map` 版右指针遍历一次。 |
| **空间复杂度** | $O(|\Sigma|)$。其中 $|\Sigma|$ 是字符集的大小（如 ASCII 为 128）。 |
