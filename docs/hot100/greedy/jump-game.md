# 跳跃游戏

## 题目描述

给你一个非负整数数组 `nums` ，你最初位于数组的 **第一个下标** 。数组中的每个元素代表你在该位置可以跳跃的最大长度。

判断你是否能够到达最后一个下标。

**示例 1：**

```text
输入：nums = [2,3,1,1,4]
输出：true
解释：可以先跳 1 步，从下标 0 到达下标 1, 然后再从下标 1 跳 3 步到达最后一个下标。
```

**示例 2：**

```text
输入：nums = [3,2,1,0,4]
输出：false
解释：无论怎样，总会到达下标为 3 的位置。但该下标的最大跳跃长度是 0 ， 所以永远不可能到达最后一个下标。
```

## 思路拆解

这道题是典型的贪心算法应用。我们不需要关心具体怎么跳，只需要关心**在当前位置能到达的最远距离**是多少。

### 贪心策略
1. 维护一个变量 `maxReach`，表示当前能到达的最远下标。
2. 遍历数组 `nums`，对于每个位置 `i`：
   - 首先判断当前位置 `i` 是否可达（即 `i <= maxReach`）。如果不可达，说明中间断开了，直接返回 `false`。
   - 如果可达，更新 `maxReach = Math.max(maxReach, i + nums[i])`。
   - 如果在遍历过程中 `maxReach` 已经超过或等于最后一个下标，说明可以到达终点，直接返回 `true`。
3. 遍历结束后，如果还没有返回 `true`，说明无法到达。

## 代码实现

```javascript
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function(nums) {
    let maxReach = 0; // 能到达的最远下标
    const n = nums.length;

    for (let i = 0; i < n; i++) {
        // 如果当前位置不可达，直接返回 false
        if (i > maxReach) {
            return false;
        }
        
        // 更新能到达的最远距离
        maxReach = Math.max(maxReach, i + nums[i]);

        // 如果已经能到达终点，提前返回 true
        if (maxReach >= n - 1) {
            return true;
        }
    }

    return false;
};
```

## 运行演示

假设 `nums = [2, 3, 1, 1, 4]`：

1. 初始化 `maxReach = 0`。
2. `i = 0`: 可达，`maxReach = max(0, 0 + 2) = 2`。
3. `i = 1`: 可达（`1 <= 2`），`maxReach = max(2, 1 + 3) = 4`。
4. 此时 `maxReach (4) >= n - 1 (4)`，直接返回 `true`。

假设 `nums = [3, 2, 1, 0, 4]`：

1. `i = 0`: `maxReach = 3`。
2. `i = 1`: `maxReach = max(3, 1 + 2) = 3`。
3. `i = 2`: `maxReach = max(3, 2 + 1) = 3`。
4. `i = 3`: `maxReach = max(3, 3 + 0) = 3`。
5. `i = 4`: 此时 `i (4) > maxReach (3)`，不可达，返回 `false`。

## 复杂度分析

- **时间复杂度**：$O(n)$，遍历一次数组。
- **空间复杂度**：$O(1)$，只使用了常数个变量。
