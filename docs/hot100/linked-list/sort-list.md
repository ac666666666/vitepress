# 排序链表

[LeetCode 官方题目链接](https://leetcode.cn/problems/sort-list/)

## 1. 题目呈现

**难度等级**：🟡 中等  
**核心考察点**：链表、排序、分治算法 (归并排序)

给你链表的头结点 `head` ，请将其按 **升序** 排列并返回 **排序后的链表** 。

**进阶**：你可以在 `O(n log n)` 时间复杂度和常数级空间复杂度下解决此问题吗？

> **示例 1：**
>
> **输入**：head = [4,2,1,3]  
> **输出**：[1,2,3,4]

> **示例 2：**
>
> **输入**：head = [-1,5,3,4,0]  
> **输出**：[-1,0,3,4,5]

> **示例 3：**
>
> **输入**：head = []  
> **输出**：[]

---

## 2. 解题思路拆解

### 方法：归并排序 (Merge Sort)

要达到 `O(n log n)` 的时间复杂度，通常只有归并排序、快速排序、堆排序等。对于链表来说，**归并排序**是最合适的，因为：
1.  链表不支持随机访问，快排的 partition 操作实现起来较复杂且效率不如数组高。
2.  归并排序主要涉及链表的拆分和合并，这正是链表的强项（不需要像数组那样移动元素）。

**递归版归并排序**：
1.  **找中点**：使用快慢指针找到链表的中点。
2.  **断开**：从中点将链表断开成两个子链表。
3.  **递归**：分别对两个子链表进行排序。
4.  **合并**：将两个有序子链表合并成一个有序链表（即 "合并两个有序链表" 题目）。

**注意**：递归版归并排序的空间复杂度是 `O(log n)` (递归栈深度)。虽然题目进阶要求常数级空间，但递归版通常也能通过面试，且代码更易写。
如果要严格 `O(1)` 空间，需要用**自底向上**的迭代法，但这在面试中手写难度较大，通常写出递归版并能分析出栈空间即可。

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
 * @return {ListNode}
 */
var sortList = function(head) {
    // 1. 递归终止条件：链表为空或只有一个节点
    if (!head || !head.next) {
        return head;
    }

    // 2. 找中点 (快慢指针)
    let slow = head;
    let fast = head.next; // fast 先走一步，为了让 slow 停在中点偏左的位置（偶数长度时）
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // 3. 断开链表
    let mid = slow.next;
    slow.next = null; // 切断
    
    // 4. 递归排序左右两部分
    let left = sortList(head);
    let right = sortList(mid);
    
    // 5. 合并
    return merge(left, right);
};

// 辅助函数：合并两个有序链表
function merge(l1, l2) {
    const dummy = new ListNode(0);
    let curr = dummy;
    
    while (l1 && l2) {
        if (l1.val < l2.val) {
            curr.next = l1;
            l1 = l1.next;
        } else {
            curr.next = l2;
            l2 = l2.next;
        }
        curr = curr.next;
    }
    
    if (l1) curr.next = l1;
    if (l2) curr.next = l2;
    
    return dummy.next;
}
```

#### 代码执行演示
输入 `head = [4,2,1,3]`

1.  **Split 1**: `4->2->1->3`
    *   `fast` 初始在 `2`。
    *   `slow` 初始在 `4`。
    *   loop 1: `slow` -> `2`, `fast` -> `3`.
    *   loop 2: `fast.next` 是 null。结束。
    *   `mid` = `1`. 断开：`4->2` 和 `1->3`。
2.  **Recursion Left** (`4->2`):
    *   Split: `4` 和 `2`.
    *   Recurse `4` -> return `4`.
    *   Recurse `2` -> return `2`.
    *   Merge `4` and `2` -> `2->4`.
3.  **Recursion Right** (`1->3`):
    *   Split: `1` 和 `3`.
    *   Recurse `1` -> return `1`.
    *   Recurse `3` -> return `3`.
    *   Merge `1` and `3` -> `1->3`.
4.  **Final Merge**: `2->4` 和 `1->3`
    *   `1` < `2` -> `curr`接 `1`。
    *   `2` < `3` -> `curr`接 `2`。
    *   `3` < `4` -> `curr`接 `3`。
    *   `4` 剩下了 -> `curr`接 `4`。
    *   Result: `1->2->3->4`.

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(n \log n)$。归并排序的标准时间复杂度。 |
| **空间复杂度** | $O(\log n)$。递归调用栈的深度。如果使用迭代法可以优化到 $O(1)$。 |
