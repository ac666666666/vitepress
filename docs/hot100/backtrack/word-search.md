# 单词搜索

## 1. 题目呈现

[LeetCode 79. Word Search](https://leetcode.com/problems/word-search/)

给定一个 `m x n` 二维字符网格 `board` 和一个字符串单词 `word` 。如果 `word` 存在于网格中，返回 `true` ；否则，返回 `false` 。

单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。

**示例 1：**

![word2](https://assets.leetcode.com/uploads/2020/11/04/word2.jpg)

```
输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
输出：true
```

**示例 2：**

![word-1](https://assets.leetcode.com/uploads/2020/11/04/word-1.jpg)

```
输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"
输出：true
```

**示例 3：**

![word3](https://assets.leetcode.com/uploads/2020/10/15/word3.jpg)

```
输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"
输出：false
```

## 2. 思路拆解

这道题是典型的**回溯算法 (Backtracking)** 应用场景，通常结合 **DFS (深度优先搜索)** 来实现。

**核心思想**：
1.  **遍历起点**：因为单词可能从网格中的任意一个位置开始，所以我们需要遍历网格中的每一个点 `(i, j)` 作为起点，尝试进行搜索。
2.  **DFS 递归搜索**：
    -   从当前点 `(r, c)` 开始，判断该点字符是否匹配单词的当前字符 `word[index]`。
    -   如果匹配，并且已经匹配到了单词的最后一个字符，说明找到了，返回 `true`。
    -   如果匹配但还没结束，就继续向上下左右四个方向递归搜索单词的下一个字符 `word[index + 1]`。
3.  **回溯与状态重置**：
    -   为了防止在一次搜索路径中重复使用同一个单元格，我们需要标记当前路径已经访问过的节点。
    -   一种节省空间的方法是直接修改 `board` 数组，例如将当前字符暂时改为特殊字符（如 `'#'`）。
    -   当递归返回（无论是找到还是没找到）时，需要将该位置的字符恢复原状（回溯），以便其他路径搜索时可以使用。

**剪枝与优化**：
-   越界检查：`r < 0 || r >= rows || c < 0 || c >= cols`。
-   字符不匹配：`board[r][c] !== word[index]`。
-   已访问检查：如果我们将访问过的字符修改为 `#`，那么 `board[r][c] !== word[index]` 这个判断也会自动覆盖已访问的情况（因为 `#` 不会等于 `word` 中的任何有效字符）。

## 3. 代码实现

```javascript
/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function(board, word) {
    const rows = board.length;
    const cols = board[0].length;
    
    // DFS 函数
    // r, c: 当前网格坐标
    // index: 当前匹配到 word 的第几个字符
    const dfs = (r, c, index) => {
        // 终止条件：如果 index 已经等于 word 长度，说明所有字符都匹配成功
        if (index === word.length) {
            return true;
        }
        
        // 边界检查：越界
        if (r < 0 || r >= rows || c < 0 || c >= cols) {
            return false;
        }
        
        // 匹配检查：当前格子字符不等于目标字符（包括已被标记访问的情况）
        if (board[r][c] !== word[index]) {
            return false;
        }
        
        // 标记当前格子为已访问 (用特殊字符占位)
        const temp = board[r][c];
        board[r][c] = '#';
        
        // 递归向四个方向搜索
        // 只要有一个方向能走通，就返回 true
        const found = dfs(r + 1, c, index + 1) ||
                      dfs(r - 1, c, index + 1) ||
                      dfs(r, c + 1, index + 1) ||
                      dfs(r, c - 1, index + 1);
        
        // 回溯：恢复当前格子字符
        board[r][c] = temp;
        
        return found;
    };
    
    // 遍历每一个格子作为起点
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            // 如果从 (i, j) 出发能找到单词，直接返回 true
            if (dfs(i, j, 0)) {
                return true;
            }
        }
    }
    
    return false;
};
```

## 4. 运行结果

```javascript
const board = [
    ["A","B","C","E"],
    ["S","F","C","S"],
    ["A","D","E","E"]
];
console.log(exist(board, "ABCCED")); // true
console.log(exist(board, "SEE"));    // true
console.log(exist(board, "ABCB"));   // false
```

## 5. 复杂度分析

-   **时间复杂度**：$O(M \times N \times 3^L)$。
    -   $M, N$ 是网格的长宽。
    -   $L$ 是字符串 `word` 的长度。
    -   我们需要遍历 $M \times N$ 个起点。
    -   对于每个起点，DFS 的深度最大为 $L$。在搜索树中，除了第一次有 4 个分支，后续由于不能回头，最多只有 3 个分支。所以每次搜索的复杂度约为 $3^L$。
-   **空间复杂度**：$O(L)$。
    -   主要消耗在递归调用栈的空间，最大深度为单词长度 $L$。
    -   如果考虑修改 `board` 数组是原地操作，不需要额外的 visited 数组空间。
