# 组合总和

[LeetCode 官方题目链接](https://leetcode.cn/problems/combination-sum/)

## 1. 题目呈现

[LeetCode 39. Combination Sum](https://leetcode.com/problems/combination-sum/)

给你一个 **无重复元素** 的整数数组 `candidates` 和一个目标整数 `target` ，找出 `candidates` 中可以使数字和为目标数 `target` 的 **所有不同组合** ，并以列表形式返回。你可以按 **任意顺序** 返回这些组合。

`candidates` 中的 **同一个** 数字可以 **无限制重复被选取** 。如果至少一个数字的被选数量不同，则两种组合是不同的。

对于给定的输入，保证和为 `target` 的不同组合数少于 150 个。

**示例 1：**

```
输入：candidates = [2,3,6,7], target = 7
输出：[[2,2,3],[7]]
解释：
2 和 3 可以形成一组候选，2 + 2 + 3 = 7 。注意 2 可以使用多次。
7 也是一个候选， 7 = 7 。
仅有这两种组合。
```

**示例 2：**

```
输入: candidates = [2,3,5], target = 8
输出: [[2,2,2,2],[2,3,3],[3,5]]
```

**示例 3：**

```
输入: candidates = [2], target = 1
输出: []
```

## 2. 思路拆解

**组合总和** 是回溯算法中关于“组合”问题的经典代表，特别是涉及“元素可重复使用”的情况。

**核心思想**：
我们需要在 `candidates` 中选择若干个数字，使得它们的和等于 `target`。

**回溯法框架**：
1.  **路径 (path)**：记录当前已选取的数字。
2.  **选择列表**：
    -   为了避免重复组合（如 `[2, 2, 3]` 和 `[2, 3, 2]` 是同一个组合），我们需要规定顺序。使用 `start` 索引，规定每次只能从 `start` 索引及之后的元素中选择。
    -   因为**允许重复使用**，所以在递归调用时，`start` 参数不需要加 1，而是保持为当前的 `i`。
3.  **终止条件**：
    -   如果当前和 `sum === target`，找到一个解，加入结果集。
    -   如果当前和 `sum > target`，说明路走不通了，返回。
4.  **剪枝优化**：
    -   如果我们将 `candidates` 数组先进行**排序**。
    -   在遍历选择列表时，如果发现 `currentSum + candidates[i] > target`，由于数组是有序的，后续的元素肯定更大，所以可以直接 `break` 循环，不再尝试。

## 3. 代码实现

```javascript
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum = function(candidates, target) {
    const res = [];
    // 1. 排序：为了方便后续剪枝
    candidates.sort((a, b) => a - b);
    
    // backtrack 函数
    // start: 当前选择列表的起始索引
    // currentSum: 当前路径的和
    // path: 当前路径
    const backtrack = (start, currentSum, path) => {
        // 终止条件：找到目标和
        if (currentSum === target) {
            res.push([...path]);
            return;
        }
        
        // 遍历选择列表
        for (let i = start; i < candidates.length; i++) {
            const num = candidates[i];
            
            // 剪枝：如果加上当前数字已经超过 target，后面的数字更大，肯定也超过
            if (currentSum + num > target) {
                break;
            }
            
            // 做选择
            path.push(num);
            
            // 递归进入下一层
            // 关键点：因为可以重复使用当前数字，所以传入 i 而不是 i + 1
            backtrack(i, currentSum + num, path);
            
            // 撤销选择 (回溯)
            path.pop();
        }
    };
    
    backtrack(0, 0, []);
    return res;
};
```

## 4. 运行结果

```javascript
console.log(combinationSum([2, 3, 6, 7], 7));
// 输出: [[2, 2, 3], [7]]

console.log(combinationSum([2, 3, 5], 8));
// 输出: [[2, 2, 2, 2], [2, 3, 3], [3, 5]]
```

## 5. 复杂度分析

-   **时间复杂度**：$O(S)$。
    -   其中 $S$ 是所有可行解的长度之和。这个复杂度比较难精确计算，最坏情况下是指数级别的。但在实际运行中，由于剪枝非常有效，且题目保证解的数量少于 150，所以运行很快。
-   **空间复杂度**：$O(target / min(candidates))$。
    -   递归调用栈的深度最坏情况下为 `target` 除以数组中最小的元素（例如 `target=10, candidates=[1]`，深度为 10）。
    -   最坏情况下的空间复杂度为 $O(target)$。
