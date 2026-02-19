# 相交链表

[LeetCode 官方题目链接](https://leetcode.cn/problems/intersection-of-two-linked-lists/)

## 1. 题目呈现

**难度等级**：🟢 简单  
**核心考察点**：链表、双指针

给你两个单链表的头节点 `headA` 和 `headB` ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 `null` 。

图示如下：
```
A:       a1 -> a2
                 \
                  c1 -> c2 -> c3
                 /
B: b1 -> b2 -> b3
```

**注意**：
*   整个链式结构中不存在环。
*   函数返回结果后，链表必须 **保持其原始结构** 。

> **示例 1：**
>
> **输入**：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3  
> **输出**：Intersected at '8'  
> **解释**：相交节点的值为 8 （注意，如果两个链表相交则不能为 0）。从各自的头节点开始，链表 A 为 [4,1,8,4,5]，链表 B 为 [5,6,1,8,4,5]。在 A 中，相交节点前有 2 个节点；在 B 中，相交节点前有 3 个节点。

---

## 2. 解题思路拆解

### 方法：双指针法 (浪漫相遇)

这道题最巧妙的解法是利用双指针。

假设链表 A 的长度为 $L_A$，链表 B 的长度为 $L_B$，它们公共部分的长度为 $C$。
那么 A 独有的长度为 $L_A - C$，B 独有的长度为 $L_B - C$。

我们让两个指针 `pA` 和 `pB` 分别从 `headA` 和 `headB` 出发：
1.  `pA` 走完链表 A 后，跳到链表 B 的头节点继续走。
2.  `pB` 走完链表 B 后，跳到链表 A 的头节点继续走。

**为什么会相遇？**
*   `pA` 走的路径长度：$L_A + (L_B - C)$
*   `pB` 走的路径长度：$L_B + (L_A - C)$

显然 $L_A + L_B - C = L_B + L_A - C$。
只要两个链表相交，它们走过的总路程长度是一样的，最终一定会在交点相遇。

**如果不相交？**
*   `pA` 走完 A 又走完 B，最后指向 `null`。
*   `pB` 走完 B 又走完 A，最后指向 `null`。
*   它们会在 `null` 处相遇，正好返回 `null`。

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
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function(headA, headB) {
    if (!headA || !headB) return null;
    
    let pA = headA;
    let pB = headB;
    
    // 只要 pA 和 pB 不相等，就继续走
    // 如果相交，会在交点处相等并退出循环
    // 如果不相交，最后都会变成 null，也会相等并退出循环
    while (pA !== pB) {
        // pA 走完 A 链表，转到 B 链表
        pA = pA === null ? headB : pA.next;
        
        // pB 走完 B 链表，转到 A 链表
        pB = pB === null ? headA : pB.next;
    }
    
    return pA;
};
```

#### 代码执行演示
假设 A: `1->2->8`, B: `3->8` (8是交点)

*   初始：`pA=1`, `pB=3`
*   1. `pA=2`, `pB=8`
*   2. `pA=8`, `pB=null` (B走完了)
*   3. `pA=null` (A走完了), `pB=1` (跳到A头)
*   4. `pA=3` (跳到B头), `pB=2`
*   5. `pA=8`, `pB=8` -> **相遇！** 返回 8。

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(m + n)$。其中 $m$ 和 $n$ 分别是两个链表的长度。最坏情况下，两个指针各遍历两个链表一次。 |
| **空间复杂度** | $O(1)$。只使用了两个指针变量。 |
