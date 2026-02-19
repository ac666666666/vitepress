# 295. 数据流的中位数

[LeetCode 官方题目链接](https://leetcode.cn/problems/find-median-from-data-stream/)

## 1. 题目呈现

[LeetCode 链接](https://leetcode.cn/problems/find-median-from-data-stream/)

**中位数**是有序整数列表中的中间值。如果列表的大小是偶数，则没有中间值，中位数是两个中间值的平均值。

*   例如 `arr = [2,3,4]` 的中位数是 `3` 。
*   例如 `arr = [2,3]` 的中位数是 `(2 + 3) / 2 = 2.5` 。

实现 `MedianFinder` 类:

*   `MedianFinder() ` 初始化 `MedianFinder` 对象。
*   `void addNum(int num)` 将数据流中的整数 `num` 添加到数据结构中。
*   `double findMedian()` 返回到目前为止所有元素的中位数。与实际答案相差 `10^-5` 以内的答案将被接受。

**示例 1：**

```text
输入
["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]
[[], [1], [2], [], [3], []]
输出
[null, null, null, 1.5, null, 2.0]

解释
MedianFinder medianFinder = new MedianFinder();
medianFinder.addNum(1);    // arr = [1]
medianFinder.addNum(2);    // arr = [1, 2]
medianFinder.findMedian(); // 返回 1.5 ((1 + 2) / 2)
medianFinder.addNum(3);    // arr[1, 2, 3]
medianFinder.findMedian(); // return 2.0
```

## 2. 思路拆解

要高效地找到中位数，我们可以将数据分为两部分：
1.  **较小的一半**：存储在 **大顶堆 (Max Heap)** 中。
2.  **较大的一半**：存储在 **小顶堆 (Min Heap)** 中。

**维护规则**：
*   设大顶堆为 `maxHeap`，小顶堆为 `minHeap`。
*   `maxHeap` 的堆顶元素是较小一半中最大的。
*   `minHeap` 的堆顶元素是较大一半中最小的。
*   **平衡性**：我们保持两个堆的元素数量相等，或者 `maxHeap` 比 `minHeap` 多一个。
    *   即 `0 <= maxHeap.size() - minHeap.size() <= 1`。

**添加元素 (`addNum`)**：
1.  先将新元素放入 `maxHeap`。
2.  为了保证顺序（`maxHeap` 中的所有元素 <= `minHeap` 中的所有元素），将 `maxHeap` 堆顶弹出并放入 `minHeap`。
3.  如果此时 `minHeap` 的数量超过了 `maxHeap`（违背了平衡性规则），将 `minHeap` 堆顶弹出并放回 `maxHeap`。

**查找中位数 (`findMedian`)**：
*   如果 `maxHeap` 元素多（总数为奇数），中位数就是 `maxHeap` 堆顶。
*   如果两个堆元素一样多（总数为偶数），中位数是 `(maxHeap堆顶 + minHeap堆顶) / 2`。

## 3. 代码实现

由于 JavaScript 没有内置的优先队列，我们需要手动实现 `Heap` 类。

```javascript
class Heap {
    constructor(comparator = (a, b) => a - b) {
        this.heap = [];
        this.comparator = comparator;
    }

    push(val) {
        this.heap.push(val);
        this.bubbleUp(this.heap.length - 1);
    }

    pop() {
        if (this.size() === 0) return null;
        if (this.size() === 1) return this.heap.pop();
        const top = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown(0);
        return top;
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
            if (this.comparator(this.heap[index], this.heap[parentIndex]) >= 0) break;
            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
            index = parentIndex;
        }
    }

    bubbleDown(index) {
        while (true) {
            let swapIndex = index;
            const left = 2 * index + 1;
            const right = 2 * index + 2;

            if (left < this.size() && this.comparator(this.heap[left], this.heap[swapIndex]) < 0) {
                swapIndex = left;
            }
            if (right < this.size() && this.comparator(this.heap[right], this.heap[swapIndex]) < 0) {
                swapIndex = right;
            }

            if (swapIndex === index) break;
            [this.heap[index], this.heap[swapIndex]] = [this.heap[swapIndex], this.heap[index]];
            index = swapIndex;
        }
    }
}

var MedianFinder = function() {
    // 小顶堆，存较大的一半，比较器默认 a - b
    this.minHeap = new Heap((a, b) => a - b);
    // 大顶堆，存较小的一半，比较器 b - a
    this.maxHeap = new Heap((a, b) => b - a);
};

/** 
 * @param {number} num
 * @return {void}
 */
MedianFinder.prototype.addNum = function(num) {
    // 1. 先放入 maxHeap
    this.maxHeap.push(num);
    // 2. 将 maxHeap 最大的移到 minHeap，保证顺序性
    this.minHeap.push(this.maxHeap.pop());
    
    // 3. 保持平衡：maxHeap 的数量 >= minHeap 的数量
    if (this.maxHeap.size() < this.minHeap.size()) {
        this.maxHeap.push(this.minHeap.pop());
    }
};

/**
 * @return {number}
 */
MedianFinder.prototype.findMedian = function() {
    if (this.maxHeap.size() > this.minHeap.size()) {
        return this.maxHeap.peek();
    } else {
        return (this.maxHeap.peek() + this.minHeap.peek()) / 2.0;
    }
};
```

## 4. 运行 Demo

```javascript
const medianFinder = new MedianFinder();
medianFinder.addNum(1);
medianFinder.addNum(2);
console.log(medianFinder.findMedian()); // 1.5
medianFinder.addNum(3);
console.log(medianFinder.findMedian()); // 2.0
```

## 5. 复杂度分析

-   **时间复杂度**：
    -   `addNum`: $O(\log n)$。堆的插入和删除操作。
    -   `findMedian`: $O(1)$。直接访问堆顶。
-   **空间复杂度**：$O(n)$。存储所有元素。
