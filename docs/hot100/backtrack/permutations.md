# 全排列

## 1. 题目呈现

[LeetCode 46. Permutations](https://leetcode.com/problems/permutations/)

给定一个不含重复数字的数组 `nums` ，返回其 **所有可能的全排列** 。你可以 **按任意顺序** 返回答案。

**示例 1：**

```
输入：nums = [1,2,3]
输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

**示例 2：**

```
输入：nums = [0,1]
输出：[[0,1],[1,0]]
```

**示例 3：**

```
输入：nums = [1]
输出：[[1]]
```

## 2. 思路拆解

**全排列** 是最经典的回溯算法题目之一。

**核心思想**：
我们把全排列问题看作是 $n$ 个位置填入 $n$ 个不同的数字。
-   第一个位置有 $n$ 种选择。
-   第二个位置有 $n-1$ 种选择（因为已经用掉了一个）。
-   ...
-   直到填完所有位置。

**回溯法框架**：
1.  **路径 (path)**：记录当前已经选择的数字序列。
2.  **选择列表**：当前还可以选择哪些数字？（可以通过一个 `used` 数组来标记哪些数字已经被选过了）。
3.  **终止条件**：当路径长度等于数组长度时，说明找到了一个全排列，将其加入结果集。

**详细步骤**：
-   定义一个递归函数 `backtrack(path)`。
-   遍历 `nums` 中的每一个数字：
    -   如果该数字已经被使用（`used[i] == true`），跳过。
    -   做选择：将该数字加入 `path`，并标记 `used[i] = true`。
    -   递归调用 `backtrack`。
    -   撤销选择（回溯）：将该数字从 `path` 移除，并标记 `used[i] = false`。

## 3. 代码实现

```javascript
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function(nums) {
    const res = [];
    const used = new Array(nums.length).fill(false);
    
    // backtrack 函数
    // path: 当前已生成的排列
    const backtrack = (path) => {
        // 终止条件：路径长度等于 nums 长度，说明找到一个全排列
        if (path.length === nums.length) {
            // 注意：需要拷贝一份 path，因为 path 是引用传递
            res.push([...path]);
            return;
        }
        
        // 遍历选择列表
        for (let i = 0; i < nums.length; i++) {
            // 剪枝：如果当前数字已经使用过，跳过
            if (used[i]) {
                continue;
            }
            
            // 做选择
            path.push(nums[i]);
            used[i] = true;
            
            // 进入下一层决策树
            backtrack(path);
            
            // 撤销选择 (回溯)
            used[i] = false;
            path.pop();
        }
    };
    
    backtrack([]);
    return res;
};
```

## 4. 运行结果

```javascript
console.log(permute([1, 2, 3]));
// 输出: 
// [
//   [1, 2, 3], [1, 3, 2],
//   [2, 1, 3], [2, 3, 1],
//   [3, 1, 2], [3, 2, 1]
// ]
```

## 5. 复杂度分析

-   **时间复杂度**：$O(n \times n!)$。
    -   全排列的总数为 $n!$。
    -   对于每个排列，我们需要 $O(n)$ 的时间来复制数组（`res.push([...path])`）。
    -   所以总时间复杂度是 $O(n \times n!)$。
-   **空间复杂度**：$O(n)$。
    -   递归调用栈的深度为 $n$。
    -   `used` 数组的大小为 $n$。
    -   `path` 数组的大小为 $n$。
    -   不考虑结果集 `res` 占用的空间。
