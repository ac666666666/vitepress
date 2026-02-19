# 二叉树的最大深度

[LeetCode 官方题目链接](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)

## 1. 题目呈现

**难度等级**：🟢 简单  
**核心考察点**：二叉树、递归

给定一个二叉树，找出其最大深度。

二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。

**说明**：叶子节点是指没有子节点的节点。

> **示例 1：**
>
> **输入**：root = [3,9,20,null,null,15,7]  
> **输出**：3

> **示例 2：**
>
> **输入**：root = [1,null,2]  
> **输出**：2

---

## 2. 解题思路拆解

这道题是递归的经典入门题。

### 方法一：递归 (DFS)

一个树的最大深度等于：
`max(左子树深度, 右子树深度) + 1`

1.  **终止条件**：如果 `root` 为 `null`，深度为 0。
2.  **递归**：
    *   计算左子树深度 `l`。
    *   计算右子树深度 `r`。
3.  **返回**：`max(l, r) + 1`。

### 方法二：迭代 (BFS) - 层序遍历

使用层序遍历（队列），每遍历一层，深度 `ans` 加 1。
直到队列为空，返回 `ans`。

---

## 3. 代码实现

### 递归法

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
var maxDepth = function(root) {
    if (root === null) {
        return 0;
    }
    
    const leftDepth = maxDepth(root.left);
    const rightDepth = maxDepth(root.right);
    
    return Math.max(leftDepth, rightDepth) + 1;
};
```

#### 代码执行演示 (递归法)
输入 `root = [3, 9, 20, null, null, 15, 7]`

1.  `maxDepth(3)`:
    *   Left: `maxDepth(9)`.
        *   Left: `maxDepth(null)` -> 0.
        *   Right: `maxDepth(null)` -> 0.
        *   Return `max(0, 0) + 1` = 1.
    *   Right: `maxDepth(20)`.
        *   Left: `maxDepth(15)` -> ... -> 1.
        *   Right: `maxDepth(7)` -> ... -> 1.
        *   Return `max(1, 1) + 1` = 2.
    *   Return `max(1, 2) + 1` = 3.

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(n)$。每个节点访问一次。 |
| **空间复杂度** | $O(h)$。递归栈的深度。最坏情况 $O(n)$，平均 $O(\log n)$。 |
