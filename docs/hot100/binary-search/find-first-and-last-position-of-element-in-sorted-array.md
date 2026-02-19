# 34. 在排序数组中查找元素的第一个和最后一个位置

[LeetCode 官方题目链接](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/)

[题目链接](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/)

## 题目描述

**难度**：中等

给你一个按照非递减顺序排列的整数数组 `nums`，和一个目标值 `target`。请你找出给定目标值在数组中的开始位置和结束位置。

如果数组中不存在目标值 `target`，返回 `[-1, -1]`。

你必须设计并实现时间复杂度为 $O(\log n)$ 的算法解决此问题。

**示例 1：**

```
输入：nums = [5,7,7,8,8,10], target = 8
输出：[3,4]
```

**示例 2：**

```
输入：nums = [5,7,7,8,8,10], target = 6
输出：[-1,-1]
```

**示例 3：**

```
输入：nums = [], target = 0
输出：[-1,-1]
```

**提示：**

*   `0 <= nums.length <= 10^5`
*   `-10^9 <= nums[i] <= 10^9`
*   `nums` 是一个非递减数组
*   `-10^9 <= target <= 10^9`

## 思路拆解

题目要求 $O(\log n)$ 时间复杂度，显然需要使用二分查找。
我们需要找到 `target` 在数组中的**左边界**和**右边界**。

可以分别进行两次二分查找：
1.  **查找左边界（First Position）**：
    *   找到第一个大于等于 `target` 的位置。
    *   如果该位置存在且等于 `target`，则为左边界。
2.  **查找右边界（Last Position）**：
    *   找到第一个大于 `target` 的位置，然后减 1。
    *   或者直接查找最后一个等于 `target` 的位置。

通常我们可以实现一个通用的二分查找函数 `binarySearch(nums, target, lower)`：
*   如果 `lower` 为 `true`，查找第一个**大于等于** `target` 的下标。
*   如果 `lower` 为 `false`，查找第一个**大于** `target` 的下标。

这样：
*   左边界 `start` = `binarySearch(nums, target, true)`。
*   右边界 `end` = `binarySearch(nums, target, false) - 1`。

最后校验 `start` 和 `end` 是否合法：
*   `start <= end` 且 `nums[start] === target`，则返回 `[start, end]`。
*   否则返回 `[-1, -1]`。

**二分查找细节**：
*   `left = 0`, `right = n - 1`，结果初始化为 `n`（假设所有元素都小于 target）。
*   当 `left <= right`：
    *   `mid = (left + right) >> 1`。
    *   如果 `nums[mid] > target`，说明目标位置肯定在左边，`right = mid - 1`，并记录 `ans = mid`。
    *   如果 `nums[mid] < target`，说明目标位置肯定在右边，`left = mid + 1`。
    *   如果 `nums[mid] == target`：
        *   找左边界（`lower=true`）：我们需要继续往左找，看有没有更前的，所以 `right = mid - 1`，记录 `ans = mid`。
        *   找右边界（实际是找第一个大于）：我们需要往右找（但此处逻辑统一为找第一个大于等于 target 或者第一个大于 target）。

**更清晰的逻辑**：
直接写两个函数或者一个带参数的函数。
*   `findLeft`: 找 `>= target` 的第一个位置。
*   `findRight`: 找 `> target` 的第一个位置，然后下标减一。

## 代码实现

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function(nums, target) {
    const leftIdx = binarySearch(nums, target, true);
    const rightIdx = binarySearch(nums, target, false) - 1;
    
    if (leftIdx <= rightIdx && rightIdx < nums.length && nums[leftIdx] === target && nums[rightIdx] === target) {
        return [leftIdx, rightIdx];
    }
    
    return [-1, -1];
};

// lower = true: 查找第一个 >= target 的下标
// lower = false: 查找第一个 > target 的下标
const binarySearch = (nums, target, lower) => {
    let left = 0;
    let right = nums.length - 1;
    let ans = nums.length;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] > target || (lower && nums[mid] >= target)) {
            // 如果 nums[mid] > target，肯定要往左找
            // 如果 lower 为 true 且 nums[mid] == target，也要往左找以逼近第一个
            right = mid - 1;
            ans = mid;
        } else {
            // nums[mid] < target
            // 或者 lower 为 false 且 nums[mid] == target (我们要找 > target 的，所以要往右找)
            left = mid + 1;
        }
    }
    return ans;
}
```

## 运行演示

`nums = [5,7,7,8,8,10], target = 8`

1.  **查找左边界 (`lower = true`)**:
    *   `l=0, r=5, ans=6`
    *   `mid=2 (7) < 8`: `l=3`
    *   `mid=4 (8) >= 8`: `r=3, ans=4` (记录 4，继续往左找)
    *   `mid=3 (8) >= 8`: `r=2, ans=3` (记录 3，继续往左找)
    *   `mid=2`: `l` 已经是 3，`l > r`，循环结束。
    *   返回 `3`。

2.  **查找右边界 (`lower = false`)**: 找第一个 `> 8` 的位置
    *   `l=0, r=5, ans=6`
    *   `mid=2 (7) <= 8`: `l=3`
    *   `mid=4 (8) <= 8`: `l=5`
    *   `mid=5 (10) > 8`: `r=4, ans=5` (记录 5，继续往左找看有没有更小的 > 8 的)
    *   循环结束。
    *   返回 `5`。
    *   最终右边界下标 = `5 - 1 = 4`。

3.  **校验**:
    *   `leftIdx = 3`, `rightIdx = 4`。
    *   `3 <= 4` 且 `nums[3] == 8`。
    *   返回 `[3, 4]`。

## 复杂度分析

*   **时间复杂度**：$O(\log n)$，执行了两次二分查找。
*   **空间复杂度**：$O(1)$。
