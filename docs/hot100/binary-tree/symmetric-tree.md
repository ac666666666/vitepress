# 对称二叉树

[LeetCode 官方题目链接](https://leetcode.cn/problems/symmetric-tree/)

## 1. 题目呈现

**难度等级**：🟢 简单  
**核心考察点**：二叉树、递归

给你一个二叉树的根节点 `root` ， 检查它是否轴对称。

> **示例 1：**
>
> **输入**：root = [1,2,2,3,4,4,3]  
> **输出**：true

> **示例 2：**
>
> **输入**：root = [1,2,2,null,3,null,3]  
> **输出**：false

---

## 2. 解题思路拆解

**判断对称** 的本质是比较 **左子树** 和 **右子树** 是否是镜像对称的。
这意味着：
1.  根节点无需比较。
2.  左子树的 **左孩子** 必须等于 右子树的 **右孩子**。
3.  左子树的 **右孩子** 必须等于 右子树的 **左孩子**。

### 方法一：递归 (Recursive)

定义一个辅助函数 `isMirror(node1, node2)`，用来判断两棵树是否互为镜像。
*   **终止条件**：
    *   如果两个节点都为 `null`，返回 `true`。
    *   如果只有一个为 `null`，或者两个节点的值不相等，返回 `false`。
*   **递归判断**：
    *   `node1.left` 和 `node2.right` 镜像。
    *   `node1.right` 和 `node2.left` 镜像。
    *   两者都满足才行。

### 方法二：迭代 (Iterative) - 队列

使用队列同时将两个节点入队进行比较。
1.  初始将 `root.left` 和 `root.right` 入队。
2.  每次取出两个节点 `u` 和 `v`。
3.  如果都为空，继续下一轮。
4.  如果一个为空或值不等，返回 `false`。
5.  将 `u.left`, `v.right` 入队（外侧）。
6.  将 `u.right`, `v.left` 入队（内侧）。

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
 * @return {boolean}
 */
var isSymmetric = function(root) {
    if (!root) return true;
    return isMirror(root.left, root.right);
};

function isMirror(node1, node2) {
    // 1. 都为空
    if (node1 === null && node2 === null) return true;
    // 2. 一个为空，或值不等
    if (node1 === null || node2 === null || node1.val !== node2.val) {
        return false;
    }
    // 3. 递归比较：外侧 vs 外侧，内侧 vs 内侧
    return isMirror(node1.left, node2.right) && isMirror(node1.right, node2.left);
}
```

#### 代码执行演示 (递归法)
输入 `root = [1, 2, 2, 3, 4, 4, 3]`

1.  `isSymmetric(1)` -> calls `isMirror(2(left), 2(right))`.
2.  `isMirror(2, 2)`:
    *   Values match (2 == 2).
    *   Check `2(left).left` (3) vs `2(right).right` (3). -> `isMirror(3, 3)` -> true.
    *   Check `2(left).right` (4) vs `2(right).left` (4). -> `isMirror(4, 4)` -> true.
    *   Returns true.
3.  Result: true.

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(n)$。每个节点遍历一次。 |
| **空间复杂度** | $O(h)$。递归栈深度。最坏情况（链状）为 $O(n)$，平均 $O(\log n)$。 |
