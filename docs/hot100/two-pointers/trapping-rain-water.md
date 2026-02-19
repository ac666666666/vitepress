# 接雨水

[LeetCode 官方题目链接](https://leetcode.cn/problems/trapping-rain-water/)

## 1. 题目呈现

**难度等级**：🔴 困难  
**核心考察点**：数组、双指针、单调栈、动态规划

给定 `n` 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。

> **示例 1：**
>
> ![Trapping Rain Water](https://aliyun-lc-upload.oss-cn-hangzhou.aliyuncs.com/aliyun-lc-upload/uploads/2018/10/22/rainwatertrap.png)
>
> **输入**：height = [0,1,0,2,1,0,1,3,2,1,2,1]  
> **输出**：6  
> **解释**：上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。

> **示例 2：**
>
> **输入**：height = [4,2,0,3,2,5]  
> **输出**：9

---

## 2. 解题思路拆解

### 方法：双指针（对撞指针）

**核心思想**：
对于下标 `i` 处的柱子，它能接到的水量等于 `min(左边最高柱子, 右边最高柱子) - height[i]`。
只要 `min(left_max, right_max) > height[i]`，就能接到水。

如果我们用动态规划，需要额外的 $O(n)$ 空间来存储每个位置的 `left_max` 和 `right_max`。
但使用**双指针**可以将空间优化到 $O(1)$。

**算法流程**：
1.  定义 `left` 和 `right` 指针，分别指向数组头尾。
2.  定义 `leftMax` 和 `rightMax` 变量，记录左边和右边的当前最大高度。
3.  **比较 `height[left]` 和 `height[right]`**：
    *   如果 `height[left] < height[right]`：
        *   这意味着对于 `left` 指针所在位置，其**右边的最大值**肯定大于等于 `height[right]`，而 `height[right]` 又大于 `height[left]`。
        *   所以 `left` 位置能装多少水，完全取决于 `leftMax`（因为短板在左边）。
        *   如果 `height[left] < leftMax`，累加水量 `leftMax - height[left]`。
        *   如果 `height[left] >= leftMax`，更新 `leftMax`。
        *   `left` 指针右移。
    *   如果 `height[left] >= height[right]`：
        *   同理，对于 `right` 指针所在位置，其**左边的最大值**肯定足够高。
        *   所以 `right` 位置能装多少水，完全取决于 `rightMax`（因为短板在右边）。
        *   如果 `height[right] < rightMax`，累加水量 `rightMax - height[right]`。
        *   如果 `height[right] >= rightMax`，更新 `rightMax`。
        *   `right` 指针左移。

这种方法本质上是在动态地寻找每个位置的左右“短板”，并利用双指针的特性避免了预计算。

---

## 3. 代码实现

```javascript
/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
    let left = 0;
    let right = height.length - 1;
    let leftMax = 0;
    let rightMax = 0;
    let ans = 0;

    while (left < right) {
        // 每次移动较矮的那一侧
        if (height[left] < height[right]) {
            // 如果当前柱子比左边最大值还矮，说明可以接水
            if (height[left] < leftMax) {
                ans += leftMax - height[left];
            } else {
                // 否则更新最大值
                leftMax = height[left];
            }
            left++;
        } else {
            // 如果当前柱子比右边最大值还矮，说明可以接水
            if (height[right] < rightMax) {
                ans += rightMax - height[right];
            } else {
                // 否则更新最大值
                rightMax = height[right];
            }
            right--;
        }
    }
    return ans;
};
```

#### 代码执行演示
输入 `height = [0,1,0,2,1,0,1,3,2,1,2,1]`

1.  **L=0 (0), R=11 (1)**。`0 < 1`。左侧处理。
    *   `0 < leftMax(0)`? No。`leftMax = 0`。`L` -> 1。
2.  **L=1 (1), R=11 (1)**。`1 == 1`。右侧处理（任意，假设右）。
    *   `1 < rightMax(0)`? No。`rightMax = 1`。`R` -> 10。
3.  **L=1 (1), R=10 (2)**。`1 < 2`。左侧处理。
    *   `1 < leftMax(0)`? No。`leftMax = 1`。`L` -> 2。
4.  **L=2 (0), R=10 (2)**。`0 < 2`。左侧处理。
    *   `0 < leftMax(1)`? **Yes**。**Ans += 1 - 0 = 1**。`L` -> 3。
5.  **L=3 (2), R=10 (2)**。`2 == 2`。右侧处理。
    *   `2 < rightMax(1)`? No。`rightMax = 2`。`R` -> 9。
6.  **L=3 (2), R=9 (1)**。`2 > 1`。右侧处理。
    *   `1 < rightMax(2)`? **Yes**。**Ans += 2 - 1 = 1** (总 2)。`R` -> 8。
7.  ...
    *   最终累加得到 Ans = 6。

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(n)$。双指针遍历整个数组一次。 |
| **空间复杂度** | $O(1)$。只使用了常数个变量，没有使用额外的栈或数组。 |
