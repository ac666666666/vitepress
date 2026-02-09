# 每日温度

## 1. 题目呈现

[LeetCode 链接](https://leetcode.cn/problems/daily-temperatures/)

给定一个整数数组 `temperatures` ，表示每天的温度，返回一个数组 `answer` ，其中 `answer[i]` 是指对于第 `i` 天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用 `0` 来代替。

**示例 1:**
```text
输入: temperatures = [73,74,75,71,69,72,76,73]
输出: [1,1,4,2,1,1,0,0]
```

**示例 2:**
```text
输入: temperatures = [30,40,50,60]
输出: [1,1,1,0]
```

**示例 3:**
```text
输入: temperatures = [30,60,90]
输出: [1,1,0]
```

## 2. 思路拆解

这道题需要找到每个元素右边第一个比它大的元素的位置。这是 **单调栈** 的经典应用场景。

1.  **单调栈**：我们维护一个存储 **下标** 的栈。
2.  **栈内性质**：栈内的元素对应的温度值保持 **单调递减**。
3.  **遍历过程**：
    *   遍历温度数组 `temperatures`，对于当前温度 `currentTemp` 和当前下标 `i`：
    *   **比较**：如果栈不为空，且 `currentTemp` 大于栈顶下标对应的温度 `temperatures[stackTop]`：
        *   说明找到了栈顶元素右边第一个比它大的温度。
        *   弹出栈顶元素 `prevIndex`。
        *   计算距离：`answer[prevIndex] = i - prevIndex`。
        *   重复上述比较步骤，直到栈为空或栈顶温度大于等于当前温度。
    *   **入栈**：将当前下标 `i` 压入栈中。
4.  **未处理的元素**：遍历结束后，栈中剩余的元素说明右边没有比它大的温度，保持初始值 `0` 即可。

## 3. 代码实现

```javascript
/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
var dailyTemperatures = function(temperatures) {
    const n = temperatures.length;
    const answer = new Array(n).fill(0);
    const stack = []; // 存储下标

    for (let i = 0; i < n; i++) {
        // 当栈不为空，且当前温度大于栈顶下标对应的温度
        while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
            const prevIndex = stack.pop();
            answer[prevIndex] = i - prevIndex;
        }
        // 当前下标入栈
        stack.push(i);
    }

    return answer;
};
```

## 4. 运行 Demo

```javascript
const t1 = [73,74,75,71,69,72,76,73];
console.log(dailyTemperatures(t1)); 
// 输出: [1, 1, 4, 2, 1, 1, 0, 0]

const t2 = [30,40,50,60];
console.log(dailyTemperatures(t2));
// 输出: [1, 1, 1, 0]

const t3 = [30,60,90];
console.log(dailyTemperatures(t3));
// 输出: [1, 1, 0]
```

## 5. 复杂度分析

-   **时间复杂度**：$O(n)$，其中 $n$ 是数组的长度。虽然有两层循环（`for` 和 `while`），但每个元素最多入栈一次，出栈一次，所以总操作次数是线性的。
-   **空间复杂度**：$O(n)$，栈的大小最坏情况下为 $n$（例如温度单调递减的情况）。
