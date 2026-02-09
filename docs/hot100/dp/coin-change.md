# 零钱兑换

## 题目描述

给你一个整数数组 `coins` ，表示不同面额的硬币；以及一个整数 `amount` ，表示总金额。

请你计算并返回可以凑成总金额所需的 **最少的硬币个数** 。如果没有任何一种硬币组合能组成总金额，返回 `-1` 。

你可以认为每种硬币的数量是无限的。

**示例 1：**

```text
输入：coins = [1, 2, 5], amount = 11
输出：3 
解释：11 = 5 + 5 + 1
```

**示例 2：**

```text
输入：coins = [2], amount = 3
输出：-1
```

## 思路拆解

这也是一道完全背包问题的变种。

### 动态规划
1. **定义状态**：`dp[i]` 表示凑成金额 `i` 所需的最少硬币个数。
2. **状态转移方程**：
   - 对于每个金额 `i`，我们可以遍历硬币数组 `coins`。
   - 如果当前硬币面值 `coin` 小于等于 `i`，说明可以使用这枚硬币。
   - 转移方程：`dp[i] = min(dp[i], dp[i - coin] + 1)`。
3. **初始条件**：
   - `dp[0] = 0`。
   - 其他位置初始化为 `Infinity` 或 `amount + 1`（表示无法凑成）。
4. **返回值**：
   - 如果 `dp[amount]` 仍为 `Infinity`，返回 `-1`。
   - 否则返回 `dp[amount]`。

## 代码实现

```javascript
/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
    // 初始化 dp 数组，长度为 amount + 1，初始值为 amount + 1 (一个不可能达到的最大值)
    const dp = new Array(amount + 1).fill(amount + 1);
    dp[0] = 0;

    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            if (i >= coin) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }

    return dp[amount] > amount ? -1 : dp[amount];
};
```

## 运行演示

假设 `coins = [1, 2, 5], amount = 3`：

1. 初始化 `dp = [0, 4, 4, 4]` (设 amount+1 = 4)
2. `i = 1`:
   - `coin = 1`: `dp[1] = min(4, dp[0]+1) = 1`
   - `coin = 2, 5`: 跳过
   - `dp = [0, 1, 4, 4]`
3. `i = 2`:
   - `coin = 1`: `dp[2] = min(4, dp[1]+1) = 2`
   - `coin = 2`: `dp[2] = min(2, dp[0]+1) = 1`
   - `coin = 5`: 跳过
   - `dp = [0, 1, 1, 4]`
4. `i = 3`:
   - `coin = 1`: `dp[3] = min(4, dp[2]+1) = 2`
   - `coin = 2`: `dp[3] = min(2, dp[1]+1) = 2`
   - `coin = 5`: 跳过
   - `dp = [0, 1, 1, 2]`

返回 `2` (虽然解释里写了3，但这里演示到3为止，结果正确。对于11的话就是3)。

## 复杂度分析

- **时间复杂度**：$O(S \cdot n)$，其中 $S$ 是金额 `amount`，$n$ 是面额数。我们一共需要计算 $S$ 个状态，每个状态需要遍历 $n$ 个面额。
- **空间复杂度**：$O(S)$，需要一个长度为 $S$ 的数组。
