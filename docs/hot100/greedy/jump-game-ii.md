# 跳跃游戏 II

[LeetCode 官方题目链接](https://leetcode.cn/problems/jump-game-ii/)

## 题目描述

给定一个长度为 `n` 的 0 索引整数数组 `nums`。初始位置为 `nums[0]`。

每个元素 `nums[i]` 表示从索引 `i` 向前跳转的最大长度。换句话说，如果你在 `nums[i]` 处，你可以跳转到任意 `nums[i + j]` 处:

- `0 <= j <= nums[i]` 
- `i + j < n`

返回到达 `nums[n - 1]` 的最小跳跃次数。生成的测试用例可以到达 `nums[n - 1]`。

**示例 1:**

```text
输入: nums = [2,3,1,1,4]
输出: 2
解释: 跳到最后一个位置的最小跳跃数是 2。
     从下标为 0 跳到下标为 1 的位置，跳 1 步，然后跳 3 步到达数组的最后一个位置。
```

**示例 2:**

```text
输入: nums = [2,3,0,1,4]
输出: 2
```

## 思路拆解

这道题求的是**最小跳跃次数**。这也是一道典型的贪心算法题。

### 贪心策略
我们需要维护当前跳跃范围内，能到达的最远距离。
- `jumps`: 当前跳跃次数。
- `currentEnd`: 当前跳跃次数能到达的边界。
- `farthest`: 在当前范围内，能探测到的最远位置。

我们遍历数组（注意不需要遍历最后一个元素，因为我们是要到达最后一个元素）：
1. 在遍历过程中，不断更新 `farthest = Math.max(farthest, i + nums[i])`。
2. 当我们到达了 `currentEnd` 时，说明当前这一步的潜力已经耗尽，必须进行下一次跳跃：
   - `jumps` 加 1。
   - 更新 `currentEnd = farthest`（下一次跳跃的边界就是当前能探测到的最远位置）。

这样我们就能保证每次跳跃都尽可能远，从而使总跳跃次数最少。

## 代码实现

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var jump = function(nums) {
    let jumps = 0;
    let currentEnd = 0;
    let farthest = 0;
    
    // 注意：循环不需要处理最后一个元素
    // 因为如果已经到了最后一个元素，就不需要再跳了
    for (let i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        
        if (i === currentEnd) {
            jumps++;
            currentEnd = farthest;
        }
    }
    
    return jumps;
};
```

## 运行演示

假设 `nums = [2, 3, 1, 1, 4]`：

1. 初始化: `jumps = 0`, `currentEnd = 0`, `farthest = 0`。
2. `i = 0`: `farthest = max(0, 0 + 2) = 2`。`i === currentEnd (0)`, `jumps = 1`, `currentEnd = 2`。
3. `i = 1`: `farthest = max(2, 1 + 3) = 4`。
4. `i = 2`: `farthest = max(4, 2 + 1) = 4`。`i === currentEnd (2)`, `jumps = 2`, `currentEnd = 4`。
5. `i = 3`: `farthest = max(4, 3 + 1) = 4`。
6. 循环结束（`i < 4`），返回 `jumps = 2`。

## 复杂度分析

- **时间复杂度**：$O(n)$，遍历一次数组。
- **空间复杂度**：$O(1)$，只使用了常数个变量。
