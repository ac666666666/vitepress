# 搜索二维矩阵 II

## 1. 题目呈现

**难度等级**：🟡 中等  
**核心考察点**：矩阵、二分查找、分治

编写一个高效的算法来搜索 `m x n` 矩阵 `matrix` 中的一个目标值 `target` 。该矩阵具有以下特性：

*   每行的元素从左到右升序排列。
*   每列的元素从上到下升序排列。

> **示例 1：**
>
> **输入**：matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5  
> **输出**：true

> **示例 2：**
>
> **输入**：matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 20  
> **输出**：false

---

## 2. 解题思路拆解

### 方法：Z 字形查找 (从右上角开始)

这道题利用矩阵的有序特性，可以把二维搜索转化为一种类似二叉搜索树（BST）的路径搜索。

1.  **起点选择**：
    *   如果我们选择**左上角** `(0, 0)`，它是最小值。如果 `target > matrix[0][0]`，我们既可以向右也可以向下，无法缩小范围。
    *   如果我们选择**右上角** `(0, n-1)`，它是第一行的最大值，第一列的最小值（相对于它所在的列来说不准确，但它是该行最大，该列最小）。
    *   让我们看**右上角** `(row, col)` 的元素 `val`：
        *   **如果 `val > target`**：因为列是递增的，所以当前列下面的元素肯定都比 `val` 大，更比 `target` 大。所以**排除当前列**，向左移动 (`col--`)。
        *   **如果 `val < target`**：因为行是递增的，所以当前行左边的元素肯定都比 `val` 小，更比 `target` 小。所以**排除当前行**，向下移动 (`row++`)。
        *   **如果 `val === target`**：找到了！

2.  **算法流程**：
    *   初始化指针 `row = 0`，`col = n - 1`（右上角）。
    *   当 `row < m` 且 `col >= 0` 时循环：
        *   如果 `matrix[row][col] === target`，返回 `true`。
        *   如果 `matrix[row][col] > target`，`col--`。
        *   如果 `matrix[row][col] < target`，`row++`。
    *   如果循环结束还没找到，返回 `false`。

3.  **同理**：从**左下角**开始也是可以的（向上排除了行，向右排除了列）。但不能从左上角或右下角开始。

---

## 3. 代码实现

```javascript
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function(matrix, target) {
    if (!matrix.length || !matrix[0].length) {
        return false;
    }
    
    const m = matrix.length;
    const n = matrix[0].length;
    
    // 从右上角开始
    let row = 0;
    let col = n - 1;
    
    while (row < m && col >= 0) {
        const val = matrix[row][col];
        
        if (val === target) {
            return true;
        } else if (val > target) {
            // 当前值比目标大，说明这一列剩下的都比目标大（或者说目标只能在左边）
            col--;
        } else {
            // 当前值比目标小，说明这一行左边的都比目标小（或者说目标只能在下面）
            row++;
        }
    }
    
    return false;
};
```

#### 代码执行演示
输入 `matrix` 如示例 1，`target = 5`

1.  **Start**: `row=0, col=4`, `val = 15`。
    *   `15 > 5`。`col--` -> `col=3`。
2.  **Current**: `row=0, col=3`, `val = 11`。
    *   `11 > 5`。`col--` -> `col=2`。
3.  **Current**: `row=0, col=2`, `val = 7`。
    *   `7 > 5`。`col--` -> `col=1`。
4.  **Current**: `row=0, col=1`, `val = 4`。
    *   `4 < 5`。`row++` -> `row=1`。
5.  **Current**: `row=1, col=1`, `val = 5`。
    *   `5 === 5`。**Found!** 返回 `true`。

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(m + n)$。最坏情况下，我们从右上角走到左下角，每次要么向左一步，要么向下一步，总步数不超过 `m + n`。 |
| **空间复杂度** | $O(1)$。不需要额外空间。 |
