# 51. N 皇后

[LeetCode 官方题目链接](https://leetcode.cn/problems/n-queens/)

[题目链接](https://leetcode.cn/problems/n-queens/)

## 题目描述

**难度**：困难

按照国际象棋的规则，皇后可以攻击与之处在同一行、同一列或同一条斜线上的棋子。

**n 皇后问题** 研究的是如何将 `n` 个皇后放置在 `n×n` 的棋盘上，并且使皇后彼此之间不能相互攻击。

给你一个整数 `n` ，返回所有不同的 **n 皇后问题** 的解决方案。

每一种解法包含一个不同的 **n 皇后问题** 的棋子放置方案，该方案中 `'Q'` 和 `'.'` 分别代表了皇后和空位。

**示例 1：**

```
输入：n = 4
输出：[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
解释：如上图所示，4 皇后问题存在两个不同的解法。
```

**示例 2：**

```
输入：n = 1
输出：[["Q"]]
```

**提示：**

*   `1 <= n <= 9`

## 思路拆解

N 皇后问题是经典的回溯算法问题。我们需要在 $N \times N$ 的棋盘上放置 $N$ 个皇后，使得它们不能互相攻击。
皇后可以攻击同一行、同一列、同一左斜线（\）和同一右斜线（/）上的棋子。

**约束条件分析**：
1.  **行约束**：每一行只能放置一个皇后。我们可以通过递归的层数 `row` 来自然保证这一点，每层递归处理一行。
2.  **列约束**：每一列只能放置一个皇后。我们可以使用一个布尔数组或哈希表 `cols` 来记录哪些列已经被占用。
3.  **斜线约束**：
    *   **主对角线（左上到右下 \）**：同一条主对角线上的 `row - col` 是常数。为了避免负数，可以使用 `row - col + n`。
    *   **副对角线（右上到左下 /）**：同一条副对角线上的 `row + col` 是常数。

**回溯过程**：
1.  从第 0 行开始放置皇后。
2.  遍历当前行的每一列 `col`：
    *   检查该位置 `(row, col)` 是否安全（即列、主对角线、副对角线是否已被占用）。
    *   如果安全：
        *   放置皇后（更新列、对角线状态）。
        *   记录当前行的皇后位置。
        *   递归进入下一行 `row + 1`。
        *   回溯：撤销放置（恢复列、对角线状态）。
3.  当 `row === n` 时，说明成功放置了 n 个皇后，将当前方案转化为题目要求的字符串格式并加入结果集。

## 代码实现

```javascript
/**
 * @param {number} n
 * @return {string[][]}
 */
var solveNQueens = function(n) {
    const res = [];
    // 记录每行放置的皇后所在的列下标，queens[r] = c 表示第 r 行皇后在第 c 列
    const queens = new Array(n).fill(-1);
    
    // 使用 Set 记录攻击范围，空间换时间
    const columns = new Set();
    const diagonals1 = new Set(); // 主对角线 row - col
    const diagonals2 = new Set(); // 副对角线 row + col
    
    const backtrack = (row) => {
        // 终止条件：成功放置了 n 个皇后
        if (row === n) {
            res.push(generateBoard(queens, n));
            return;
        }
        
        for (let col = 0; col < n; col++) {
            // 计算对角线标识
            const diag1 = row - col;
            const diag2 = row + col;
            
            // 剪枝：如果当前列或对角线已有皇后，跳过
            if (columns.has(col) || diagonals1.has(diag1) || diagonals2.has(diag2)) {
                continue;
            }
            
            // 做选择
            queens[row] = col;
            columns.add(col);
            diagonals1.add(diag1);
            diagonals2.add(diag2);
            
            // 进入下一行
            backtrack(row + 1);
            
            // 撤销选择（回溯）
            queens[row] = -1;
            columns.delete(col);
            diagonals1.delete(diag1);
            diagonals2.delete(diag2);
        }
    };
    
    backtrack(0);
    return res;
};

// 辅助函数：根据 queens 数组生成棋盘字符串
function generateBoard(queens, n) {
    const board = [];
    for (let i = 0; i < n; i++) {
        let rowStr = '';
        for (let j = 0; j < n; j++) {
            if (queens[i] === j) {
                rowStr += 'Q';
            } else {
                rowStr += '.';
            }
        }
        board.push(rowStr);
    }
    return board;
}
```

## 运行演示

假设 `n = 4`：

1.  **row=0**：
    *   尝试 `(0, 0)` -> 放置 Q。状态更新。
    *   递归 `row=1`。
2.  **row=1**：
    *   `(1, 0)`：列冲突。
    *   `(1, 1)`：主对角线冲突。
    *   `(1, 2)`：放置 Q。状态更新。
    *   递归 `row=2`。
3.  **row=2**：
    *   `(2, 0)`：列冲突。
    *   `(2, 1)`：副对角线冲突（来自 (1,2)）。
    *   `(2, 2)`：列冲突。
    *   `(2, 3)`：主对角线冲突（来自 (1,2)）。
    *   无处可放，回溯到 `row=1`。
4.  **row=1** (回溯后)：
    *   撤销 `(1, 2)`。
    *   尝试 `(1, 3)` -> 放置 Q。
    *   ...继续搜索...

最终找到两个解：
1.  `[".Q..", "...Q", "Q...", "..Q."]`
2.  `["..Q.", "Q...", "...Q", ".Q.."]`

## 复杂度分析

*   **时间复杂度**：$O(N!)$。
    *   第一行有 $N$ 种选择，第二行最多 $N-1$ 种... 实际上由于对角线限制，搜索空间会小于 $N!$，但量级仍然是阶乘级。
*   **空间复杂度**：$O(N)$。
    *   需要三个集合（列、主对角线、副对角线）来记录状态，每个集合最多存储 $N$ 或 $2N$ 个元素。
    *   递归调用栈深度为 $N$。
    *   存储结果需要 $O(1)$ 的额外空间（不计算输出所需空间）。
