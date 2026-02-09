# 347. 前 K 个高频元素

## 1. 题目呈现

[LeetCode 链接](https://leetcode.cn/problems/top-k-frequent-elements/)

给你一个整数数组 `nums` 和一个整数 `k` ，请你返回其中出现频率前 `k` 高的元素。你可以按 **任意顺序** 返回答案。

**示例 1:**
```text
输入: nums = [1,1,1,2,2,3], k = 2
输出: [1,2]
```

**示例 2:**
```text
输入: nums = [1], k = 1
输出: [1]
```

## 2. 思路拆解

### 解法一：最小堆 (Min Heap)
1.  使用哈希表 (Map) 统计每个元素出现的频率。
2.  维护一个大小为 `k` 的 **小顶堆**。
    -   遍历频率表。
    -   如果堆的大小小于 `k`，直接入堆。
    -   如果堆的大小等于 `k`，比较当前元素的频率与堆顶元素的频率。
        -   如果当前频率 > 堆顶频率，弹出堆顶，将当前元素入堆。
3.  最终堆中的元素即为前 `k` 个高频元素。
4.  时间复杂度：$O(n \log k)$。

### 解法二：桶排序 (Bucket Sort) - 最优解
1.  使用哈希表统计每个元素出现的频率。
2.  创建一个数组 `buckets`，下标表示频率，值是一个数组，存储该频率对应的所有元素。
    -   `buckets[freq]` 存放所有出现次数为 `freq` 的数。
3.  从后往前遍历 `buckets`（频率从大到小），收集前 `k` 个元素。
4.  时间复杂度：$O(n)$。

## 3. 代码实现

### 实现一：桶排序 (推荐，代码简洁且高效)

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function(nums, k) {
    const map = new Map();
    // 1. 统计频率
    for (const num of nums) {
        map.set(num, (map.get(num) || 0) + 1);
    }

    // 2. 桶排序
    // 频率最大为 nums.length
    const buckets = Array.from({ length: nums.length + 1 }, () => []);
    
    for (const [num, freq] of map) {
        buckets[freq].push(num);
    }

    // 3. 倒序收集结果
    const res = [];
    for (let i = buckets.length - 1; i >= 0; i--) {
        if (buckets[i].length > 0) {
            res.push(...buckets[i]);
            if (res.length >= k) {
                return res.slice(0, k);
            }
        }
    }
    
    return res;
};
```

### 实现二：最小堆

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function(nums, k) {
    const map = new Map();
    for (const num of nums) {
        map.set(num, (map.get(num) || 0) + 1);
    }

    // 简单的最小堆实现，存储 [num, freq]
    class MinHeap {
        constructor() {
            this.heap = [];
        }
        
        push(val) {
            this.heap.push(val);
            this.bubbleUp(this.heap.length - 1);
        }
        
        pop() {
            const min = this.heap[0];
            const last = this.heap.pop();
            if (this.heap.length > 0) {
                this.heap[0] = last;
                this.bubbleDown(0);
            }
            return min;
        }
        
        peek() {
            return this.heap[0];
        }
        
        size() {
            return this.heap.length;
        }
        
        bubbleUp(index) {
            while (index > 0) {
                const parentIndex = Math.floor((index - 1) / 2);
                if (this.heap[parentIndex][1] <= this.heap[index][1]) break;
                [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
                index = parentIndex;
            }
        }
        
        bubbleDown(index) {
            while (true) {
                let smallest = index;
                const left = 2 * index + 1;
                const right = 2 * index + 2;
                
                if (left < this.heap.length && this.heap[left][1] < this.heap[smallest][1]) smallest = left;
                if (right < this.heap.length && this.heap[right][1] < this.heap[smallest][1]) smallest = right;
                
                if (smallest === index) break;
                [this.heap[smallest], this.heap[index]] = [this.heap[index], this.heap[smallest]];
                index = smallest;
            }
        }
    }

    const minHeap = new MinHeap();
    
    for (const [num, freq] of map) {
        minHeap.push([num, freq]);
        if (minHeap.size() > k) {
            minHeap.pop();
        }
    }

    return minHeap.heap.map(item => item[0]);
};
```

## 4. 运行 Demo

```javascript
const nums1 = [1,1,1,2,2,3], k1 = 2;
console.log(topKFrequent(nums1, k1)); // [1, 2] (顺序可能不同)

const nums2 = [1], k2 = 1;
console.log(topKFrequent(nums2, k2)); // [1]
```

## 5. 复杂度分析

### 桶排序
-   **时间复杂度**：$O(n)$。统计频率 $O(n)$，放入桶 $O(n)$，遍历桶 $O(n)$。
-   **空间复杂度**：$O(n)$。

### 最小堆
-   **时间复杂度**：$O(n \log k)$。
-   **空间复杂度**：$O(n)$ (Map) + $O(k)$ (Heap)。
