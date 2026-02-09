# 合并两个有序链表

## 1. 题目呈现

**难度等级**：🟢 简单  
**核心考察点**：链表、递归、迭代

将两个升序链表合并为一个新的 **升序** 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。

> **示例 1：**
>
> **输入**：l1 = [1,2,4], l2 = [1,3,4]  
> **输出**：[1,1,2,3,4,4]

> **示例 2：**
>
> **输入**：l1 = [], l2 = []  
> **输出**：[]

> **示例 3：**
>
> **输入**：l1 = [], l2 = [0]  
> **输出**：[0]

---

## 2. 解题思路拆解

### 方法一：迭代法 (哨兵节点)

我们可以创建一个**哨兵节点** (dummy node) 作为新链表的头，然后用一个指针 `curr` 指向它。
比较 `list1` 和 `list2` 当前节点的值：
*   如果 `list1.val < list2.val`，则 `curr.next = list1`，`list1` 向后移。
*   否则，`curr.next = list2`，`list2` 向后移。
*   `curr` 向后移。

当其中一个链表遍历完后，将另一个链表剩余部分直接接在 `curr` 后面即可。

### 方法二：递归法

这是一个非常适合递归的问题。
*   如果 `list1` 为空，返回 `list2`。
*   如果 `list2` 为空，返回 `list1`。
*   如果 `list1.val < list2.val`，那么 `list1` 应该是合并后链表的头，剩下的事情就是让 `list1.next` 指向 `merge(list1.next, list2)`。
*   否则，`list2` 是头，`list2.next` 指向 `merge(list1, list2.next)`。

---

## 3. 代码实现

### 迭代法 (推荐，空间复杂度 O(1))

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function(list1, list2) {
    // 创建哨兵节点
    const dummy = new ListNode(-1);
    let curr = dummy;
    
    while (list1 !== null && list2 !== null) {
        if (list1.val <= list2.val) {
            curr.next = list1;
            list1 = list1.next;
        } else {
            curr.next = list2;
            list2 = list2.next;
        }
        curr = curr.next;
    }
    
    // 接上剩余部分
    curr.next = list1 === null ? list2 : list1;
    
    return dummy.next;
};
```

### 递归法 (代码简洁)

```javascript
var mergeTwoLists = function(list1, list2) {
    if (list1 === null) return list2;
    if (list2 === null) return list1;
    
    if (list1.val <= list2.val) {
        list1.next = mergeTwoLists(list1.next, list2);
        return list1;
    } else {
        list2.next = mergeTwoLists(list1, list2.next);
        return list2;
    }
};
```

#### 代码执行演示 (迭代法)
输入 `l1=[1,2,4], l2=[1,3,4]`

*   `dummy(-1)`, `curr` 指向 `dummy`。
*   `1 <= 1`: `curr.next` 接 `l1(1)`。`l1` 移到 `2`。`curr` 移到 `1`。
*   `2 > 1`: `curr.next` 接 `l2(1)`。`l2` 移到 `3`。`curr` 移到 `1`。
*   `2 <= 3`: `curr.next` 接 `l1(2)`。`l1` 移到 `4`。`curr` 移到 `2`。
*   `4 > 3`: `curr.next` 接 `l2(3)`。`l2` 移到 `4`。`curr` 移到 `3`。
*   `4 <= 4`: `curr.next` 接 `l1(4)`。`l1` 移到 `null`。`curr` 移到 `4`。
*   `l1` 空了，`curr.next` 接 `l2(4 -> null)`。
*   返回 `dummy.next` 即 `1->1->2->3->4->4`。

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(m + n)$。需要遍历两个链表的所有节点。 |
| **空间复杂度** | 迭代法 $O(1)$。递归法 $O(m + n)$ (递归调用栈)。 |
