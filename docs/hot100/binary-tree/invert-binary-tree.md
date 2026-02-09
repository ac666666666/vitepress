# 翻转二叉树

## 1. 题目呈现

**难度等级**：🟢 简单  
**核心考察点**：二叉树、递归

给你一棵二叉树的根节点 `root` ，翻转这棵二叉树，并返回其根节点。

> **示例 1：**
>
> **输入**：root = [4,2,7,1,3,6,9]  
> **输出**：[4,7,2,9,6,3,1]

> **示例 2：**
>
> **输入**：root = [2,1,3]  
> **输出**：[2,3,1]

> **示例 3：**
>
> **输入**：root = []  
> **输出**：[]

---

## 2. 解题思路拆解

**翻转** 的意思是：对于树中的每一个节点，交换它的左右子树。

### 方法一：递归 (DFS)

这是一个非常经典的递归问题。
1.  **终止条件**：如果当前节点 `root` 为 `null`，直接返回 `null`。
2.  **递归操作**：
    *   递归翻转左子树：`invertTree(root.left)`。
    *   递归翻转右子树：`invertTree(root.right)`。
3.  **当前层操作**：交换 `root.left` 和 `root.right`。
4.  **返回值**：返回 `root`。

### 方法二：迭代 (BFS/DFS)

我们可以使用队列（层序遍历）或栈来模拟递归。
以队列为例：
1.  根节点入队。
2.  当队列不为空时：
    *   出队一个节点 `curr`。
    *   交换 `curr` 的左右子节点。
    *   如果 `curr.left` 存在，入队。
    *   如果 `curr.right` 存在，入队。

---

## 3. 代码实现

### 递归法 (推荐)

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
 * @return {TreeNode}
 */
var invertTree = function(root) {
    if (root === null) {
        return null;
    }
    
    // 递归翻转左右子树
    const left = invertTree(root.left);
    const right = invertTree(root.right);
    
    // 交换
    root.left = right;
    root.right = left;
    
    return root;
};
```

#### 代码执行演示 (递归法)
输入 `root = [2, 1, 3]`

1.  `invertTree(2)`:
    *   Call `invertTree(1)` (Left Child).
        *   `invertTree(1)` calls `invertTree(null)` -> returns null.
        *   `invertTree(1)` calls `invertTree(null)` -> returns null.
        *   Swap null and null. `1` remains `1` (no children).
        *   Return `1`.
    *   Call `invertTree(3)` (Right Child).
        *   Similar logic. Return `3`.
    *   Swap `2.left` (was 1, now becomes 3) and `2.right` (was 3, now becomes 1).
    *   `2` -> left is `3`, right is `1`.
    *   Return `2`.

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(n)$。每个节点都被访问一次，并且交换操作是常数时间的。 |
| **空间复杂度** | $O(h)$。递归调用栈的深度，等于树的高度。 |
