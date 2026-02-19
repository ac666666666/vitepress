# 多数元素

[LeetCode 官方题目链接](https://leetcode.cn/problems/majority-element/)

## 题目描述

给定一个大小为 `n` 的数组 `nums` ，返回其中的多数元素。多数元素是指在数组中出现次数 **大于** `⌊ n/2 ⌋` 的元素。

你可以假设数组是非空的，并且给定的数组总是存在多数元素。

**示例 1：**

```text
输入：nums = [3,2,3]
输出：3
```

**示例 2：**

```text
输入：nums = [2,2,1,1,1,2,2]
输出：2
```

**进阶**：尝试设计时间复杂度为 $O(n)$、空间复杂度为 $O(1)$ 的算法解决此问题。

## 思路拆解

如果使用哈希表统计频率，空间复杂度是 $O(n)$。如果要达到 $O(1)$ 空间复杂度，可以使用 **摩尔投票法 (Boyer-Moore Voting Algorithm)**。

### 摩尔投票法
核心思想是：**对拼消耗**。
1. 维护一个候选人 `candidate` 和一个计数器 `count`。
2. 遍历数组：
   - 如果 `count` 为 0，说明之前的都抵消完了，当前的数字作为新的 `candidate`，`count` 设为 1。
   - 如果当前的数字等于 `candidate`，`count` 加 1。
   - 如果当前的数字不等于 `candidate`，`count` 减 1（相当于一个非多数元素和一个多数元素抵消）。
3. 因为多数元素的数量大于 `n/2`，所以最后剩下的 `candidate` 一定是多数元素。

## 代码实现

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums) {
    let candidate = null;
    let count = 0;

    for (const num of nums) {
        if (count === 0) {
            candidate = num;
            count = 1;
        } else if (num === candidate) {
            count++;
        } else {
            count--;
        }
    }

    return candidate;
};
```

## 运行演示

假设 `nums = [2, 2, 1, 1, 1, 2, 2]`：

1. `i=0 (2)`: `count=0` -> `candidate=2`, `count=1`
2. `i=1 (2)`: `2==2` -> `count=2`
3. `i=2 (1)`: `1!=2` -> `count=1`
4. `i=3 (1)`: `1!=2` -> `count=0` (抵消完了)
5. `i=4 (1)`: `count=0` -> `candidate=1`, `count=1`
6. `i=5 (2)`: `2!=1` -> `count=0` (抵消完了)
7. `i=6 (2)`: `count=0` -> `candidate=2`, `count=1`

最终返回 2。

## 复杂度分析

- **时间复杂度**：$O(n)$，遍历一次数组。
- **空间复杂度**：$O(1)$，只使用了常数个变量。
