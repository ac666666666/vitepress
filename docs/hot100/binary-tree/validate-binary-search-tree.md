# 验证二叉搜索树

[LeetCode 官方题目链接](https://leetcode.cn/problems/validate-binary-search-tree/)

## 1. 题目呈现

**难度等级**：🟡 中等  
**核心考察点**：二叉搜索树 (BST)、递归、中序遍历

给你一个二叉树的根节点 `root` ，判断其是否是一个有效的二叉搜索树。

**有效 二叉搜索树**定义如下：
*   节点的左子树只包含 **小于** 当前节点的数。
*   节点的右子树只包含 **大于** 当前节点的数。
*   所有左子树和右子树自身必须也是二叉搜索树。

> **示例 1：**
>
> **输入**：root = [2,1,3]  
> **输出**：true

> **示例 2：**
>
> **输入**：root = [5,1,4,null,null,3,6]  
> **输出**：false  
> **解释**：根节点的值是 5 ，但是右子节点的值是 4 。

---

## 2. 解题思路拆解

### 方法一：递归 (区间限定)

仅判断 `root.left.val < root.val` 和 `root.right.val > root.val` 是不够的。
**关键点**：右子树中的 **所有** 节点都必须大于根节点，左子树中的 **所有** 节点都必须小于根节点。

我们需要在递归时传递一个 **合法区间 `(min, max)`**。
*   对于根节点，区间是 `(-inf, +inf)`。
*   向左递归时，上界变为 `root.val`，即 `(min, root.val)`。
*   向右递归时，下界变为 `root.val`，即 `(root.val, max)`。
*   如果当前节点值不在区间内，返回 `false`。

### 方法二：中序遍历

二叉搜索树的 **中序遍历** 结果一定是一个 **严格递增** 的序列。
我们可以进行中序遍历，并记录 **前一个节点的值 `pre`**。
*   如果当前节点的值 `<= pre`，说明不是 BST。
*   更新 `pre` 为当前节点值。

---

## 3. 代码实现

### 方法一：递归 (区间限定)

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
var isValidBST = function(root) {
    
    const validate = (node, min, max) => {
        if (!node) return true;
        
        // 当前节点必须在 (min, max) 之间
        if (node.val <= min || node.val >= max) {
            return false;
        }
        
        // 递归检查左右子树
        // 左子树：上界变为 node.val
        // 右子树：下界变为 node.val
        return validate(node.left, min, node.val) && 
               validate(node.right, node.val, max);
    };
    
    return validate(root, -Infinity, Infinity);
};
```

### 方法二：中序遍历

```javascript
var isValidBST = function(root) {
    let pre = -Infinity;
    
    // 中序遍历生成器或递归
    // 为了方便提前返回 false，我们可以写一个带有返回值的递归
    const inorder = (node) => {
        if (!node) return true;
        
        // 1. 左
        if (!inorder(node.left)) return false;
        
        // 2. 根：检查是否严格递增
        if (node.val <= pre) return false;
        pre = node.val;
        
        // 3. 右
        return inorder(node.right);
    };
    
    return inorder(root);
};
```

#### 代码执行演示 (区间法)
输入 `root = [5, 1, 4, null, null, 3, 6]`

1.  `validate(5, -inf, inf)`:
    *   Val 5 is OK.
    *   Left: `validate(1, -inf, 5)` -> OK.
        *   Left/Right null -> True.
    *   Right: `validate(4, 5, inf)` -> **False**!
        *   4 is not > 5 (min).
    *   Return False.

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(n)$。每个节点访问一次。 |
| **空间复杂度** | $O(h)$。递归栈深度。 |
