# 从前序与中序遍历序列构造二叉树

[LeetCode 官方题目链接](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

## 1. 题目呈现

**难度等级**：🟡 中等  
**核心考察点**：二叉树、递归、分治

给定两个整数数组 `preorder` 和 `inorder` ，其中 `preorder` 是二叉树的 **前序遍历**， `inorder` 是同一棵树的 **中序遍历**，请构造二叉树并返回其根节点。

> **示例 1：**
>
> **输入**：preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]  
> **输出**：[3,9,20,null,null,15,7]

> **示例 2：**
>
> **输入**：preorder = [-1], inorder = [-1]  
> **输出**：[-1]

---

## 2. 解题思路拆解

**前序遍历** 的特点：`[ 根节点 | 左子树 | 右子树 ]`
**中序遍历** 的特点：`[ 左子树 | 根节点 | 右子树 ]`

利用这两个特点，我们可以递归地构造二叉树：

1.  **确定根节点**：`preorder` 的第一个元素一定是当前的根节点。
2.  **寻找分割点**：在 `inorder` 中找到这个根节点的位置 `index`。
3.  **划分左右子树**：
    *   **中序**：`index` 左边的部分是左子树，右边的部分是右子树。
    *   **前序**：根节点后面紧跟着的是左子树（长度等于中序左子树长度），再后面是右子树。
4.  **递归构造**：分别对左子树和右子树重复上述过程。

**优化**：
在 `inorder` 中查找根节点位置时，可以使用 **哈希表 (Map)** 预处理，将 `值 -> 索引` 存起来，这样查找操作就是 $O(1)$ 的。

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
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function(preorder, inorder) {
    // 使用 Map 存储中序遍历的索引，以便 O(1) 查找
    const indexMap = new Map();
    for (let i = 0; i < inorder.length; i++) {
        indexMap.set(inorder[i], i);
    }

    // 递归函数
    // preStart, preEnd: 当前子树在前序数组中的范围
    // inStart, inEnd: 当前子树在中序数组中的范围
    const build = (preStart, preEnd, inStart, inEnd) => {
        if (preStart > preEnd) return null;

        // 1. 根节点的值是前序遍历的第一个
        const rootVal = preorder[preStart];
        const root = new TreeNode(rootVal);

        // 2. 在中序遍历中找到根节点的位置
        const rootIndex = indexMap.get(rootVal);

        // 3. 计算左子树的大小
        const leftSize = rootIndex - inStart;

        // 4. 递归构建左子树
        // 前序范围：[preStart + 1, preStart + leftSize]
        // 中序范围：[inStart, rootIndex - 1]
        root.left = build(preStart + 1, preStart + leftSize, inStart, rootIndex - 1);

        // 5. 递归构建右子树
        // 前序范围：[preStart + leftSize + 1, preEnd]
        // 中序范围：[rootIndex + 1, inEnd]
        root.right = build(preStart + leftSize + 1, preEnd, rootIndex + 1, inEnd);

        return root;
    };

    return build(0, preorder.length - 1, 0, inorder.length - 1);
};
```

#### 代码执行演示
`preorder = [3,9,20,15,7]`, `inorder = [9,3,15,20,7]`
Map: `{9:0, 3:1, 15:2, 20:3, 7:4}`

1.  `build(0, 4, 0, 4)`:
    *   Root val = `preorder[0]` = 3.
    *   `rootIndex` = `map.get(3)` = 1.
    *   `leftSize` = 1 - 0 = 1.
    *   Left: `build(1, 1, 0, 0)` -> `preorder[1]`=9. (Leaf 9).
    *   Right: `build(2, 4, 2, 4)`:
        *   Root val = `preorder[2]` = 20.
        *   `rootIndex` = `map.get(20)` = 3.
        *   `leftSize` = 3 - 2 = 1.
        *   Left: `build(3, 3, 2, 2)` -> `preorder[3]`=15. (Leaf 15).
        *   Right: `build(4, 4, 4, 4)` -> `preorder[4]`=7. (Leaf 7).
        *   Return Node(20) with left=15, right=7.
    *   Return Node(3) with left=9, right=20(...).

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(n)$。构建 Map 需要 $O(n)$，递归构建每个节点访问一次，且查找索引是 $O(1)$。 |
| **空间复杂度** | $O(n)$。Map 存储需要 $O(n)$，递归栈深度最坏 $O(n)$，平均 $O(\log n)$。 |
