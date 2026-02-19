# 二叉树展开为链表

[LeetCode 官方题目链接](https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/)

## 1. 题目呈现

**难度等级**：🟡 中等  
**核心考察点**：二叉树、递归、链表操作、原地算法 (O(1) Space)

给你二叉树的根结点 `root` ，请你将它展开为一个单链表：
*   展开后的单链表应该同样使用 `TreeNode` ，其中 `right` 子指针指向链表中下一个结点，而 `left` 子指针始终为 `null` 。
*   展开后的单链表应该与二叉树 **先序遍历** 顺序相同。

> **示例 1：**
>
> **输入**：root = [1,2,5,3,4,null,6]  
> **输出**：[1,null,2,null,3,null,4,null,5,null,6]
> 
> **转换过程**：
> ```
>     1
>    / \
>   2   5
>  / \   \
> 3   4   6
> ```
> 变为
> ```
> 1
>  \
>   2
>    \
>     3
>      \
>       4
>        \
>         5
>          \
>           6
> ```

> **示例 2：**
>
> **输入**：root = []  
> **输出**：[]

---

## 2. 解题思路拆解

### 方法一：递归 (寻找前驱节点)

对于任意一个节点 `root`，如果它有左子树，我们需要：
1.  将 **左子树** 插入到 `root` 和 `root.right` 之间。
2.  但是直接插入会丢失原来的 `root.right`。
3.  所以，我们需要找到 **左子树中最右边的节点** (即左子树在先序遍历中的最后一个节点)，记为 `predecessor`。
4.  将原来的 `root.right` 接到 `predecessor.right` 上。
5.  将 `root.left` 移动到 `root.right`。
6.  将 `root.left` 置空。
7.  继续处理下一个节点 (`root.right`)。

这种方法类似于 Morris 遍历，空间复杂度为 $O(1)$。

### 方法二：后序遍历 (Right -> Left -> Root) 变形

通常的先序遍历是 Root -> Left -> Right。
如果我们反过来，按照 Right -> Left -> Root 的顺序遍历，我们可以维护一个 `prev` 指针，指向当前链表的头节点。
每次访问一个节点时：
1.  `node.right = prev`
2.  `node.left = null`
3.  `prev = node`
这样从后往前构建，非常简洁，但需要 $O(H)$ 的递归栈空间。

---

## 3. 代码实现

### 方法一：寻找前驱节点 (空间 $O(1)$)

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
 * @return {void} Do not return anything, modify root in-place instead.
 */
var flatten = function(root) {
    let curr = root;
    
    while (curr !== null) {
        if (curr.left !== null) {
            // 1. 找到左子树的最右节点 (前驱节点)
            let next = curr.left;
            let predecessor = next;
            
            while (predecessor.right !== null) {
                predecessor = predecessor.right;
            }
            
            // 2. 将原来的右子树接到前驱节点的右边
            predecessor.right = curr.right;
            
            // 3. 将左子树移到右边
            curr.right = next;
            curr.left = null;
        }
        // 4. 继续处理下一个节点 (现在的右节点)
        curr = curr.right;
    }
};
```

### 方法二：递归 (反向先序)

```javascript
var flatten = function(root) {
    let prev = null;
    
    const postorder = (node) => {
        if (!node) return;
        
        // 顺序：右 -> 左 -> 根
        postorder(node.right);
        postorder(node.left);
        
        // 处理当前节点
        node.right = prev;
        node.left = null;
        
        // 更新 prev
        prev = node;
    };
    
    postorder(root);
};
```

#### 代码执行演示 (方法一)
输入 `root = [1, 2, 5, 3, 4, null, 6]`

1.  `curr` = 1. Has left (2).
2.  Find predecessor of left subtree (2). Rightmost is 4.
3.  Connect 1's old right (5) to 4's right.
    *   Tree structure: 
        ```
          1
         /
        2 - ... - 4 -> 5 -> 6
        ```
4.  Move left (2) to right. `curr.left` = null.
    *   Tree structure:
        ```
        1
         \
          2
         / \
        3   4 -> 5 -> 6
        ```
5.  `curr` moves to 1.right (2).
6.  `curr` = 2. Has left (3).
7.  Predecessor is 3.
8.  Connect 2's old right (4) to 3's right.
    *   Structure: 3 -> 4 -> 5 -> 6
9.  Move left (3) to right.
    *   Structure: 1 -> 2 -> 3 -> 4 -> 5 -> 6.
10. `curr` continues down the chain... 3, 4, 5, 6 have no left child. Done.

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(n)$。每个节点会被访问常数次 (寻找前驱节点时可能会重复遍历，但总体均摊是 $O(n)$)。 |
| **空间复杂度** | 方法一为 $O(1)$ (原地修改)。方法二为 $O(n)$ (递归栈)。 |
