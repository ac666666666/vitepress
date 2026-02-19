# 4. 寻找两个正序数组的中位数

[LeetCode 官方题目链接](https://leetcode.cn/problems/median-of-two-sorted-arrays/)

[题目链接](https://leetcode.cn/problems/median-of-two-sorted-arrays/)

## 题目描述

**难度**：困难

给定两个大小分别为 `m` 和 `n` 的正序（从小到大）数组 `nums1` 和 `nums2`。请你找出并返回这两个正序数组的 **中位数** 。

算法的时间复杂度应该为 $O(\log (m+n))$ 。

**示例 1：**

```
输入：nums1 = [1,3], nums2 = [2]
输出：2.00000
解释：合并数组 = [1,2,3] ，中位数 2
```

**示例 2：**

```
输入：nums1 = [1,2], nums2 = [3,4]
输出：2.50000
解释：合并数组 = [1,2,3,4] ，中位数 (2 + 3) / 2 = 2.5
```

**提示：**

*   `nums1.length == m`
*   `nums2.length == n`
*   `0 <= m <= 1000`
*   `0 <= n <= 1000`
*   `1 <= m + n <= 2000`
*   `-10^6 <= nums1[i], nums2[i] <= 10^6`

## 思路拆解

题目要求 $O(\log(m+n))$ 的时间复杂度，这意味着我们不能直接合并数组（复杂度 $O(m+n)$）。我们需要用到二分查找。

**方法一：寻找第 k 小的元素**
寻找中位数本质上是寻找第 `k` 小的元素。
*   如果总长度 `total = m + n` 是奇数，中位数是第 `(total + 1) / 2` 小的元素。
*   如果总长度 `total = m + n` 是偶数，中位数是第 `total / 2` 小和第 `total / 2 + 1` 小元素的平均值。

**如何寻找第 k 小的元素？**
比较 `nums1[k/2 - 1]` 和 `nums2[k/2 - 1]`。
*   如果 `nums1[k/2 - 1] < nums2[k/2 - 1]`，说明 `nums1` 的前 `k/2` 个元素一定在第 `k` 小元素的前面。我们可以安全地排除 `nums1` 的前 `k/2` 个元素，然后寻找剩下的元素中的第 `k - k/2` 小元素。
*   反之亦然。

**方法二：划分数组（推荐）**
我们的目标是将两个数组划分成左右两部分：
`left_part` | `right_part`
`nums1[0...i-1]` | `nums1[i...m-1]`
`nums2[0...j-1]` | `nums2[j...n-1]`

使得：
1.  `len(left_part) == len(right_part)`（偶数情况）或者 `len(left_part) == len(right_part) + 1`（奇数情况）。
2.  `max(left_part) <= min(right_part)`。

此时：
*   如果总长奇数：中位数为 `max(left_part)`。
*   如果总长偶数：中位数为 `(max(left_part) + min(right_part)) / 2`。

假设 `nums1` 长度较小（若不是则交换）。我们在 `nums1` 上进行二分查找 `i`。
`i` 是 `nums1` 的分割线位置，`j` 是 `nums2` 的分割线位置。
由条件 1 可知 `i + j = (m + n + 1) / 2`（整数除法），所以 `j = (m + n + 1) / 2 - i`。

我们需要满足条件 2：
*   `nums1[i-1] <= nums2[j]`
*   `nums2[j-1] <= nums1[i]`

如果 `nums1[i-1] > nums2[j]`，说明 `i` 太大了，需要左移。
如果 `nums2[j-1] > nums1[i]`，说明 `i` 太小了，需要右移。

**边界情况**：
`i=0`, `i=m`, `j=0`, `j=n` 需要特殊处理（视为无穷小或无穷大）。

## 代码实现

```javascript
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
    // 保证 nums1 是较短的数组，以保证 j 不会越界
    if (nums1.length > nums2.length) {
        [nums1, nums2] = [nums2, nums1];
    }

    const m = nums1.length;
    const n = nums2.length;
    
    let left = 0;
    let right = m;
    
    // median1: 左半部分的最大值
    // median2: 右半部分的最小值
    let median1 = 0;
    let median2 = 0;

    while (left <= right) {
        // i 是 nums1 的分割线位置 (0 到 m)
        // j 是 nums2 的分割线位置
        const i = Math.floor((left + right) / 2);
        const j = Math.floor((m + n + 1) / 2) - i;

        // nums1Im1: nums1[i-1]
        // nums1I:   nums1[i]
        // nums2Jm1: nums2[j-1]
        // nums2J:   nums2[j]
        
        const nums1Im1 = (i === 0) ? -Infinity : nums1[i - 1];
        const nums1I   = (i === m) ? Infinity : nums1[i];
        const nums2Jm1 = (j === 0) ? -Infinity : nums2[j - 1];
        const nums2J   = (j === n) ? Infinity : nums2[j];

        if (nums1Im1 <= nums2J) {
            // i 可能偏小或正好，尝试向右找，并记录当前可能的左半部分最大值
            median1 = Math.max(nums1Im1, nums2Jm1);
            median2 = Math.min(nums1I, nums2J);
            left = i + 1;
        } else {
            // i 偏大，向左找
            right = i - 1;
        }
    }

    // 循环结束时，我们已经找到了合适的划分（实际上在最后一次满足条件时更新了 median1 和 median2）
    // 但由于二分查找的写法，这里需要稍微回退一下或者直接利用循环中的逻辑
    // 为了代码严谨，可以稍微调整二分逻辑，或者直接使用计算好的 i, j
    
    // 让我们重新梳理二分查找的逻辑：
    // 目标是找到最大的 i 满足 nums1[i-1] <= nums2[j]
    // 此时 nums2[j-1] <= nums1[i] 也会自动满足（在最优解处）
    
    // 重写二分以更精确控制
    return findMedian(nums1, nums2);
};

function findMedian(nums1, nums2) {
    const m = nums1.length;
    const n = nums2.length;
    let left = 0, right = m;
    
    while (left <= right) {
        const i = Math.floor((left + right) / 2);
        const j = Math.floor((m + n + 1) / 2) - i;
        
        const maxLeft1 = (i === 0) ? -Infinity : nums1[i - 1];
        const minRight1 = (i === m) ? Infinity : nums1[i];
        
        const maxLeft2 = (j === 0) ? -Infinity : nums2[j - 1];
        const minRight2 = (j === n) ? Infinity : nums2[j];
        
        if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
            // 找到了正确的分割
            if ((m + n) % 2 === 1) {
                return Math.max(maxLeft1, maxLeft2);
            } else {
                return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2;
            }
        } else if (maxLeft1 > minRight2) {
            // nums1 左边太大了，i 需要减小
            right = i - 1;
        } else {
            // nums2 左边太大了 (maxLeft2 > minRight1)，意味着 nums1 右边太小，i 需要增大
            left = i + 1;
        }
    }
    return 0;
}
```

## 运行演示

`nums1 = [1, 3], nums2 = [2]`
`m = 2, n = 1`. 交换后 `nums1 = [2], nums2 = [1, 3]`. `m=1, n=2`.
`left = 0, right = 1`.

1.  **第一轮**：
    *   `i = 0`. `j = (1 + 2 + 1) / 2 - 0 = 2`.
    *   `maxLeft1 = -Inf`. `minRight1 = 2`.
    *   `maxLeft2 = 3`. `minRight2 = Inf`.
    *   检查：`-Inf <= Inf` (ok), `3 <= 2` (fail). `maxLeft2 > minRight1`.
    *   `left = i + 1 = 1`.

2.  **第二轮**：
    *   `left = 1, right = 1`.
    *   `i = 1`. `j = 2 - 1 = 1`.
    *   `maxLeft1 = 2`. `minRight1 = Inf`.
    *   `maxLeft2 = 1`. `minRight2 = 3`.
    *   检查：`2 <= 3` (ok), `1 <= Inf` (ok).
    *   找到！
    *   总长度奇数：`max(2, 1) = 2`.
    *   返回 `2`.

## 复杂度分析

*   **时间复杂度**：$O(\log(\min(m, n)))$。我们只在较短的数组上进行二分查找。
*   **空间复杂度**：$O(1)$。
