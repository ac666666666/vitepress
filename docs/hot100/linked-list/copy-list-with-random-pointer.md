# 随机链表的复制

[LeetCode 官方题目链接](https://leetcode.cn/problems/copy-list-with-random-pointer/)

## 1. 题目呈现

**难度等级**：🟡 中等  
**核心考察点**：链表、哈希表

给你一个长度为 `n` 的链表，每个节点包含一个额外增加的随机指针 `random` ，该指针可以指向链表中的任何节点或空节点。

构造这个链表的 **深拷贝**。 深拷贝应该正好由 `n` 个 **全新** 节点组成，其中每个新节点的值都设为其对应的原节点的值。新节点的 `next` 指针和 `random` 指针也都应指向复制链表中的新节点，并使原链表和复制链表中的这些指针能够表示相同的链表状态。**复制链表中的指针都不应指向原链表中的节点**。

例如，如果原链表中有 `X` 和 `Y` 两个节点，其中 `X.random --> Y` 。那么在复制链表中对应的两个节点 `x` 和 `y` ，同样有 `x.random --> y` 。

返回复制链表的头节点。

> **示例 1：**
>
> **输入**：head = [[7,null],[13,0],[11,4],[10,2],[1,0]]  
> **输出**：[[7,null],[13,0],[11,4],[10,2],[1,0]]

> **示例 2：**
>
> **输入**：head = [[1,1],[2,1]]  
> **输出**：[[1,1],[2,1]]

> **示例 3：**
>
> **输入**：head = [[3,null],[3,0],[3,null]]  
> **输出**：[[3,null],[3,0],[3,null]]

---

## 2. 解题思路拆解

### 方法一：哈希表 (Map)

最直观的方法。
1.  **第一遍遍历**：复制所有节点，并建立 `原节点 -> 新节点` 的映射关系，存入哈希表。
2.  **第二遍遍历**：根据哈希表，构建新节点的 `next` 和 `random` 关系。
    *   `map.get(node).next = map.get(node.next)`
    *   `map.get(node).random = map.get(node.random)`

### 方法二：拼接 + 拆分 (空间优化 O(1))

如果题目要求空间复杂度 $O(1)$（不计算输出占用的空间），可以使用这种巧妙的方法。

**步骤**：
1.  **复制节点并拼接**：对于每个节点 `node`，创建一个新节点 `copy`，插在 `node` 和 `node.next` 之间。
    *   原链表：`A -> B -> C`
    *   拼接后：`A -> A' -> B -> B' -> C -> C'`
2.  **处理 random 指针**：
    *   `A'` 的 random 应该指向 `A.random` 的拷贝。
    *   也就是 `A.next.random = A.random.next` (如果 `A.random` 不为空)。
3.  **拆分链表**：将 `A->A'->B->B'...` 拆分成 `A->B...` 和 `A'->B'...`。
    *   `A.next = A.next.next`
    *   `A'.next = A'.next.next`

---

## 3. 代码实现

### 哈希表法 (易于理解，面试常用)

```javascript
/**
 * // Definition for a Node.
 * function Node(val, next, random) {
 *    this.val = val;
 *    this.next = next;
 *    this.random = random;
 * };
 */

/**
 * @param {Node} head
 * @return {Node}
 */
var copyRandomList = function(head) {
    if (!head) return null;
    
    const map = new Map();
    
    // 1. 复制节点，建立映射
    let curr = head;
    while (curr) {
        map.set(curr, new Node(curr.val));
        curr = curr.next;
    }
    
    // 2. 构建连接关系
    curr = head;
    while (curr) {
        const copy = map.get(curr);
        copy.next = map.get(curr.next) || null;
        copy.random = map.get(curr.random) || null;
        curr = curr.next;
    }
    
    return map.get(head);
};
```

### 拼接拆分法 (空间最优)

```javascript
var copyRandomList = function(head) {
    if (!head) return null;
    
    // 1. 复制节点并插入到原节点后面
    // A -> B -> C  =>  A -> A' -> B -> B' -> C -> C'
    let curr = head;
    while (curr) {
        const copy = new Node(curr.val, curr.next, null);
        curr.next = copy;
        curr = copy.next;
    }
    
    // 2. 处理 random 指针
    curr = head;
    while (curr) {
        if (curr.random) {
            // copy 的 random 是 原节点 random 的下一个 (即 random 的 copy)
            curr.next.random = curr.random.next;
        }
        curr = curr.next.next;
    }
    
    // 3. 拆分链表
    // 恢复原链表，并提取出拷贝链表
    curr = head;
    const newHead = head.next;
    let copyCurr = newHead;
    
    while (curr) {
        curr.next = curr.next.next;
        if (copyCurr.next) {
            copyCurr.next = copyCurr.next.next;
        }
        
        curr = curr.next;
        copyCurr = copyCurr.next;
    }
    
    return newHead;
};
```

#### 代码执行演示 (拼接拆分法)
输入 `head = [[7,null],[13,0]]` (简略版，0代表指向索引0的节点)

1.  **拼接**：
    *   `7 -> 7' -> 13 -> 13' -> null`
2.  **Random**：
    *   `7.random` 是 `null` -> `7'.random` = `null`。
    *   `13.random` 是 `7` -> `13'.random` = `7.next` (即 `7'`)。
3.  **拆分**：
    *   `curr` = 7, `copy` = 7'。
    *   `7.next` 指向 `13`。
    *   `7'.next` 指向 `13'`。
    *   `curr` 移到 13, `copy` 移到 13'。
    *   `13.next` 指向 `null`。
    *   `13'.next` 指向 `null`。
    *   结束。
    *   原链表恢复 `7->13`，新链表 `7'->13'` (其中 `13'.random` 指向 `7'`)。

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | $O(n)$。两种方法都需要遍历链表常数次。 |
| **空间复杂度** | 哈希表法 $O(n)$ (存储映射)。拼接拆分法 $O(1)$ (不计返回结果)。 |
