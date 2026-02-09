# 74. 搜索二维矩阵

[题目链接](https://leetcode.cn/problems/search-a-2d-matrix/)

## 题目描述

**难度**：中等

给你一个满足下述两条属性的 `m x n` 整数矩阵：

*   每行中的整数从左到右按非严格递增顺序排列。
*   每行的第一个整数大于前一行的最后一个整数。

给你一个整数 `target` ，如果 `target` 在矩阵中，返回 `true` ；否则，返回 `false` 。

**示例 1：**

```
输入：matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
输出：true
```

**示例 2：**

```
输入：matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
输出：false
```

**提示：**

*   `m == matrix.length`
*   `n == matrix[i].length`
*   `1 <= m, n <= 100`
*   `-10^4 <= matrix[i][j], target <= 10^4`

## 思路拆解

由于矩阵具有“每行递增”且“下一行首元素大于上一行尾元素”的特性，这实际上可以将整个二维矩阵看作一个有序的一维数组。

假设矩阵有 `m` 行 `n` 列，那么元素总数是 `m * n`。
对于一维数组下标 `idx`（范围 `0` 到 `m * n - 1`），它对应在二维矩阵中的坐标为：
*   行下标：`row = Math.floor(idx / n)`
*   列下标：`col = idx % n`

因此，我们可以直接对这个“虚拟”的一维数组进行二分查找，时间复杂度为 $O(\log(mn))$。

**二分查找过程**：
1.  初始化 `left = 0`，`right = m * n - 1`。
2.  当 `left <= right` 时循环：
    *   计算 `mid = Math.floor((left + right) / 2)`。
    *   通过 `mid` 计算矩阵坐标 `r = Math.floor(mid / n)`，`c = mid % n`。
    *   获取值 `val = matrix[r][c]`。
    *   如果 `val === target`，返回 `true`。
    *   如果 `val < target`，说明目标在右侧，`left = mid + 1`。
    *   如果 `val > target`，说明目标在左侧，`right = mid - 1`。
3.  循环结束仍未找到，返回 `false`。

## 代码实现

```javascript
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function(matrix, target) {
    if (!matrix.length || !matrix[0].length) return false;
    
    const m = matrix.length;
    const n = matrix[0].length;
    
    let left = 0;
    let right = m * n - 1;
    
    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        
        // 将一维坐标 mid 映射回二维坐标 (row, col)
        const row = Math.floor(mid / n);
        const col = mid % n;
        const val = matrix[row][col];
        
        if (val === target) {
            return true;
        } else if (val < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return false;
};
```

## 运行演示

**示例 1：** `matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3`

*   `m = 3`, `n = 4`。
*   `left = 0`, `right = 11`。

1.  **第一轮**：
    *   `mid = 5`。
    *   `row = 5 / 4 = 1`, `col = 5 % 4 = 1`。
    *   `val = matrix[1][1] = 11`。
    *   `11 > 3`，`target` 在左侧。
    *   `right = 4`。

2.  **第二轮**：
    *   `left = 0`, `right = 4`。
    *   `mid = 2`。
    *   `row = 0`, `col = 2`。
    *   `val = matrix[0][2] = 5`。
    *   `5 > 3`，`target` 在左侧。
    *   `right = 1`。

3.  **第三轮**：
    *   `left = 0`, `right = 1`。
    *   `mid = 0`。
    *   `row = 0`, `col = 0`。
    *   `val = matrix[0][0] = 1`。
    *   `1 < 3`，`target` 在右侧。
    *   `left = 1`。

4.  **第四轮**：
    *   `left = 1`, `right = 1`。
    *   `mid = 1`。
    *   `row = 0`, `col = 1`。
    *   `val = matrix[0][1] = 3`。
    *   `3 === 3`，找到目标，返回 `true`。

## 复杂度分析

*   **时间复杂度**：$O(\log(mn))$。我们将二维矩阵视为长度为 $mn$ 的一维数组进行二分查找。
*   **空间复杂度**：$O(1)$。
