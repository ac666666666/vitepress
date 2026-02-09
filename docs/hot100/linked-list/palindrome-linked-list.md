# 回文链表

## 1. 题目呈现

**难度等级**：🟢 简单  
**核心考察点**：链表、双指针、回文

给你一个单链表的头节点 `head` ，请你判断该链表是否为回文链表。如果是，返回 `true` ；否则，返回 `false` 。

> **示例 1：**
>
> **输入**：head = [1,2,2,1]  
> **输出**：true

> **示例 2：**
>
> **输入**：head = [1,2]  
> **输出**：false

**进阶**：你能否用 `O(n)` 时间复杂度和 `O(1)` 空间复杂度解决此题？

---

## 2. 解题思路拆解

### 方法：快慢指针 + 反转后半部分

最简单的办法是把链表值复制到数组里，然后用双指针判断数组是否回文。但这需要 $O(n)$ 空间。

为了达到 $O(1)$ 空间，我们可以修改链表结构（并在最后复原）：

1.  **找到中点**：使用快慢指针（`slow` 每次走一步，`fast` 每次走两步）。当 `fast` 到达末尾时，`slow` 刚好在中间。
2.  **反转后半部分**：将链表后半部分反转。例如 `1->2->2->1` 变为 `1->2` 和 `1->2` (反转后的)。
3.  **比较**：一个指针从头开始，一个指针从后半部分头开始，逐个比较节点值。
4.  **恢复链表**（可选但推荐）：将后半部分再次反转回来，恢复原始结构。

**细节处理**：
*   如果链表长度是奇数，中间节点归前半部分还是后半部分？通常让 `slow` 停在中间节点，反转从 `slow.next` 开始，或者让 `slow` 停在前半部分的尾巴。
*   在这里我们让 `slow` 最终指向前半部分的尾节点（偶数长度）或中间节点（奇数长度）。

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
 * @return {boolean}
 */
var isPalindrome = function(head) {
    if (!head || !head.next) return true;
    
    // 1. 使用快慢指针找到前半部分的尾节点
    const firstHalfEnd = endOfFirstHalf(head);
    // 2. 反转后半部分链表
    const secondHalfStart = reverseList(firstHalfEnd.next);
    
    // 3. 判断是否回文
    let p1 = head;
    let p2 = secondHalfStart;
    let result = true;
    
    while (result && p2 !== null) {
        if (p1.val !== p2.val) {
            result = false;
        }
        p1 = p1.next;
        p2 = p2.next;
    }
    
    // 4. 恢复链表（可选，但通过工程测试通常需要）
    firstHalfEnd.next = reverseList(secondHalfStart);
    
    return result;
};

// 辅助函数：反转链表
const reverseList = (head) => {
    let prev = null;
    let curr = head;
    while (curr !== null) {
        let next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}

// 辅助函数：找到前半部分的尾节点
const endOfFirstHalf = (head) => {
    let fast = head;
    let slow = head;
    // fast 走两步，slow 走一步
    while (fast.next !== null && fast.next.next !== null) {
        fast = fast.next.next;
        slow = slow.next;
    }
    return slow;
}
```

#### 代码执行演示
输入 `1 -> 2 -> 3 -> 2 -> 1`

1.  **找中点**：
    *   `fast` 走到 `1` (末尾)，`slow` 走到 `3` (中间)。
    *   `firstHalfEnd` 是 `3`。
2.  **反转后半部分**：
    *   `firstHalfEnd.next` 是 `2 -> 1`。
    *   反转后变成 `1 -> 2`。`secondHalfStart` 指向 `1`。
    *   链表结构变成：`1 -> 2 -> 3 -> null` (前半部分) 和 `1 -> 2` (后半部分，实际 `3` 还连着原来的 `2`，但反转后 `2` 指向 `null`，所以逻辑上断开了或者说结构变了)。
    *   更准确的结构：`1 -> 2 -> 3` 指向 `null` (因为 `2` 反转指向 `1` 了，但 `3` 的 `next` 指针还在原来的 `2` 上，不过反转函数会改变指向)。
    *   反转后：`1->2->3` (前半段)，`1->2` (后半段，`2` 指向 `null`, `1` 指向 `2`)。
3.  **比较**：
    *   `p1` 在头 `1`，`p2` 在后半段头 `1`。相等。
    *   `p1` 移到 `2`，`p2` 移到 `2`。相等。
    *   `p2` 移到 `null`。结束。
4.  **返回 `true`**。

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(n)$。找中点走一次，反转走一次，比较走一次，恢复走一次。总体还是线性。 |
| **空间复杂度** | $O(1)$。只使用了常数个指针，修改了原链表结构（最后复原）。 |
