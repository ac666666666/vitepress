# 二叉树的右视图

[LeetCode 官方题目链接](https://leetcode.cn/problems/binary-tree-right-side-view/)

## 1. 题目呈现

**难度等级**：🟡 中等  
**核心考察点**：二叉树、BFS (层序遍历)、DFS

给定一个二叉树的 **根节点** `root`，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。

> **示例 1：**
>
> **输入**：root = [1,2,3,null,5,null,4]  
> **输出**：[1,3,4]

> **示例 2：**
>
> **输入**：root = [1,null,3]  
> **输出**：[1,3]

> **示例 3：**
>
> **输入**：root = []  
> **输出**：[]

---

## 2. 解题思路拆解

**右视图** 实际上就是 **每一层的最后一个节点** 组成的集合。

### 方法一：广度优先搜索 (BFS) - 层序遍历

我们可以对二叉树进行层序遍历。在遍历每一层时，记录该层的最后一个节点。
1.  使用队列。
2.  每次循环处理一层，获取 `levelSize`。
3.  遍历 `levelSize` 个节点：
    *   如果是该层的最后一个节点 (i == levelSize - 1)，加入结果集。
    *   将左右子节点加入队列。

### 方法二：深度优先搜索 (DFS)

我们可以按照 **根 -> 右 -> 左** 的顺序进行遍历。
这样，每一层我们 **最先访问到** 的节点，一定是最右边的节点。
1.  记录每一层的深度 `depth`。
2.  如果我们是第一次到达该深度（即 `res.length == depth`），说明当前节点是该层最右边的节点，加入结果集。
3.  递归右子树，再递归左子树。

---

## 3. 代码实现

### BFS (层序遍历) - 直观

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
var rightSideView = function(root) {
    if (!root) return [];
    
    const res = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            
            // 如果是当前层的最后一个节点，加入结果
            if (i === levelSize - 1) {
                res.push(node.val);
            }
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }
    
    return res;
};
```

### DFS (根-右-左) - 巧妙

```javascript
var rightSideView = function(root) {
    const res = [];
    
    const dfs = (node, depth) => {
        if (!node) return;
        
        // 如果当前深度还没有节点被记录，说明这个 node 是该深度最右边的
        // (因为我们是优先遍历右边的)
        if (res.length === depth) {
            res.push(node.val);
        }
        
        // 先右后左
        dfs(node.right, depth + 1);
        dfs(node.left, depth + 1);
    };
    
    dfs(root, 0);
    return res;
};
```

#### 代码执行演示 (DFS)
输入 `root = [1, 2, 3, null, 5, null, 4]`

1.  `dfs(1, 0)`. `res.len` (0) == `depth` (0). Push 1. `res`=[1].
    *   Right: `dfs(3, 1)`. `res.len` (1) == `depth` (1). Push 3. `res`=[1, 3].
        *   Right: `dfs(4, 2)`. `res.len` (2) == `depth` (2). Push 4. `res`=[1, 3, 4].
        *   Left: `dfs(null)`...
    *   Left: `dfs(2, 1)`. `res.len` (3) != `depth` (1). Skip.
        *   Right: `dfs(5, 2)`. `res.len` (3) != `depth` (2). Skip.
2.  Return `[1, 3, 4]`.

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(n)$。每个节点访问一次。 |
| **空间复杂度** | BFS 为 $O(W)$ (W为最大宽度)，DFS 为 $O(H)$ (H为高度)。 |
