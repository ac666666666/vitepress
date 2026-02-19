# 二叉树的层序遍历

[LeetCode 官方题目链接](https://leetcode.cn/problems/binary-tree-level-order-traversal/)

## 1. 题目呈现

**难度等级**：🟡 中等  
**核心考察点**：二叉树、广度优先搜索 (BFS)、队列

给你二叉树的根节点 `root` ，返回其节点值的 **层序遍历** 。 （即逐层地，从左到右访问所有节点）。

> **示例 1：**
>
> **输入**：root = [3,9,20,null,null,15,7]  
> **输出**：[[3],[9,20],[15,7]]

> **示例 2：**
>
> **输入**：root = [1]  
> **输出**：[[1]]

> **示例 3：**
>
> **输入**：root = []  
> **输出**：[]

---

## 2. 解题思路拆解

**层序遍历** 就是图论中的 **广度优先搜索 (BFS)**。
我们需要使用一个 **队列 (Queue)** 来辅助遍历。

**算法流程**：
1.  如果根节点为空，返回空数组。
2.  初始化队列 `queue`，将根节点 `root` 入队。
3.  初始化结果数组 `res`。
4.  当队列不为空时，循环执行：
    *   获取当前层的节点数 `levelSize` (即 `queue.length`)。
    *   初始化当前层的结果数组 `currentLevel`。
    *   循环 `levelSize` 次（处理当前层的所有节点）：
        *   队头元素出队 `node`。
        *   将 `node.val` 加入 `currentLevel`。
        *   如果 `node.left` 存在，加入队列。
        *   如果 `node.right` 存在，加入队列。
    *   将 `currentLevel` 加入 `res`。
5.  返回 `res`。

**关键点**：在每一轮循环开始时，记录队列的长度 `levelSize`，这代表了当前层有多少个节点。

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
 * @return {number[][]}
 */
var levelOrder = function(root) {
    if (!root) return [];
    
    const res = [];
    const queue = [root];
    
    while (queue.length > 0) {
        // 记录当前层的节点数量
        // 必须先记录，因为在循环中 queue 的长度会变化
        const levelSize = queue.length;
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift(); // 出队
            currentLevel.push(node.val);
            
            // 左右子节点入队
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        res.push(currentLevel);
    }
    
    return res;
};
```

#### 代码执行演示
输入 `root = [3, 9, 20, null, null, 15, 7]`

1.  Queue: `[3]`.
2.  **Loop 1**:
    *   `levelSize` = 1.
    *   `i=0`: Pop `3`. `currentLevel`=[3]. Push `9`, `20`. Queue: `[9, 20]`.
    *   Add `[3]` to `res`.
3.  **Loop 2**:
    *   `levelSize` = 2.
    *   `i=0`: Pop `9`. `currentLevel`=[9]. No children. Queue: `[20]`.
    *   `i=1`: Pop `20`. `currentLevel`=[9, 20]. Push `15`, `7`. Queue: `[15, 7]`.
    *   Add `[9, 20]` to `res`.
4.  **Loop 3**:
    *   `levelSize` = 2.
    *   `i=0`: Pop `15`. `currentLevel`=[15]. No children. Queue: `[7]`.
    *   `i=1`: Pop `7`. `currentLevel`=[15, 7]. No children. Queue: `[]`.
    *   Add `[15, 7]` to `res`.
5.  Queue empty. Return `[[3], [9, 20], [15, 7]]`.

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(n)$。每个节点进队和出队各一次。 |
| **空间复杂度** | $O(n)$。队列中最多同时存储一层的节点，最坏情况下（完全二叉树底层）大约有 $n/2$ 个节点。 |
