# 环形链表

[LeetCode 官方题目链接](https://leetcode.cn/problems/linked-list-cycle/)

## 1. 题目呈现

**难度等级**：🟢 简单  
**核心考察点**：链表、双指针

给你一个链表的头节点 `head` ，判断链表中是否有环。

如果链表中有某个节点，可以通过连续跟踪 `next` 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 `pos` 来表示链表尾连接到链表中的位置（索引从 0 开始）。**注意：pos 不作为参数进行传递** 。仅仅是为了标识链表的实际情况。

如果链表中存在环 ，则返回 `true` 。 否则，返回 `false` 。

> **示例 1：**
>
> **输入**：head = [3,2,0,-4], pos = 1  
> **输出**：true  
> **解释**：链表中有一个环，其尾部连接到第二个节点。

> **示例 2：**
>
> **输入**：head = [1,2], pos = 0  
> **输出**：true  
> **解释**：链表中有一个环，其尾部连接到第一个节点。

> **示例 3：**
>
> **输入**：head = [1], pos = -1  
> **输出**：false  
> **解释**：链表中没有环。

---

## 2. 解题思路拆解

### 方法：快慢指针 (龟兔赛跑)

这是检测链表是否有环的最经典算法，也称为 Floyd 判圈算法。

我们定义两个指针，`slow` 和 `fast`。
*   `slow` 指针每次向后移动一个位置。
*   `fast` 指针每次向后移动两个位置。

**原理**：
*   **如果没有环**：`fast` 指针会先到达链表尾部（`null`），此时可以直接返回 `false`。
*   **如果有环**：`fast` 指针会先进入环，然后在环里绕圈。`slow` 指针随后也会进入环。一旦两个指针都在环里，这就变成了一个“追及问题”。因为 `fast` 每次比 `slow` 多走一步，所以 `fast` 一定会追上 `slow`（套圈）。

就像操场跑步，跑得快的人终究会从后面追上跑得慢的人。

---

## 3. 代码实现

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function(head) {
    if (!head || !head.next) {
        return false;
    }
    
    let slow = head;
    let fast = head.next;
    
    while (slow !== fast) {
        // 如果 fast 走到了尽头，说明没有环
        if (!fast || !fast.next) {
            return false;
        }
        
        slow = slow.next;      // 慢指针走一步
        fast = fast.next.next; // 快指针走两步
    }
    
    return true;
};
```

**注**：也可以让 `slow` 和 `fast` 都从 `head` 开始，`while` 条件改为 `fast && fast.next`，内部判断 `slow === fast`。效果一样。

```javascript
// 另一种写法（更通用）
var hasCycle = function(head) {
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow === fast) {
            return true;
        }
    }
    
    return false;
};
```

#### 代码执行演示
输入 `3 -> 2 -> 0 -> -4 -> (回到2)`

*   初始：`slow=3`, `fast=3`
*   1. `slow=2`, `fast=0`
*   2. `slow=0`, `fast=2` (套圈了？不，还没相遇)
*   3. `slow=-4`, `fast=-4` (相遇！) -> 返回 `true`

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(n)$。如果没有环，`fast` 跑完链表需要 $O(n)$。如果有环，进入环后，`fast` 最多跑一圈就能追上 `slow`。 |
| **空间复杂度** | $O(1)$。只使用了两个指针。 |
