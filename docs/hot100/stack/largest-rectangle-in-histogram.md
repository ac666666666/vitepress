# 柱状图中最大的矩形

[LeetCode 官方题目链接](https://leetcode.cn/problems/largest-rectangle-in-histogram/)

## 1. 题目呈现

[LeetCode 链接](https://leetcode.cn/problems/largest-rectangle-in-histogram/)

给定 `n` 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 `1` 。

求在该柱状图中，能够勾勒出来的矩形的最大面积。

**示例 1:**
![示例1](https://assets.leetcode.com/uploads/2021/01/04/histogram.jpg)
```text
输入：heights = [2,1,5,6,2,3]
输出：10
解释：最大的矩形为图中红色区域，面积 = 5 * 2 = 10
```

**示例 2:**
![示例2](https://assets.leetcode.com/uploads/2021/01/04/histogram-1.jpg)
```text
输入： heights = [2,4]
输出： 4
```

## 2. 思路拆解

这道题是 **单调栈** 的高级应用。

### 核心思想
对于每一根柱子，如果以它为高度，那么能向左和向右延伸多远？
- 向左：延伸到第一个比它矮的柱子的右边。
- 向右：延伸到第一个比它矮的柱子的左边。
矩形的宽度 = 右边界下标 - 左边界下标 - 1。
矩形的面积 = 当前柱子高度 * 宽度。

### 单调栈解法
我们需要找到每个元素左边第一个比它小的位置和右边第一个比它小的位置。
- 使用一个 **单调递增栈**。
- 当遍历到的新高度 `currentHeight` 小于栈顶高度 `heights[stackTop]` 时，说明栈顶这根柱子的 **右边界** 确定了（就是当前下标 `i`）。
- 此时弹出栈顶下标 `mid`，它的高度就是 `heights[mid]`。
- 弹出后的新栈顶 `left` 就是 `mid` 的 **左边界**（因为栈是单调递增的，新栈顶是 `mid` 左边第一个比它矮的）。
- 面积 = `heights[mid] * (i - left - 1)`。

### 技巧：哨兵
为了简化边界处理（例如栈为空，或者遍历结束栈不为空），我们可以在数组的 **首尾** 各加一个高度为 `0` 的哨兵。
- 首部 `0`：保证栈永远不为空（因为所有高度都非负，0 一定最小）。
- 尾部 `0`：保证遍历结束时，栈中所有剩余元素都能出栈并计算面积。

## 3. 代码实现

```javascript
/**
 * @param {number[]} heights
 * @return {number}
 */
var largestRectangleArea = function(heights) {
    // 数组前后加 0，简化边界判断
    let newHeights = [0, ...heights, 0];
    let stack = []; // 单调递增栈，存储下标
    let maxArea = 0;

    for (let i = 0; i < newHeights.length; i++) {
        // 当栈不为空，且当前高度小于栈顶高度时，说明找到了右边界
        while (stack.length > 0 && newHeights[i] < newHeights[stack[stack.length - 1]]) {
            const curHeight = newHeights[stack.pop()]; // 当前计算的柱子高度
            const curWidth = i - stack[stack.length - 1] - 1; // 宽度 = 右边界 - 左边界 - 1
            maxArea = Math.max(maxArea, curHeight * curWidth);
        }
        stack.push(i);
    }

    return maxArea;
};
```

## 4. 运行 Demo

```javascript
const h1 = [2,1,5,6,2,3];
console.log(largestRectangleArea(h1)); // 10

const h2 = [2,4];
console.log(largestRectangleArea(h2)); // 4
```

## 5. 复杂度分析

-   **时间复杂度**：$O(n)$，其中 $n$ 是数组的长度。每个元素最多入栈一次，出栈一次。
-   **空间复杂度**：$O(n)$，栈的大小最坏情况下为 $n$。
