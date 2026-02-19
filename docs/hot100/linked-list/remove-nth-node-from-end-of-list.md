# 删除链表的倒数第 N 个结点

[LeetCode 官方题目链接](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)

## 1. 题目呈现

**难度等级**：🟡 中等  
**核心考察点**：链表、双指针

给你一个链表，删除链表的倒数第 `n` 个结点，并且返回链表的头结点。

> **示例 1：**
>
> **输入**：head = [1,2,3,4,5], n = 2  
> **输出**：[1,2,3,5]

> **示例 2：**
>
> **输入**：head = [1], n = 1  
> **输出**：[]

> **示例 3：**
>
> **输入**：head = [1,2], n = 1  
> **输出**：[1]

---

## 2. 解题思路拆解

### 方法：快慢指针 (一次遍历)

要删除倒数第 `n` 个节点，最笨的办法是先遍历一遍求长度 `L`，再遍历一遍删第 `L-n+1` 个节点。

如何只遍历一遍？
我们可以让“快指针”先走 `n` 步。
此时快指针比慢指针领先 `n` 步。
然后快慢指针一起走。
当快指针走到链表末尾（`null`）时，慢指针正好指向倒数第 `n` 个节点。

**为了删除操作方便**：
我们需要找到倒数第 `n+1` 个节点（即被删节点的前驱）。
所以，我们可以让 `fast` 先走 `n+1` 步。
或者，使用一个**哨兵节点** (dummy node) 指向 `head`，让 `slow` 从 `dummy` 开始，`fast` 从 `dummy` 开始。
1.  `fast` 先走 `n+1` 步。
2.  `slow` 和 `fast` 同时走，直到 `fast` 为 `null`。
3.  此时 `slow` 指向倒数第 `n+1` 个节点。
4.  执行 `slow.next = slow.next.next`。

---

## 3. 代码实现

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function(head, n) {
    // 哨兵节点，处理删除头节点的情况非常方便
    const dummy = new ListNode(0, head);
    let slow = dummy;
    let fast = dummy;
    
    // 1. fast 先走 n + 1 步
    for (let i = 0; i <= n; i++) {
        fast = fast.next;
    }
    
    // 2. 同时移动，直到 fast 到底
    while (fast !== null) {
        slow = slow.next;
        fast = fast.next;
    }
    
    // 3. 删除 slow 的下一个节点 (即倒数第 n 个)
    slow.next = slow.next.next;
    
    return dummy.next;
};
```

#### 代码执行演示
输入 `head=[1,2,3,4,5], n=2`

*   `dummy` -> `1` -> `2` -> `3` -> `4` -> `5` -> `null`
*   `fast` 先走 `2+1=3` 步。
    *   0: `dummy`
    *   1: `1`
    *   2: `2`
    *   3: `3`
    *   此时 `fast` 指向 `3`。`slow` 指向 `dummy`。
*   同时移动：
    *   `fast` -> `4`, `slow` -> `1`
    *   `fast` -> `5`, `slow` -> `2`
    *   `fast` -> `null`, `slow` -> `3`
*   `while` 结束。
*   此时 `slow` 是 `3` (倒数第 3 个节点)。
*   `slow.next` 是 `4` (倒数第 2 个节点，要删的)。
*   `slow.next = slow.next.next` (即 `3.next = 5`)。
*   链表变为 `1->2->3->5`。

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(L)$。$L$ 是链表长度。我们只遍历了一次。 |
| **空间复杂度** | $O(1)$。只使用了常数个指针。 |
