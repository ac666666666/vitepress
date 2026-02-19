# 将有序数组转换为二叉搜索树

[LeetCode 官方题目链接](https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/)

## 1. 题目呈现

**难度等级**：🟢 简单  
**核心考察点**：二叉搜索树 (BST)、递归、分治

给你一个整数数组 `nums` ，其中元素已经按 **升序** 排列，请你将其转换为一棵 **高度平衡** 二叉搜索树。

**高度平衡** 二叉树是一棵满足「每个节点的左右两个子树的高度差的绝对值不超过 1 」的二叉树。

> **示例 1：**
>
> **输入**：nums = [-10,-3,0,5,9]  
> **输出**：[0,-3,9,-10,null,5]  
> (注：[0,-10,5,null,-3,null,9] 也是被接受的答案)

> **示例 2：**
>
> **输入**：nums = [1,3]  
> **输出**：[3,1]  
> (注：[1,null,3] 也是被接受的答案)

---

## 2. 解题思路拆解

要构建一棵 **高度平衡** 的 **二叉搜索树 (BST)**，最好的方法是总是选择 **中间位置** 的元素作为根节点。

1.  **根节点**：数组中间的元素 `nums[mid]`。
2.  **左子树**：由 `mid` 左边的子数组 `nums[left...mid-1]` 递归构建。
3.  **右子树**：由 `mid` 右边的子数组 `nums[mid+1...right]` 递归构建。

由于每次都是取中间元素，左右子树的节点数量差不会超过 1，因此构建出的树一定是高度平衡的。

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
 * @param {number[]} nums
 * @return {TreeNode}
 */
var sortedArrayToBST = function(nums) {
    
    const build = (left, right) => {
        if (left > right) {
            return null;
        }
        
        // 选择中间位置作为根节点
        // Math.floor((left + right) / 2) 也可以
        // 防止溢出的写法：left + Math.floor((right - left) / 2)
        const mid = Math.floor((left + right) / 2);
        
        const root = new TreeNode(nums[mid]);
        
        // 递归构建左子树
        root.left = build(left, mid - 1);
        
        // 递归构建右子树
        root.right = build(mid + 1, right);
        
        return root;
    };
    
    return build(0, nums.length - 1);
};
```

#### 代码执行演示
输入 `nums = [-10, -3, 0, 5, 9]`

1.  `build(0, 4)`:
    *   `mid` = 2. `nums[2]` = 0. Root is 0.
    *   Left: `build(0, 1)`:
        *   `mid` = 0. `nums[0]` = -10. Root is -10.
        *   Left: `build(0, -1)` -> null.
        *   Right: `build(1, 1)`:
            *   `mid` = 1. `nums[1]` = -3. Root is -3.
            *   Left: `build(1, 0)` -> null.
            *   Right: `build(2, 1)` -> null.
            *   Return Node(-3).
        *   Return Node(-10) with right child -3.
    *   Right: `build(3, 4)`:
        *   `mid` = 3. `nums[3]` = 5. Root is 5.
        *   Left: `build(3, 2)` -> null.
        *   Right: `build(4, 4)`:
            *   `mid` = 4. `nums[4]` = 9. Root is 9.
            *   Return Node(9).
        *   Return Node(5) with right child 9.
    *   Result: Root(0), Left(-10 -> R(-3)), Right(5 -> R(9)).
    *   (Note: The structure might vary slightly depending on floor/ceil of mid, but it's valid).

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(n)$。每个元素被访问一次用来创建节点。 |
| **空间复杂度** | $O(\log n)$。递归调用栈的深度。因为是平衡树，深度为 $\log n$。 |
