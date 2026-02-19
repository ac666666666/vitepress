# 153. 寻找旋转排序数组中的最小值

[LeetCode 官方题目链接](https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/)

[题目链接](https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/)

## 题目描述

**难度**：中等

已知一个长度为 `n` 的数组，预先按照升序排列，经由 `1` 到 `n` 次 **旋转** 后，得到输入数组。例如，原数组 `nums = [0,1,2,4,5,6,7]` 在变化后可能得到：
*   若旋转 `4` 次，则可以得到 `[4,5,6,7,0,1,2]`
*   若旋转 `7` 次，则可以得到 `[0,1,2,4,5,6,7]`

注意，数组 `[a[0], a[1], a[2], ..., a[n-1]]` **旋转一次** 的结果为数组 `[a[n-1], a[0], a[1], a[2], ..., a[n-2]]` 。

给你一个元素值 **互不相同** 的数组 `nums` ，它原来是一个升序排列的数组，并按上述情形进行了多次旋转。请你找出并返回数组中的 **最小元素** 。

你必须设计一个时间复杂度为 $O(\log n)$ 的算法解决此问题。

**示例 1：**

```
输入：nums = [3,4,5,1,2]
输出：1
解释：原数组为 [1,2,3,4,5] ，旋转 3 次得到输入数组。
```

**示例 2：**

```
输入：nums = [4,5,6,7,0,1,2]
输出：0
解释：原数组为 [0,1,2,4,5,6,7] ，旋转 4 次得到输入数组。
```

**示例 3：**

```
输入：nums = [11,13,15,17]
输出：11
解释：原数组为 [11,13,15,17] ，旋转 4 次得到输入数组。
```

**提示：**

*   `n == nums.length`
*   `1 <= n <= 5000`
*   `-5000 <= nums[i] <= 5000`
*   `nums` 中的所有整数 **互不相同**
*   `nums` 原来是一个升序排序的数组，并进行了 `1` 至 `n` 次旋转

## 思路拆解

我们要寻找旋转排序数组中的最小值。
旋转排序数组的特点是：部分有序。
最小值实际上是**旋转点**。

观察规律：
*   如果 `nums[mid] < nums[right]`：说明 `mid` 到 `right` 这一段是有序的（递增）。最小值肯定不在 `(mid, right]` 这个区间里，但可能是 `mid` 自己。所以 `right = mid`。
*   如果 `nums[mid] > nums[right]`：说明 `left` 到 `mid` 这一段是有序的，且最小值肯定在 `mid` 的右边（因为发生了旋转，左边的大数被转过去了）。所以 `left = mid + 1`。
*   注意：由于数组元素互不相同，不会出现 `nums[mid] == nums[right]` 的情况（除非数组长度为 1）。

**为什么比较 `nums[mid]` 和 `nums[right]` 而不是 `nums[left]`？**
因为二分查找是为了缩减区间。
*   如果比较 `nums[mid]` 和 `nums[left]`：
    *   `nums[mid] > nums[left]`：说明 `[left, mid]` 有序。最小值可能在 `left`（如果不旋转），也可能在 `mid` 右侧（如果旋转了）。例如 `[1,2,3]` 和 `[3,4,5,1,2]`。这无法确定缩减方向。
*   而比较 `nums[mid]` 和 `nums[right]`：
    *   `nums[mid] < nums[right]`：说明 `[mid, right]` 有序，最小值一定在 `mid` 左侧（包含 `mid`）。
    *   `nums[mid] > nums[right]`：说明最小值一定在 `mid` 右侧。

**算法流程**：
1.  `left = 0`, `right = n - 1`。
2.  当 `left < right` 时（注意这里不包含 `=`，因为最后收敛到一个点）：
    *   `mid = Math.floor((left + right) / 2)`。
    *   如果 `nums[mid] < nums[right]`：说明右半边有序，最小值在 `[left, mid]`，更新 `right = mid`。
    *   如果 `nums[mid] > nums[right]`：说明左半边有序且较大，最小值在 `[mid + 1, right]`，更新 `left = mid + 1`。
3.  循环结束时 `left === right`，返回 `nums[left]`。

## 代码实现

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function(nums) {
    let left = 0;
    let right = nums.length - 1;

    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] < nums[right]) {
            // 右半边有序，最小值在左半边（含 mid）
            right = mid;
        } else {
            // nums[mid] > nums[right]
            // 左半边有序且值较大，最小值在右半边（不含 mid）
            left = mid + 1;
        }
    }
    
    return nums[left];
};
```

## 运行演示

`nums = [4,5,6,7,0,1,2]`

1.  **第一轮**：
    *   `l=0, r=6`
    *   `mid=3, nums[mid]=7`
    *   `nums[3](7) > nums[6](2)` -> `l = mid + 1 = 4`。

2.  **第二轮**：
    *   `l=4, r=6`
    *   `mid=5, nums[mid]=1`
    *   `nums[5](1) < nums[6](2)` -> `r = mid = 5`。

3.  **第三轮**：
    *   `l=4, r=5`
    *   `mid=4, nums[mid]=0`
    *   `nums[4](0) < nums[5](1)` -> `r = mid = 4`。

4.  **结束**：
    *   `l=4, r=4`，不满足 `l < r`。
    *   返回 `nums[4]` 即 `0`。

## 复杂度分析

*   **时间复杂度**：$O(\log n)$。
*   **空间复杂度**：$O(1)$。
