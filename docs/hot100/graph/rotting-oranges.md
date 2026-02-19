# 腐烂的橘子

[LeetCode 官方题目链接](https://leetcode.cn/problems/rotting-oranges/)

## 1. 题目呈现

**难度等级**：🟡 中等  
**核心考察点**：图、广度优先搜索 (BFS)、多源 BFS

在给定的 `m x n` 网格 `grid` 中，每个单元格可以有以下三个值之一：
*   `0` 代表空单元格，
*   `1` 代表新鲜橘子，
*   `2` 代表腐烂的橘子。

每分钟，腐烂的橘子 **周围 4 个方向上相邻** 的新鲜橘子都会腐烂。

返回 *直到单元格中没有新鲜橘子为止所必须经过的最小分钟数*。如果不可能，返回 `-1`。

> **示例 1：**
>
> **输入**：grid = [[2,1,1],[1,1,0],[0,1,1]]  
> **输出**：4

> **示例 2：**
>
> **输入**：grid = [[2,1,1],[0,1,1],[1,0,1]]  
> **输出**：-1  
> **解释**：左下角的橘子（第 2 行，第 0 列）永远不会腐烂，因为腐烂只会发生在 4 个正向上。

> **示例 3：**
>
> **输入**：grid = [[0,2]]  
> **输出**：0  
> **解释**：因为 0 分钟时已经没有新鲜橘子了，所以答案就是 0 。

---

## 2. 解题思路拆解

这道题是典型的 **多源广度优先搜索 (Multi-source BFS)** 问题。
因为腐烂是从多个源头（所有初始状态为 2 的橘子）同时开始向外扩散的，每一层扩散代表 1 分钟。

**算法步骤**：

1.  **初始化**：
    *   遍历网格，找出所有初始腐烂的橘子，将它们的坐标加入队列 `queue`。
    *   统计新鲜橘子的总数 `freshCount`。
2.  **BFS 扩散**：
    *   如果 `freshCount` 为 0，直接返回 0。
    *   开始循环，记录 `minutes`。
    *   每次处理队列中 **当前层** 的所有节点（代表同一分钟内的扩散）。
    *   对于每个出队的橘子，检查上下左右四个邻居：
        *   如果是新鲜橘子 (`1`)：
            *   将其变为腐烂 (`2`)。
            *   `freshCount` 减 1。
            *   将其加入队列（下一分钟它会继续感染别人）。
    *   每处理完一层，`minutes` 加 1。
3.  **结果判断**：
    *   BFS 结束后，如果 `freshCount` 仍然大于 0，说明有橘子无法被感染到（孤岛），返回 -1。
    *   否则返回 `minutes`。

---

## 3. 代码实现

```javascript
/**
 * @param {number[][]} grid
 * @return {number}
 */
var orangesRotting = function(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    
    const queue = [];
    let freshCount = 0;
    
    // 1. 初始化：找到所有腐烂橘子入队，并统计新鲜橘子数量
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 2) {
                queue.push([i, j]);
            } else if (grid[i][j] === 1) {
                freshCount++;
            }
        }
    }
    
    // 如果没有新鲜橘子，直接返回 0
    if (freshCount === 0) return 0;
    
    let minutes = 0;
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    
    // 2. BFS
    while (queue.length > 0 && freshCount > 0) {
        const size = queue.length;
        // 处理当前层 (这一分钟内) 的所有腐烂橘子
        for (let i = 0; i < size; i++) {
            const [r, c] = queue.shift();
            
            for (const [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;
                
                // 边界检查 & 是否是新鲜橘子
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
                    // 感染它
                    grid[nr][nc] = 2;
                    freshCount--;
                    queue.push([nr, nc]);
                }
            }
        }
        // 这一层处理完，时间 + 1
        minutes++;
    }
    
    // 3. 判断是否还有剩余的新鲜橘子
    return freshCount === 0 ? minutes : -1;
};
```

#### 代码执行演示
输入：`[[2,1,1], [1,1,0], [0,1,1]]`

1.  **Init**:
    *   Queue: `[[0,0]]` (value 2)
    *   Fresh: 6
2.  **Minute 1**:
    *   Pop `[0,0]`. Neighbors: `[0,1]` (fresh), `[1,0]` (fresh).
    *   Infect `[0,1]`, `[1,0]`. Fresh: 4. Queue: `[[0,1], [1,0]]`.
    *   Minutes = 1.
3.  **Minute 2**:
    *   Pop `[0,1]`. Neighbors: `[0,2]` (fresh), `[1,1]` (fresh). Infect.
    *   Pop `[1,0]`. Neighbors: `[1,1]` (already 2), `[2,0]` (0 - skip).
    *   Fresh: 2. Queue: `[[0,2], [1,1]]`.
    *   Minutes = 2.
4.  **Minute 3**:
    *   Pop `[0,2]`. Neighbors: `[1,2]` (0 - skip).
    *   Pop `[1,1]`. Neighbors: `[1,2]` (0), `[2,1]` (fresh). Infect `[2,1]`.
    *   Fresh: 1. Queue: `[[2,1]]`.
    *   Minutes = 3.
5.  **Minute 4**:
    *   Pop `[2,1]`. Neighbors: `[2,2]` (fresh). Infect `[2,2]`.
    *   Fresh: 0. Queue: `[[2,2]]`.
    *   Minutes = 4.
6.  **Loop End**: `freshCount` is 0. Loop condition `freshCount > 0` fails (or checking queue in next iter).
    *   Wait, the `while` condition `queue.length > 0 && freshCount > 0` might exit early if freshCount becomes 0 inside the loop? No, freshCount check is at start.
    *   Actually, if I use `while(queue.length)` and check `if(freshCount === 0) return minutes` inside?
    *   My code: `while (queue.length > 0 && freshCount > 0)`.
    *   At end of Minute 4, `freshCount` is 0. Loop condition fails. Returns `minutes` (4). Correct.

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(M \times N)$。每个网格最多入队一次，出队一次。 |
| **空间复杂度** | $O(M \times N)$。队列最坏情况下可能包含所有网格节点。 |
