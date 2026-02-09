# 二叉树的最近公共祖先

## 1. 题目呈现

**难度等级**：🟡 中等  
**核心考察点**：二叉树、深度优先搜索 (DFS)、递归

给定一个二叉树, 找到该树中两个指定节点的最近公共祖先 (LCA)。

**最近公共祖先** 的定义：“对于有根树 T 的两个节点 p、q，最近公共祖先表示为一个节点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（**一个节点也可以是它自己的祖先**）。”

> **示例 1：**
>
> **输入**：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1  
> **输出**：3  
> **解释**：节点 5 和节点 1 的最近公共祖先是节点 3 。

> **示例 2：**
>
> **输入**：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4  
> **输出**：5  
> **解释**：节点 5 和节点 4 的最近公共祖先是节点 5 。因为根据定义最近公共祖先节点可以为节点本身。

---

## 2. 解题思路拆解

我们可以使用 **后序遍历 (DFS)** 的思想。

对于当前节点 `root`：
1.  **终止条件**：
    *   如果 `root` 为 `null`，返回 `null`。
    *   如果 `root` 等于 `p` 或 `q`，说明我们找到了其中一个，返回 `root`。

2.  **递归搜索**：
    *   在左子树中搜索 `p` 或 `q`，结果记为 `left`。
    *   在右子树中搜索 `p` 或 `q`，结果记为 `right`。

3.  **判断逻辑**：
    *   **情况 1**：`left` 和 `right` 都不为空。
        *   说明 `p` 和 `q` 分别在 `root` 的左右两侧。
        *   那么 `root` 就是最近公共祖先。
        *   返回 `root`。
    *   **情况 2**：只有 `left` 不为空。
        *   说明 `p` 和 `q` 都在左子树中（或者只找到了其中一个，另一个在它的子树里）。
        *   返回 `left`。
    *   **情况 3**：只有 `right` 不为空。
        *   说明 `p` 和 `q` 都在右子树中。
        *   返回 `right`。
    *   **情况 4**：都为空。
        *   没找到。
        *   返回 `null`。

---

## 3. 代码实现

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function(root, p, q) {
    // 1. 终止条件
    if (root === null || root === p || root === q) {
        return root;
    }
    
    // 2. 递归搜索左右子树
    const left = lowestCommonAncestor(root.left, p, q);
    const right = lowestCommonAncestor(root.right, p, q);
    
    // 3. 根据结果判断
    
    // 如果左右都找到了，说明 root 是 LCA
    if (left !== null && right !== null) {
        return root;
    }
    
    // 如果只找到左边，说明 LCA 在左边 (或者 p/q 都在左边)
    if (left !== null) {
        return left;
    }
    
    // 如果只找到右边
    if (right !== null) {
        return right;
    }
    
    // 都没找到
    return null;
};
```

#### 代码执行演示
输入 `root = [3, 5, 1, ...]`, `p = 5`, `q = 1`

1.  `LCA(3)`:
    *   `LCA(3.left=5)`:
        *   `root` (5) == `p` (5). **Return 5**.
    *   `LCA(3.right=1)`:
        *   `root` (1) == `q` (1). **Return 1**.
    *   `left` = 5, `right` = 1.
    *   Both not null. **Return 3**.

输入 `root = [3, 5, 1, ...]`, `p = 5`, `q = 4` (Assume 4 is in 5's subtree)

1.  `LCA(3)`:
    *   `LCA(3.left=5)`:
        *   `root` (5) == `p` (5). **Return 5**. (Notice we don't even search 4 inside 5's subtree, which is correct because if 5 is ancestor of 4, then 5 is the LCA).
    *   `LCA(3.right=1)`:
        *   Search... returns null (neither 5 nor 4 is here).
    *   `left` = 5, `right` = null.
    *   **Return 5**.

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(n)$。最坏情况下需要遍历所有节点。 |
| **空间复杂度** | $O(n)$。递归栈的最大深度 (退化为链表时)。 |
