# 杨辉三角

[LeetCode 官方题目链接](https://leetcode.cn/problems/pascals-triangle/)

## 题目描述

给定一个非负整数 `numRows`，生成「杨辉三角」的前 `numRows` 行。

在「杨辉三角」中，每个数是它左上方和右上方的数的和。

**示例 1:**

```text
输入: numRows = 5
输出: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
```

**示例 2:**

```text
输入: numRows = 1
输出: [[1]]
```

## 思路拆解

杨辉三角的性质：
1. 第一行只有一个元素 `1`。
2. 每一行的第一个元素和最后一个元素都是 `1`。
3. 其他元素满足：`triangle[i][j] = triangle[i-1][j-1] + triangle[i-1][j]`。

我们可以直接按照这个性质模拟生成。

### 动态规划
其实这也是一种动态规划的思想，因为当前行的状态是由上一行的状态推导出来的。

1. 初始化一个空数组 `res`。
2. 遍历 `i` 从 0 到 `numRows - 1`：
   - 初始化当前行 `row`，长度为 `i + 1`，首尾元素设为 1。
   - 对于中间的元素（`j` 从 1 到 `i - 1`）：`row[j] = res[i-1][j-1] + res[i-1][j]`。
   - 将 `row` 加入 `res`。
3. 返回 `res`。

## 代码实现

```javascript
/**
 * @param {number} numRows
 * @return {number[][]}
 */
var generate = function(numRows) {
    const res = [];
    
    for (let i = 0; i < numRows; i++) {
        const row = new Array(i + 1).fill(1);
        
        for (let j = 1; j < row.length - 1; j++) {
            // 当前元素 = 上一行左上方 + 上一行右上方
            row[j] = res[i - 1][j - 1] + res[i - 1][j];
        }
        
        res.push(row);
    }
    
    return res;
};
```

## 运行演示

假设 `numRows = 4`：

1. `i = 0`: `row = [1]`, `res = [[1]]`
2. `i = 1`: `row = [1, 1]`, `res = [[1], [1, 1]]`
3. `i = 2`: 
   - `row` 初始化 `[1, 1, 1]`
   - `j = 1`: `row[1] = res[1][0] + res[1][1] = 1 + 1 = 2`
   - `row = [1, 2, 1]`
   - `res` 添加 `[1, 2, 1]`
4. `i = 3`:
   - `row` 初始化 `[1, 1, 1, 1]`
   - `j = 1`: `row[1] = res[2][0] + res[2][1] = 1 + 2 = 3`
   - `j = 2`: `row[2] = res[2][1] + res[2][2] = 2 + 1 = 3`
   - `row = [1, 3, 3, 1]`
   - `res` 添加 `[1, 3, 3, 1]`

## 复杂度分析

- **时间复杂度**：$O(numRows^2)$。我们需要计算的总元素个数是 $1 + 2 + ... + numRows = numRows * (numRows + 1) / 2$。
- **空间复杂度**：$O(1)$（不考虑返回值占用的空间）。
