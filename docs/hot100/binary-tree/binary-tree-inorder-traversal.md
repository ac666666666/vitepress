# 二叉树的中序遍历

[LeetCode 官方题目链接](https://leetcode.cn/problems/binary-tree-inorder-traversal/)

## 1. 题目呈现

**难度等级**：🟢 简单  
**核心考察点**：二叉树、遍历 (递归/迭代)

给定一个二叉树的根节点 `head` ，返回 **它的中序遍历** 。

> **示例 1：**
>
> **输入**：root = [1,null,2,3]  
> **输出**：[1,3,2]

> **示例 2：**
>
> **输入**：root = []  
> **输出**：[]

> **示例 3：**
>
> **输入**：root = [1]  
> **输出**：[1]

---

## 2. 解题思路拆解

**中序遍历** 的顺序是：**左子树 -> 根节点 -> 右子树**。

### 方法一：递归 (Recursive)
这是最简单直接的方法。
1.  递归遍历左子树。
2.  访问当前节点（加入结果集）。
3.  递归遍历右子树。

### 方法二：迭代 (Iterative) - 使用栈
模拟递归调用栈的过程。
1.  我们需要一个指针 `curr` 指向当前节点，一个栈 `stack` 用来暂存节点。
2.  **向左走到尽头**：只要 `curr` 不为空，就将 `curr` 入栈，并让 `curr = curr.left`。
3.  **弹出并访问**：当 `curr` 为空（左边没路了），说明栈顶节点及其左子树已处理完（或为空），弹出栈顶元素作为当前节点，加入结果集。
4.  **转向右边**：让 `curr = curr.right`，准备处理右子树。
5.  重复上述过程，直到 `curr` 为空且 `stack` 为空。

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
 * @return {number[]}
 */
var inorderTraversal = function(root) {
    const res = [];
    const inorder = (node) => {
        if (!node) return;
        inorder(node.left);  // 左
        res.push(node.val);  // 根
        inorder(node.right); // 右
    };
    inorder(root);
    return res;
};
```

### 迭代法 (栈)

```javascript
var inorderTraversal = function(root) {
    const res = [];
    const stack = [];
    let curr = root;
    
    while (curr !== null || stack.length > 0) {
        // 1. 一直向左走，沿途入栈
        while (curr !== null) {
            stack.push(curr);
            curr = curr.left;
        }
        
        // 2. 左边走到头了，弹出栈顶
        curr = stack.pop();
        
        // 3. 访问节点
        res.push(curr.val);
        
        // 4. 转向右子树
        curr = curr.right;
    }
    
    return res;
};
```

#### 代码执行演示 (迭代法)
输入 `root = [1, null, 2, 3]` (1 的右是 2, 2 的左是 3)
结构：
```
  1
   \
    2
   /
  3
```

1.  `curr` = 1.
2.  Inner while:
    *   Push 1. Stack: `[1]`. `curr` -> `null` (1.left).
3.  Pop `1`. Stack: `[]`. Res: `[1]`.
4.  `curr` -> `2` (1.right).
5.  Loop continues (curr is 2).
6.  Inner while:
    *   Push 2. Stack: `[2]`. `curr` -> `3` (2.left).
    *   Push 3. Stack: `[2, 3]`. `curr` -> `null` (3.left).
7.  Pop `3`. Stack: `[2]`. Res: `[1, 3]`.
8.  `curr` -> `null` (3.right).
9.  Loop continues (stack not empty).
10. Inner while: `curr` is null, skip.
11. Pop `2`. Stack: `[]`. Res: `[1, 3, 2]`.
12. `curr` -> `null` (2.right).
13. Loop ends. Return `[1, 3, 2]`.

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(n)$。每个节点被访问一次。 |
| **空间复杂度** | $O(h)$。$h$ 是树的高度。递归调用栈或迭代栈的深度。最坏情况（链状）为 $O(n)$，平均情况为 $O(\log n)$。 |
