# 分割等和子集

[LeetCode 官方题目链接](https://leetcode.cn/problems/partition-equal-subset-sum/)

## 题目描述

给你一个 **只包含正整数** 的非空数组 `nums` 。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。

**示例 1：**

```text
输入：nums = [1,5,11,5]
输出：true
解释：数组可以分割成 [1, 5, 5] 和 [11] 。
```

**示例 2：**

```text
输入：nums = [1,2,3,5]
输出：false
解释：数组不能分割成两个元素和相等的子集。
```

## 思路拆解

这道题可以转化为 **0-1 背包问题**。

### 问题转化
- 如果数组的总和 `sum` 是奇数，那么不可能分割成两个相等的子集，直接返回 `false`。
- 如果 `sum` 是偶数，我们的目标是从数组中选出一些数字，使得它们的和恰好等于 `target = sum / 2`。
- 这就变成了：背包容量为 `target`，物品是 `nums` 中的数字，每个物品只能用一次，问是否能恰好填满背包。

### 动态规划
1. **定义状态**：`dp[i]` 表示容量为 `i` 的背包是否能被恰好填满。
2. **状态转移方程**：
   - 对于每个数字 `num`，我们需要更新 `dp` 数组。
   - 为了保证每个数字只被使用一次，我们需要 **倒序遍历** 背包容量（从 `target` 到 `num`）。
   - `dp[i] = dp[i] || dp[i - num]`。
   - 意思是：如果不选 `num`，状态取决于 `dp[i]`（之前的数字能不能填满 `i`）；如果选 `num`，状态取决于 `dp[i - num]`（之前的数字能不能填满 `i - num`）。
3. **初始条件**：
   - `dp[0] = true`（容量为 0 时，不选任何数字即可填满）。
   - 其他初始化为 `false`。
4. **返回值**：
   - `dp[target]`。

## 代码实现

```javascript
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canPartition = function(nums) {
    let sum = 0;
    for (const num of nums) sum += num;
    
    // 如果总和是奇数，无法平分
    if (sum % 2 !== 0) return false;
    
    const target = sum / 2;
    const dp = new Array(target + 1).fill(false);
    dp[0] = true;
    
    for (const num of nums) {
        // 倒序遍历，保证每个数字只使用一次
        for (let i = target; i >= num; i--) {
            dp[i] = dp[i] || dp[i - num];
        }
    }
    
    return dp[target];
};
```

## 运行演示

假设 `nums = [1, 5, 11, 5]`，`sum = 22`，`target = 11`。

1. 初始化 `dp` 长度 12，`dp[0]=true`，其余 `false`。
2. `num = 1`:
   - `i` 从 11 到 1:
   - `dp[1] = dp[1] || dp[0] = true`
   - `dp` 变为 `[T, T, F, ...]` (T=true, F=false)
3. `num = 5`:
   - `i` 从 11 到 5:
   - `dp[6] = dp[6] || dp[1] = true` (1+5=6)
   - `dp[5] = dp[5] || dp[0] = true`
   - `dp` 中 T 的索引: `0, 1, 5, 6`
4. `num = 11`:
   - `i` 从 11 到 11:
   - `dp[11] = dp[11] || dp[0] = true`
   - 找到目标 `dp[11]` 为 true，其实可以提前返回。
5. `num = 5`:
   - 继续更新...

最终 `dp[11]` 为 `true`。

## 复杂度分析

- **时间复杂度**：$O(n \times target)$，其中 $n$ 是数组长度，$target$ 是总和的一半。
- **空间复杂度**：$O(target)$，需要一个长度为 $target$ 的数组。
