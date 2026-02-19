# 实现 Trie (前缀树)

[LeetCode 官方题目链接](https://leetcode.cn/problems/implement-trie-prefix-tree/)

## 1. 题目呈现

[LeetCode 208. Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/)

**Trie**（发音类似 "try"）或者说 **前缀树** 是一种树形数据结构，用于高效地存储和检索字符串数据集中的键。这一数据结构有相当多的应用情景，例如自动补完和拼写检查。

请你实现 Trie 类：

- `Trie()` 初始化前缀树对象。
- `void insert(String word)` 向前缀树中插入字符串 `word` 。
- `boolean search(String word)` 如果字符串 `word` 在前缀树中，返回 `true`（即，在插入之前，`word` 已插入到前缀树中）；否则，返回 `false` 。
- `boolean startsWith(String prefix)` 如果之前已经插入的字符串 `word` 的前缀之一为 `prefix` ，返回 `true` ；否则，返回 `false` 。

**示例：**

```
输入
["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]
输出
[null, null, true, false, true, null, true]

解释
Trie trie = new Trie();
trie.insert("apple");
trie.search("apple");   // 返回 True
trie.search("app");     // 返回 False
trie.startsWith("app"); // 返回 True
trie.insert("app");
trie.search("app");     // 返回 True
```

## 2. 思路拆解

Trie 树（字典树/前缀树）的核心思想是**空间换时间**，利用字符串的公共前缀来降低查询时间的开销以达到提高效率的目的。

**核心结构**：
- 我们可以把它看作一棵多叉树。
- 根节点不包含字符，除根节点外每一个节点都只包含一个字符。
- 从根节点到某一节点，路径上经过的字符连接起来，为该节点对应的字符串。
- 每个节点需要标记该节点是否是某个单词的结尾。

**实现细节**：
- 使用一个 `TrieNode` 类或者直接在 `Trie` 类中使用对象嵌套来表示节点。
- 每个节点包含：
  - `children`: 一个 Map 或者大小为 26 的数组/对象，用来存储指向子节点的指针。键是字符，值是子节点。
  - `isEnd`: 一个布尔值，表示该节点是否是某个单词的结尾。

**操作流程**：
1.  **Insert (插入)**:
    - 从根节点开始。
    - 遍历字符串的每个字符。
    - 如果当前节点的 `children` 中没有该字符对应的子节点，则创建一个新节点。
    - 移动到子节点。
    - 遍历结束后，将当前节点的 `isEnd` 设为 `true`。

2.  **Search (查找单词)**:
    - 从根节点开始。
    - 遍历字符串的每个字符。
    - 如果当前节点的 `children` 中没有该字符，说明单词不存在，返回 `false`。
    - 移动到子节点。
    - 遍历结束后，检查当前节点的 `isEnd` 是否为 `true`。只有完全匹配且是单词结尾才返回 `true`。

3.  **StartsWith (查找前缀)**:
    - 与 `Search` 类似。
    - 区别在于遍历结束后，不需要检查 `isEnd`。只要能顺利遍历完前缀的所有字符，就说明前缀存在，返回 `true`。

## 3. 代码实现

```javascript
/**
 * Initialize your data structure here.
 */
var Trie = function() {
    this.children = {};
    this.isEnd = false;
};

/**
 * Inserts a word into the trie. 
 * @param {string} word
 * @return {void}
 */
Trie.prototype.insert = function(word) {
    let node = this;
    for (const char of word) {
        if (!node.children[char]) {
            node.children[char] = new Trie();
        }
        node = node.children[char];
    }
    node.isEnd = true;
};

/**
 * Returns if the word is in the trie. 
 * @param {string} word
 * @return {boolean}
 */
Trie.prototype.search = function(word) {
    let node = this;
    for (const char of word) {
        if (!node.children[char]) {
            return false;
        }
        node = node.children[char];
    }
    return node.isEnd;
};

/**
 * Returns if there is any word in the trie that starts with the given prefix. 
 * @param {string} prefix
 * @return {boolean}
 */
Trie.prototype.startsWith = function(prefix) {
    let node = this;
    for (const char of prefix) {
        if (!node.children[char]) {
            return false;
        }
        node = node.children[char];
    }
    return true;
};

/** 
 * Your Trie object will be instantiated and called as such:
 * var obj = new Trie()
 * obj.insert(word)
 * var param_2 = obj.search(word)
 * var param_3 = obj.startsWith(prefix)
 */
```

## 4. 运行结果

```javascript
const trie = new Trie();
trie.insert("apple");
console.log(trie.search("apple"));   // true
console.log(trie.search("app"));     // false
console.log(trie.startsWith("app")); // true
trie.insert("app");
console.log(trie.search("app"));     // true
```

## 5. 复杂度分析

-   **时间复杂度**：
    -   `insert`: $O(m)$，其中 $m$ 是单词的长度。我们需要遍历单词的每个字符。
    -   `search`: $O(m)$。
    -   `startsWith`: $O(m)$。
-   **空间复杂度**：
    -   $O(T \times \Sigma)$，其中 $T$ 是所有插入单词的总长度，$\Sigma$ 是字符集的大小（如果是小写英文字母，$\Sigma = 26$）。最坏情况下，没有公共前缀，所有字符都存储为新节点。
