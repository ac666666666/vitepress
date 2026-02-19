# 35. 搜索插入位置

[LeetCode 官方题目链接](https://leetcode.cn/problems/search-insert-position/)

[题目链接](https://leetcode.cn/problems/search-insert-position/)

## 题目描述

**难度**：简单

给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。

请必须使用时间复杂度为 $O(\log n)$ 的算法。

**示例 1:**

```
输入: nums = [1,3,5,6], target = 5
输出: 2
```

**示例 2:**

```
输入: nums = [1,3,5,6], target = 2
输出: 1
```

**示例 3:**

```
输入: nums = [1,3,5,6], target = 7
输出: 4
```

**提示:**

*   `1 <= nums.length <= 10^4`
*   `-10^4 <= nums[i] <= 10^4`
*   `nums` 为 **无重复元素** 的 **升序** 排列数组
*   `-10^4 <= target <= 10^4`

## 思路拆解

题目要求时间复杂度为 $O(\log n)$，且数组是排序的，这是典型的二分查找应用场景。

我们需要找到第一个大于等于 `target` 的元素的下标。
- 如果数组中存在 `target`，二分查找会找到它。
- 如果数组中不存在 `target`，二分查找最终结束时，`left` 指针所在的位置就是第一个大于 `target` 的元素的位置，也就是插入位置。

**二分查找过程**：
1.  初始化左指针 `left = 0`，右指针 `right = nums.length - 1`。
2.  当 `left <= right` 时循环：
    *   计算中间位置 `mid = Math.floor((left + right) / 2)`。
    *   如果 `nums[mid] === target`，直接返回 `mid`。
    *   如果 `nums[mid] < target`，说明目标在右侧，更新 `left = mid + 1`。
    *   如果 `nums[mid] > target`，说明目标在左侧，更新 `right = mid - 1`。
3.  循环结束后，`left` 就是插入位置。
    *   例如 `[1,3,5,6]`, target `2`。
    *   l=0, r=3, mid=1 (3) > 2, r=0
    *   l=0, r=0, mid=0 (1) < 2, l=1
    *   loop ends. return 1. Correct.

## 代码实现

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
    let left = 0;
    let right = nums.length - 1;

    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        
        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return left;
};
```

## 运行演示

**示例 2：** `nums = [1,3,5,6], target = 2`

1.  初始化：`left = 0`, `right = 3`。
2.  **第一轮循环**：
    *   `mid = 0 + (3 - 0) / 2 = 1`。
    *   `nums[1]` 是 3。
    *   `3 > 2`，`target` 在左侧。
    *   更新 `right = mid - 1 = 0`。
3.  **第二轮循环**：
    *   `left = 0`, `right = 0`，满足 `left <= right`。
    *   `mid = 0 + (0 - 0) / 2 = 0`。
    *   `nums[0]` 是 1。
    *   `1 < 2`，`target` 在右侧。
    *   更新 `left = mid + 1 = 1`。
4.  **循环结束**：
    *   `left = 1`, `right = 0`，不满足 `left <= right`。
    *   退出循环。
5.  返回 `left`，即 `1`。

## 复杂度分析

*   **时间复杂度**：$O(\log n)$，二分查找每次将搜索范围缩小一半。
*   **空间复杂度**：$O(1)$，只使用了常数个变量。
