# 两两交换链表中的节点

## 1. 题目呈现

**难度等级**：🟡 中等  
**核心考察点**：链表、递归、迭代

给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。

> **示例 1：**
>
> **输入**：head = [1,2,3,4]  
> **输出**：[2,1,4,3]

> **示例 2：**
>
> **输入**：head = []  
> **输出**：[]

> **示例 3：**
>
> **输入**：head = [1]  
> **输出**：[1]

---

## 2. 解题思路拆解

### 方法一：递归

这是一个典型的子问题结构。
对于链表 `1 -> 2 -> 3 -> 4`：
*   我们希望交换 `1` 和 `2`。
*   交换后，`2` 变成头，`1` 变成第二个。
*   `1.next` 应该指向后面部分（`3->4`）交换后的结果。
*   即 `1.next = swapPairs(3)`。

**递归终止条件**：
*   如果链表为空（`head == null`），或只有一个节点（`head.next == null`），无法交换，直接返回 `head`。

**单层逻辑**：
*   `first = head`
*   `second = head.next`
*   `first.next = swapPairs(second.next)`
*   `second.next = first`
*   返回 `second`

### 方法二：迭代 (哨兵节点)

为了通用处理头节点变化，我们使用一个哨兵节点 `dummy`。
`dummy -> 1 -> 2 -> 3 -> 4`

我们需要一个指针 `temp` 指向要交换的两个节点的前驱。
初始时 `temp = dummy`。

**交换步骤**：
假设当前是 `temp -> node1 -> node2 -> ...`
我们希望变成 `temp -> node2 -> node1 -> ...`

1.  `node1 = temp.next`
2.  `node2 = temp.next.next`
3.  `temp.next = node2`       (dummy 指向 2)
4.  `node1.next = node2.next` (1 指向 3)
5.  `node2.next = node1`      (2 指向 1)
6.  `temp = node1`            (temp 移到 1，准备处理下一对)

---

## 3. 代码实现

### 迭代法 (推荐，符合空间复杂度 O(1) 的严格要求)

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
var swapPairs = function(head) {
    const dummy = new ListNode(0, head);
    let temp = dummy;
    
    // 只要后面还有两个节点，就继续交换
    while (temp.next !== null && temp.next.next !== null) {
        const node1 = temp.next;
        const node2 = temp.next.next;
        
        // 交换逻辑
        temp.next = node2;
        node1.next = node2.next;
        node2.next = node1;
        
        // 移动 temp
        temp = node1;
    }
    
    return dummy.next;
};
```

### 递归法 (代码简洁)

```javascript
var swapPairs = function(head) {
    if (head === null || head.next === null) {
        return head;
    }
    
    const next = head.next;
    head.next = swapPairs(next.next);
    next.next = head;
    
    return next;
};
```

#### 代码执行演示 (迭代法)
输入 `1->2->3->4`

*   `dummy` -> `1` -> `2` -> `3` -> `4`
*   `temp` 指向 `dummy`。
*   **第 1 轮**：
    *   `node1` = 1, `node2` = 2
    *   `temp.next` = 2 (`dummy` -> 2)
    *   `node1.next` = 3 (1 -> 3)
    *   `node2.next` = 1 (2 -> 1)
    *   目前链表：`dummy` -> `2` -> `1` -> `3` -> `4`
    *   `temp` 移到 1。
*   **第 2 轮**：
    *   `temp` (1) 后面还有 3, 4。满足循环。
    *   `node1` = 3, `node2` = 4
    *   `temp.next` = 4 (1 -> 4)
    *   `node1.next` = null (3 -> null)
    *   `node2.next` = 3 (4 -> 3)
    *   目前链表：`dummy` -> `2` -> `1` -> `4` -> `3` -> `null`
    *   `temp` 移到 3。
*   **结束**：`temp` 后面没有节点了。返回 `dummy.next`。

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(n)$。需要遍历链表一次。 |
| **空间复杂度** | 迭代法 $O(1)$。递归法 $O(n)$ (递归栈深度)。 |
