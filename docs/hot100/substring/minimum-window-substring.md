# 最小覆盖子串

[LeetCode 官方题目链接](https://leetcode.cn/problems/minimum-window-substring/)

## 1. 题目呈现

**难度等级**：🔴 困难  
**核心考察点**：哈希表、字符串、滑动窗口

给你一个字符串 `s` 、一个字符串 `t` 。返回 `s` 中涵盖 `t` 所有字符的最小子串。如果 `s` 中不存在涵盖 `t` 所有字符的子串，则返回空字符串 `""` 。

> **示例 1：**
>
> **输入**：s = "ADOBECODEBANC", t = "ABC"  
> **输出**："BANC"  
> **解释**：最小覆盖子串 "BANC" 包含来自字符串 t 的 'A'、'B' 和 'C'。

> **示例 2：**
>
> **输入**：s = "a", t = "a"  
> **输出**："a"

> **示例 3：**
>
> **输入**：s = "a", t = "aa"  
> **输出**：""  
> **解释**：t 中两个 'a' 是不同的，但 s 中只有一个。所以没有符合条件的子串。

---

## 2. 解题思路拆解

### 方法：滑动窗口

我们需要在 `s` 中找到一个最短的窗口，使得这个窗口包含了 `t` 中的所有字符（包括重复字符）。

1.  **统计需求**：首先用一个哈希表（或数组）`need` 统计 `t` 中每个字符出现的次数。
2.  **维护窗口**：
    *   使用 `left` 和 `right` 指针维护一个窗口。
    *   使用另一个哈希表 `window` 统计当前窗口内字符的出现次数。
    *   使用一个变量 `valid` 记录当前窗口中**已经满足数量要求**的字符种类数。
3.  **扩张窗口**：
    *   移动 `right`，将字符加入窗口。
    *   如果该字符是 `t` 需要的，且窗口内的数量达到了 `t` 的要求，则 `valid` 加 1。
4.  **收缩窗口**：
    *   当 `valid` 等于 `need` 中字符的种类数时，说明当前窗口已经覆盖了 `t`。
    *   尝试移动 `left` 收缩窗口，更新最小覆盖子串的长度和起始位置。
    *   在移出字符时，如果导致该字符数量不再满足 `t` 的要求，`valid` 减 1，循环结束。

---

## 3. 代码实现

```javascript
/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function(s, t) {
    // 统计 t 中每个字符的需求量
    const need = new Map();
    for (const char of t) {
        need.set(char, (need.get(char) || 0) + 1);
    }
    
    const window = new Map();
    let left = 0, right = 0;
    let valid = 0; // 满足需求的字符种类数
    
    // 记录最小覆盖子串的起始索引和长度
    let start = 0, len = Infinity;
    
    while (right < s.length) {
        // c 是将移入窗口的字符
        const c = s[right];
        right++;
        
        // 进行窗口内数据的一系列更新
        if (need.has(c)) {
            window.set(c, (window.get(c) || 0) + 1);
            if (window.get(c) === need.get(c)) {
                valid++;
            }
        }
        
        // 判断左侧窗口是否要收缩
        while (valid === need.size) {
            // 在这里更新最小覆盖子串
            if (right - left < len) {
                start = left;
                len = right - left;
            }
            
            // d 是将移出窗口的字符
            const d = s[left];
            left++;
            
            // 进行窗口内数据的一系列更新
            if (need.has(d)) {
                if (window.get(d) === need.get(d)) {
                    valid--;
                }
                window.set(d, window.get(d) - 1);
            }
        }
    }
    
    return len === Infinity ? "" : s.substr(start, len);
};
```

#### 代码执行演示
输入 `s = "ADOBECODEBANC", t = "ABC"`
`need = {A:1, B:1, C:1}`, `size=3`

1.  **扩张**：`right` 一直右移，直到遇到 'C' (index 5)。
    *   此时窗口 "ADOBEC"，`window` 中 A,B,C 都有 1 个。
    *   `valid = 3`，满足条件。
2.  **收缩**：`valid === 3`，开始 `while` 循环。
    *   记录当前解 "ADOBEC"，长度 6。
    *   `left` 右移：移除 'A'。
    *   `window` 中 'A' 变 0，不满足 `need`。`valid` 变 2。退出内层循环。
3.  **继续扩张**：寻找下一个 'A'。
    *   ...直到遇到 'A' (index 10)。窗口 "...CODEBA"。
    *   `valid` 再次变 3。
4.  **再次收缩**：
    *   更新解，如果比 6 小。
    *   `left` 持续右移，直到破坏条件。
    *   最终找到 "BANC"，长度 4。

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(|S| + |T|)$。`right` 指针遍历一次 `s`，`left` 指针也最多遍历一次 `s`。 |
| **空间复杂度** | $O(|\Sigma|)$。`need` 和 `window` 哈希表的大小不会超过字符集大小（如 128）。 |
