# LRU 缓存

[LeetCode 官方题目链接](https://leetcode.cn/problems/lru-cache/)

## 1. 题目呈现

**难度等级**：🟡 中等  
**核心考察点**：哈希表、双向链表、设计

请你设计并实现一个满足 **LRU (最近最少使用) 缓存** 约束的数据结构。

实现 `LRUCache` 类：
*   `LRUCache(int capacity)` 以 **正整数** 作为容量 `capacity` 初始化 LRU 缓存。
*   `int get(int key)` 如果关键字 `key` 存在于缓存中，则返回关键字的值，否则返回 `-1` 。
*   `void put(int key, int value)` 如果关键字 `key` 已经存在，则变更其数据值 `value` ；如果不存在，则向缓存中插入该组 `key-value` 。如果插入操作导致关键字数量超过 `capacity` ，则应该 **逐出** 最久未使用的关键字。

函数 `get` 和 `put` 必须以 `O(1)` 的平均时间复杂度运行。

> **示例：**
>
> **输入**
> ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
> [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
>
> **输出**
> [null, null, null, 1, null, -1, null, -1, 3, 4]

---

## 2. 解题思路拆解

**LRU (Least Recently Used)** 算法的核心思想是：如果数据最近被访问过，那么将来被访问的几率也更高。当缓存满了，优先淘汰最久没被访问的数据。

**数据结构选择**：
1.  **查找 O(1)**：必须使用 **哈希表 (Map)**。
2.  **排序 O(1)**：需要维护访问顺序（谁最近被访问，谁最久未访问）。数组插入删除是 O(n) 的，链表插入删除是 O(1) 的。
3.  **结合**：哈希表 + **双向链表**。
    *   哈希表存储 `key -> Node`，实现 O(1) 查找。
    *   双向链表维护顺序：
        *   **最近使用** 的放在 **链表尾部** (tail)。
        *   **最久未使用** 的放在 **链表头部** (head)。

**操作逻辑**：
*   `get(key)`:
    *   如果在 Map 中不存在，返回 -1。
    *   如果存在，返回 `node.value`，并将该节点移动到链表尾部（表示最近使用）。
*   `put(key, value)`:
    *   如果 `key` 已存在：更新 `value`，将节点移动到链表尾部。
    *   如果 `key` 不存在：
        *   创建新节点。
        *   添加到链表尾部。
        *   添加到 Map。
        *   如果容量超了：删除链表头部节点（最久未使用），并从 Map 中删除对应 key。

---

## 3. 代码实现

```javascript
/**
 * 双向链表节点
 * @param {number} key 
 * @param {number} value 
 */
var ListNode = function(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
}

/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // key -> node
    
    // 哨兵节点：dummyHead (最久未使用) <-> ... <-> dummyTail (最近使用)
    this.dummyHead = new ListNode(0, 0);
    this.dummyTail = new ListNode(0, 0);
    this.dummyHead.next = this.dummyTail;
    this.dummyTail.prev = this.dummyHead;
    this.count = 0;
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
    if (!this.map.has(key)) return -1;
    
    const node = this.map.get(key);
    // 移动到末尾 (最近使用)
    this.moveToTail(node);
    
    return node.value;
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
    if (this.map.has(key)) {
        // 更新值，并移动到末尾
        const node = this.map.get(key);
        node.value = value;
        this.moveToTail(node);
    } else {
        // 新增节点
        const newNode = new ListNode(key, value);
        this.map.set(key, newNode);
        this.addToTail(newNode);
        this.count++;
        
        // 如果超容，删除头部
        if (this.count > this.capacity) {
            const nodeToDelete = this.dummyHead.next;
            this.removeNode(nodeToDelete);
            this.map.delete(nodeToDelete.key);
            this.count--;
        }
    }
};

// --- 辅助函数 ---

// 将节点移动到末尾
LRUCache.prototype.moveToTail = function(node) {
    this.removeNode(node);
    this.addToTail(node);
}

// 从链表中移除节点
LRUCache.prototype.removeNode = function(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
}

// 添加节点到末尾
LRUCache.prototype.addToTail = function(node) {
    const realTail = this.dummyTail.prev;
    realTail.next = node;
    node.prev = realTail;
    node.next = this.dummyTail;
    this.dummyTail.prev = node;
}
```

#### 代码执行演示
`capacity = 2`

1.  `put(1, 1)`:
    *   Map: `{1: Node(1,1)}`
    *   List: `Head <-> 1 <-> Tail`
2.  `put(2, 2)`:
    *   Map: `{1: Node(1,1), 2: Node(2,2)}`
    *   List: `Head <-> 1 <-> 2 <-> Tail` (2 在尾部，最近使用)
3.  `get(1)`:
    *   返回 1。
    *   移动 1 到尾部。
    *   List: `Head <-> 2 <-> 1 <-> Tail` (1 变最近了)
4.  `put(3, 3)`:
    *   容量满。删除 Head.next (即 2)。
    *   Map 删除 2。
    *   插入 3 到尾部。
    *   Map: `{1: Node(1,1), 3: Node(3,3)}`
    *   List: `Head <-> 1 <-> 3 <-> Tail`
5.  `get(2)`:
    *   Map 中无 2。返回 -1。

---

## 4. 复杂度分析

| 维度 | 描述 |
| :--- | :--- |
| **时间复杂度** | `get`: $O(1)$。`put`: $O(1)$。哈希表查找和链表操作都是常数时间。 |
| **空间复杂度** | $O(capacity)$。哈希表和双向链表最多存储 `capacity` 个节点。 |
