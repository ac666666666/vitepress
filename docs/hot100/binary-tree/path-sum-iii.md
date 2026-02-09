# 路径总和 III

## 1. 题目呈现

**难度等级**：🟡 中等  
**核心考察点**：二叉树、深度优先搜索 (DFS)、前缀和 (Prefix Sum)、哈希表

给定一个二叉树的根节点 `root` ，和一个整数 `targetSum` ，求该二叉树里节点值之和等于 `targetSum` 的 **路径** 的数目。

**路径** 不需要从根节点开始，也不需要在叶子节点结束，但是路径方向必须是向下的（只能从父节点到子节点）。

> **示例 1：**
>
> **输入**：root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8  
> **输出**：3  
> **解释**：和等于 8 的路径有 3 条，如图所示。
> ```
>       10
>      /  \
>     5   -3
>    / \    \
>   3   2   11
>  / \   \
> 3  -2   1
> ```
> 路径：
> 1.  5 -> 3
> 2.  5 -> 2 -> 1
> 3.  -3 -> 11

> **示例 2：**
>
> **输入**：root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22  
> **输出**：3

---

## 2. 解题思路拆解

### 方法一：双重递归 (暴力法)

1.  定义一个函数 `pathSumFrom(root, sum)`：计算以 `root` 为起点，和为 `sum` 的路径数量。
2.  主函数 `pathSum(root, sum)`：
    *   以当前 `root` 为起点的路径数量。
    *   + `pathSum(root.left, sum)` (递归左子树)
    *   + `pathSum(root.right, sum)` (递归右子树)

这种方法会重复计算很多路径，时间复杂度较高 $O(N^2)$。

### 方法二：前缀和 (Prefix Sum) + 哈希表 (优化)

我们可以借鉴 **两数之和** 或 **和为 K 的子数组** 的思想。

1.  **前缀和**：从根节点到当前节点的路径上所有节点值之和。
2.  我们想要找一段路径的和等于 `targetSum`，即 `prefixSum[curr] - prefixSum[ancestor] = targetSum`。
3.  变形得：`prefixSum[ancestor] = prefixSum[curr] - targetSum`。
4.  我们可以维护一个 **哈希表 (Map)**，记录从根节点出发的路径上，出现过的前缀和及其次数。
5.  在 DFS 遍历时：
    *   计算当前节点的前缀和 `currSum`。
    *   查找 Map 中是否存在 `currSum - targetSum`。如果存在，说明找到了对应数量的路径。
    *   将 `currSum` 存入 Map（次数 +1）。
    *   递归左右子树。
    *   **回溯**：递归返回时，将 `currSum` 从 Map 中移除（次数 -1），因为该路径只在当前子树有效，不能影响其他分支。

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
 * @param {number} targetSum
 * @return {number}
 */
var pathSum = function(root, targetSum) {
    // Map: 前缀和 -> 该前缀和出现的次数
    const prefixMap = new Map();
    // 初始化：前缀和为 0 出现 1 次 (相当于什么都不选，或者路径从根节点开始的情况)
    prefixMap.set(0, 1);
    
    let count = 0;
    
    const dfs = (node, currSum) => {
        if (!node) return;
        
        // 1. 更新当前路径的前缀和
        currSum += node.val;
        
        // 2. 核心公式：寻找是否存在历史前缀和 = currSum - targetSum
        // 如果存在，说明中间有一段路径的和为 targetSum
        const oldSum = currSum - targetSum;
        if (prefixMap.has(oldSum)) {
            count += prefixMap.get(oldSum);
        }
        
        // 3. 将当前前缀和加入 Map
        prefixMap.set(currSum, (prefixMap.get(currSum) || 0) + 1);
        
        // 4. 递归子树
        dfs(node.left, currSum);
        dfs(node.right, currSum);
        
        // 5. 回溯：离开当前节点时，需要把当前前缀和移除
        // 这样才不会影响其他分支 (比如右子树不应该看到左子树的前缀和)
        prefixMap.set(currSum, prefixMap.get(currSum) - 1);
    };
    
    dfs(root, 0);
    return count;
};
```

#### 代码执行演示
输入 `root = [10, 5, -3, 3, 2, null, 11, 3, -2, null, 1]`, `target = 8`
`Map = {0: 1}`

1.  `dfs(10, 0)` -> `currSum` = 10. `oldSum` = 10-8 = 2. Map has 2? No. `Map = {0:1, 10:1}`.
    *   Left: `dfs(5, 10)` -> `currSum` = 15. `oldSum` = 15-8 = 7. Map has 7? No. `Map = {..., 15:1}`.
        *   Left: `dfs(3, 15)` -> `currSum` = 18. `oldSum` = 10. Map has 10? Yes (1). **Count += 1**. (Path: 5->3). `Map={..., 18:1}`.
            *   Left: `dfs(3, 18)` -> `currSum` = 21. `oldSum` = 13. No.
            *   Right: `dfs(-2, 18)` -> `currSum` = 16. `oldSum` = 8. No.
        *   Right: `dfs(2, 15)` -> `currSum` = 17. `oldSum` = 9. No. `Map={..., 17:1}`.
            *   Right: `dfs(1, 17)` -> `currSum` = 18. `oldSum` = 10. Map has 10? Yes (1). **Count += 1**. (Path: 5->2->1).
    *   Right: `dfs(-3, 10)` -> `currSum` = 7. `oldSum` = -1. No. `Map={..., 7:1}`.
        *   Right: `dfs(11, 7)` -> `currSum` = 18. `oldSum` = 10. Map has 10? Yes (1). **Count += 1**. (Path: -3->11).

Total Count = 3.

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(n)$。每个节点只被遍历一次。Map 的操作是 $O(1)$ 的。 |
| **空间复杂度** | $O(n)$。递归栈深度以及 Map 存储的前缀和数量。 |
