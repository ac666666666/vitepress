# 乘积最大子数组

## 题目描述

给你一个整数数组 `nums` ，请你找出数组中乘积最大的非空连续子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。

测试用例的答案是一个 **32-位** 整数。

**示例 1:**

```text
输入: nums = [2,3,-2,4]
输出: 6
解释: 子数组 [2,3] 有最大乘积 6。
```

**示例 2:**

```text
输入: nums = [-2,0,-1]
输出: 0
解释: 结果不能为 2, 因为 [-2,-1] 不是子数组。
```

## 思路拆解

这道题与「最大子数组和」非常类似，但不同的是，乘积存在负负得正的情况。

### 动态规划
1. **定义状态**：
   - `maxF[i]` 表示以 `nums[i]` 结尾的乘积最大子数组的乘积。
   - `minF[i]` 表示以 `nums[i]` 结尾的乘积最小子数组的乘积（因为负数乘以负数可能变成最大值）。
2. **状态转移方程**：
   - 对于 `nums[i]`，它可能：
     - 单独成为一个子数组。
     - 与前面的最大积相乘。
     - 与前面的最小积相乘（如果 `nums[i]` 是负数）。
   - 所以：
     - `maxF[i] = max(nums[i], nums[i] * maxF[i-1], nums[i] * minF[i-1])`
     - `minF[i] = min(nums[i], nums[i] * maxF[i-1], nums[i] * minF[i-1])`
3. **空间优化**：
   - 只需要维护前一个状态的 `maxF` 和 `minF` 即可。

## 代码实现

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function(nums) {
    let maxF = nums[0];
    let minF = nums[0];
    let res = nums[0];

    for (let i = 1; i < nums.length; i++) {
        const num = nums[i];
        const prevMax = maxF;
        const prevMin = minF;

        maxF = Math.max(num, num * prevMax, num * prevMin);
        minF = Math.min(num, num * prevMax, num * prevMin);

        res = Math.max(res, maxF);
    }

    return res;
};
```

## 运行演示

假设 `nums = [2, 3, -2, 4]`：

1. 初始化 `maxF = 2`, `minF = 2`, `res = 2`
2. `i = 1 (3)`:
   - `maxF = max(3, 3*2, 3*2) = 6`
   - `minF = min(3, 3*2, 3*2) = 3`
   - `res = max(2, 6) = 6`
3. `i = 2 (-2)`:
   - `maxF = max(-2, -2*6, -2*3) = -2`
   - `minF = min(-2, -2*6, -2*3) = -12`
   - `res = max(6, -2) = 6`
4. `i = 3 (4)`:
   - `maxF = max(4, 4*-2, 4*-12) = 4`
   - `minF = min(4, 4*-2, 4*-12) = -48`
   - `res = max(6, 4) = 6`

返回 `6`。

## 复杂度分析

- **时间复杂度**：$O(n)$，遍历一次数组。
- **空间复杂度**：$O(1)$，只使用了常数个变量。
