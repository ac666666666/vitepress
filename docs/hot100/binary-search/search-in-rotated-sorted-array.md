# 33. 搜索旋转排序数组

[LeetCode 官方题目链接](https://leetcode.cn/problems/search-in-rotated-sorted-array/)

[题目链接](https://leetcode.cn/problems/search-in-rotated-sorted-array/)

## 题目描述

**难度**：中等

整数数组 `nums` 按升序排列，数组中的值 **互不相同** 。

在传递给函数之前，`nums` 在预先未知的某个下标 `k`（`0 <= k < nums.length`）上进行了 **旋转**，使数组变为 `[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]`（下标 **从 0 开始** 计数）。例如， `[0,1,2,4,5,6,7]` 在下标 `3` 处经旋转后可能变为 `[4,5,6,7,0,1,2]` 。

给你 **旋转后** 的数组 `nums` 和一个整数 `target` ，如果 `nums` 中存在这个目标值 `target` ，则返回它的下标，否则返回 `-1` 。

你必须设计一个时间复杂度为 $O(\log n)$ 的算法解决此问题。

**示例 1：**

```
输入：nums = [4,5,6,7,0,1,2], target = 0
输出：4
```

**示例 2：**

```
输入：nums = [4,5,6,7,0,1,2], target = 3
输出：-1
```

**示例 3：**

```
输入：nums = [1], target = 0
输出：-1
```

**提示：**

*   `1 <= nums.length <= 5000`
*   `-10^4 <= nums[i] <= 10^4`
*   `nums` 中的每个值都 **独一无二**
*   题目数据保证 `nums` 在预先未知的某个下标上进行了旋转
*   `-10^4 <= target <= 10^4`

## 思路拆解

数组经过旋转后，从中间 `mid` 切开，一定有一半是有序的。
例如 `[4,5,6,7,0,1,2]`，`mid` 对应 `7`。
*   左半边 `[4,5,6,7]` 是有序的。
*   右半边 `[7,0,1,2]` 是无序的（但其实也是旋转排序数组）。

二分查找的核心逻辑：
1.  找到 `mid`。
2.  判断哪一边是有序的：
    *   如果 `nums[left] <= nums[mid]`，说明 **左半边 `[left, mid]` 是有序的**。
    *   否则，说明 **右半边 `[mid, right]` 是有序的**。
3.  在有序的那一半判断 `target` 是否在范围内：
    *   如果左半边有序，且 `nums[left] <= target < nums[mid]`，则 `target` 肯定在左边，`right = mid - 1`；否则在右边 `left = mid + 1`。
    *   如果右半边有序，且 `nums[mid] < target <= nums[right]`，则 `target` 肯定在右边，`left = mid + 1`；否则在左边 `right = mid - 1`。

**注意**：`target` 和 `nums[mid]` 相等的情况可以直接返回。

## 代码实现

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    let left = 0;
    let right = nums.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] === target) {
            return mid;
        }

        // 判断哪边有序
        if (nums[left] <= nums[mid]) {
            // 左半边有序
            if (nums[left] <= target && target < nums[mid]) {
                // target 在左半边范围内
                right = mid - 1;
            } else {
                // target 在右半边
                left = mid + 1;
            }
        } else {
            // 右半边有序
            if (nums[mid] < target && target <= nums[right]) {
                // target 在右半边范围内
                left = mid + 1;
            } else {
                // target 在左半边
                right = mid - 1;
            }
        }
    }

    return -1;
};
```

## 运行演示

`nums = [4,5,6,7,0,1,2], target = 0`

1.  **第一轮**：
    *   `l=0, r=6`
    *   `mid=3, nums[mid]=7`
    *   `nums[0](4) <= nums[3](7)` -> **左半边有序** `[4,5,6,7]`。
    *   检查 target `0` 是否在 `[4, 7)` 之间？不在。
    *   `l = mid + 1 = 4`。

2.  **第二轮**：
    *   `l=4, r=6`
    *   `mid=5, nums[mid]=1`
    *   `nums[4](0) <= nums[5](1)` -> **左半边有序** `[0,1]`。
    *   检查 target `0` 是否在 `[0, 1)` 之间？`0 <= 0 < 1` -> 在！
    *   `r = mid - 1 = 4`。

3.  **第三轮**：
    *   `l=4, r=4`
    *   `mid=4, nums[mid]=0`
    *   `nums[4] === target` -> 找到！返回 `4`。

## 复杂度分析

*   **时间复杂度**：$O(\log n)$。虽然数组被旋转，但每次仍然丢弃一半的数据。
*   **空间复杂度**：$O(1)$。
