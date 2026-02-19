# 二叉树中的最大路径和

[LeetCode 官方题目链接](https://leetcode.cn/problems/binary-tree-maximum-path-sum/)

## 1. 题目呈现

**难度等级**：🔴 困难  
**核心考察点**：二叉树、深度优先搜索 (DFS)、递归

被定义为一条从树中任意节点出发，沿父节点-子节点连接，达到任意节点的序列。同一个节点在一条路径序列中 **至多出现一次** 。该路径 **至少包含一个** 节点，且不一定经过根节点。

**路径和** 是路径中各节点值的总和。

给你一个二叉树的根节点 `root` ，返回其 **最大路径和** 。

> **示例 1：**
>
> **输入**：root = [1,2,3]  
> **输出**：6  
> **解释**：最优路径是 2 -> 1 -> 3 ，路径和为 2 + 1 + 3 = 6

> **示例 2：**
>
> **输入**：root = [-10,9,20,null,null,15,7]  
> **输出**：42  
> **解释**：最优路径是 15 -> 20 -> 7 ，路径和为 15 + 20 + 7 = 42

---

## 2. 解题思路拆解

这道题的关键在于理解 **路径** 的定义：它可以是 "左子树 -> 根 -> 右子树" 这样的拱形结构，但在递归函数中，我们返回给父节点的只能是 "单边" 的最大贡献。

1.  **定义递归函数 `maxGain(node)`**：
    *   计算以 `node` 为起点，向下延伸的 **最大单边路径和**。
    *   如果子树的路径和为负数，我们应该忽略它（即贡献为 0），因为加上负数只会让总和变小。

2.  **在递归过程中更新全局最大值**：
    *   对于当前节点 `node`，经过它的 **最大路径和** (拱形) = `node.val` + `max(0, leftGain)` + `max(0, rightGain)`。
    *   我们用这个值来更新全局最大值 `maxSum`。

3.  **返回值**：
    *   返回给父节点的必须是单边路径：`node.val` + `max(leftGain, rightGain)`。

---

## 3. 代码实现

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxPathSum = function(root) {
    let maxSum = -Infinity;
    
    const maxGain = (node) => {
        if (!node) return 0;
        
        // 1. 递归计算左右子树的最大单边贡献
        // 如果子树贡献为负，则舍弃 (取 0)
        const leftGain = Math.max(maxGain(node.left), 0);
        const rightGain = Math.max(maxGain(node.right), 0);
        
        // 2. 计算当前节点作为“拱顶”时的路径和
        // 这是当前子树内部可能产生的最大路径
        const priceNewPath = node.val + leftGain + rightGain;
        
        // 3. 更新全局最大值
        maxSum = Math.max(maxSum, priceNewPath);
        
        // 4. 返回当前节点能提供给父节点的最大单边贡献
        // 只能选一边 (左或右) + 自己
        return node.val + Math.max(leftGain, rightGain);
    };
    
    maxGain(root);
    return maxSum;
};
```

#### 代码执行演示
输入 `root = [-10, 9, 20, null, null, 15, 7]`

1.  `maxGain(-10)`:
    *   Left: `maxGain(9)` -> `leftGain` = 9. `maxSum` updated to 9. Returns 9.
    *   Right: `maxGain(20)`:
        *   Left: `maxGain(15)` -> Returns 15. `maxSum` updated to 15.
        *   Right: `maxGain(7)` -> Returns 7.
        *   `priceNewPath` (at 20) = 20 + 15 + 7 = 42. `maxSum` updated to 42.
        *   Returns 20 + max(15, 7) = 35.
    *   Back at -10:
        *   `leftGain` = 9.
        *   `rightGain` = 35.
        *   `priceNewPath` = -10 + 9 + 35 = 34.
        *   `maxSum` remains 42 (since 42 > 34).
        *   Returns -10 + 35 = 25.
2.  Final result: 42.

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(n)$。每个节点访问一次。 |
| **空间复杂度** | $O(h)$。递归栈深度。 |
