# 215. 数组中的第K个最大元素

[LeetCode 官方题目链接](https://leetcode.cn/problems/kth-largest-element-in-an-array/)

## 1. 题目呈现

[LeetCode 链接](https://leetcode.cn/problems/kth-largest-element-in-an-array/)

给定整数数组 `nums` 和整数 `k`，请返回数组中第 `k` 个最大的元素。

请注意，你需要找的是数组排序后的第 `k` 个最大的元素，而不是第 `k` 个不同的元素。

你必须设计并实现时间复杂度为 $O(n)$ 的算法解决此问题。

**示例 1:**
```text
输入: [3,2,1,5,6,4], k = 2
输出: 5
```

**示例 2:**
```text
输入: [3,2,3,1,2,4,5,5,6], k = 4
输出: 4
```

## 2. 思路拆解

虽然题目要求 $O(n)$，但通常有两种常见解法：

### 解法一：快速选择 (Quick Select)
这是解决第 K 大问题的标准 $O(n)$ 解法。
- 基于 **快速排序 (Quick Sort)** 的思想。
- 每次选取一个基准值 (pivot)，将数组分为三部分：大于 pivot、等于 pivot、小于 pivot。
- 根据 k 与这些部分长度的关系，判断第 k 大的元素在哪个部分，然后只递归搜索那个部分。
- 期望时间复杂度 $O(n)$，最坏情况 $O(n^2)$ (可以通过随机选择 pivot 避免)。

### 解法二：堆排序 (Heap Sort)
- 使用一个大小为 `k` 的 **小顶堆 (Min Heap)**。
- 遍历数组，将元素加入堆中。
- 如果堆的大小超过 `k`，则弹出堆顶元素（堆顶是当前堆中最小的，也就是第 k+1 大的）。
- 遍历结束后，堆顶元素就是第 k 大的元素。
- 时间复杂度 $O(n \log k)$。

由于 JavaScript 没有内置的 PriorityQueue/Heap，我们需要手动实现或者使用简单的数组操作模拟（虽然数组模拟插入删除是 $O(k)$，导致总复杂度 $O(nk)$，但在面试中手写完整堆比较耗时，通常推荐写 Quick Select）。但为了贴合“堆”这个标签，下面也会提供堆的实现。

## 3. 代码实现

### 实现一：快速选择 (推荐)

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function(nums, k) {
    // 快速选择函数
    const quickSelect = (arr, k) => {
        // 随机选择基准值
        const pivotIndex = Math.floor(Math.random() * arr.length);
        const pivot = arr[pivotIndex];
        
        const left = [];  // 大于 pivot 的
        const mid = [];   // 等于 pivot 的
        const right = []; // 小于 pivot 的
        
        for (const num of arr) {
            if (num > pivot) {
                left.push(num);
            } else if (num < pivot) {
                right.push(num);
            } else {
                mid.push(num);
            }
        }
        
        // 第 k 大在左边（比 pivot 大的数中）
        if (k <= left.length) {
            return quickSelect(left, k);
        }
        // 第 k 大在中间（等于 pivot 的数中）
        if (k <= left.length + mid.length) {
            return pivot;
        }
        // 第 k 大在右边（比 pivot 小的数中）
        // 注意：k 需要减去左边和中间的数量
        return quickSelect(right, k - left.length - mid.length);
    };

    return quickSelect(nums, k);
};
```

### 实现二：小顶堆 (Min Heap)

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function(nums, k) {
    // 手写最小堆类
    class MinHeap {
        constructor() {
            this.heap = [];
        }
        
        getParentIndex(i) { return Math.floor((i - 1) / 2); }
        getLeftIndex(i) { return 2 * i + 1; }
        getRightIndex(i) { return 2 * i + 2; }
        
        swap(i, j) {
            [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
        }
        
        push(value) {
            this.heap.push(value);
            this.bubbleUp(this.heap.length - 1);
        }
        
        pop() {
            if (this.heap.length === 0) return null;
            if (this.heap.length === 1) return this.heap.pop();
            const min = this.heap[0];
            this.heap[0] = this.heap.pop();
            this.bubbleDown(0);
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
                const parentIndex = this.getParentIndex(index);
                if (this.heap[parentIndex] <= this.heap[index]) break;
                this.swap(index, parentIndex);
                index = parentIndex;
            }
        }
        
        bubbleDown(index) {
            while (true) {
                const leftIndex = this.getLeftIndex(index);
                const rightIndex = this.getRightIndex(index);
                let smallest = index;
                
                if (leftIndex < this.heap.length && this.heap[leftIndex] < this.heap[smallest]) {
                    smallest = leftIndex;
                }
                if (rightIndex < this.heap.length && this.heap[rightIndex] < this.heap[smallest]) {
                    smallest = rightIndex;
                }
                
                if (smallest === index) break;
                this.swap(index, smallest);
                index = smallest;
            }
        }
    }

    const minHeap = new MinHeap();
    for (const num of nums) {
        minHeap.push(num);
        if (minHeap.size() > k) {
            minHeap.pop();
        }
    }
    return minHeap.peek();
};
```

## 4. 运行 Demo

```javascript
const nums1 = [3,2,1,5,6,4], k1 = 2;
console.log(findKthLargest(nums1, k1)); // 5

const nums2 = [3,2,3,1,2,4,5,5,6], k2 = 4;
console.log(findKthLargest(nums2, k2)); // 4
```

## 5. 复杂度分析

### 快速选择
-   **时间复杂度**：期望 $O(n)$，最坏 $O(n^2)$。通过随机选择 pivot，最坏情况概率极低。
-   **空间复杂度**：$O(\log n)$ 到 $O(n)$，取决于递归深度。

### 堆排序
-   **时间复杂度**：$O(n \log k)$。
-   **空间复杂度**：$O(k)$，用于存储堆。
