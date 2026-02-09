import { defineConfig } from 'vitepress'

// 统一的知识库侧边栏
function getKnowledgeSidebar() {
  return [
    {
      text: '导语',
      items: [
        { text: '知识库简介', link: '/knowledge/' }
      ]
    },
    {
      text: 'JavaScript/ES6/TypeScript',
      collapsed: false,
      items: [
        { text: 'JavaScript 基础', link: '/knowledge/javascript' }
      ]
    },
    {
      text: 'HTML&CSS',
      collapsed: false,
      items: [
        { text: 'HTML & CSS 高频题', link: '/knowledge/html-css' }
      ]
    },
    {
      text: '计算机网络',
      collapsed: false,
      items: [
        { text: '网络协议', link: '/knowledge/network' }
      ]
    },
    {
      text: '前端框架',
      collapsed: false,
      items: [
        { text: 'Vue', link: '/knowledge/vue' },
        { text: 'React', link: '/knowledge/react' }
      ]
    },
    {
      text: '数据结构与算法',
      collapsed: false,
      items: [
        { text: '基础算法', link: '/knowledge/data-structure' }
      ]
    },
    {
      text: '前端纵向领域',
      collapsed: false,
      items: [
        { text: '前端安全', link: '/knowledge/security' },
        { text: 'Node.js', link: '/knowledge/node' },
        { text: '数据可视化', link: '/knowledge/visualization' },
        { text: 'Three.js', link: '/knowledge/threejs' }
      ]
    },
    {
      text: '工程化',
      collapsed: false,
      items: [
        { text: '前端工程化', link: '/knowledge/engineering' }
      ]
    }
  ]
}

function getHot100Sidebar() {
  return [
    {
      text: '哈希',
      collapsed: false,
      items: [
        { text: '两数之和', link: '/hot100/hash/two-sum' },
        { text: '字母异位词分组', link: '/hot100/hash/group-anagrams' },
        { text: '最长连续序列', link: '/hot100/hash/longest-consecutive-sequence' }
      ]
    },
    {
      text: '双指针',
      collapsed: false,
      items: [
        { text: '移动零', link: '/hot100/two-pointers/move-zeroes' },
        { text: '盛最多水的容器', link: '/hot100/two-pointers/container-with-most-water' },
        { text: '三数之和', link: '/hot100/two-pointers/3sum' },
        { text: '接雨水', link: '/hot100/two-pointers/trapping-rain-water' }
      ]
    },
    {
      text: '滑动窗口',
      collapsed: false,
      items: [
        { text: '无重复字符的最长子串', link: '/hot100/sliding-window/longest-substring-without-repeating-characters' },
        { text: '找到字符串中所有字母异位词', link: '/hot100/sliding-window/find-all-anagrams-in-a-string' }
      ]
    },
    {
      text: '子串',
      collapsed: false,
      items: [
        { text: '和为 K 的子数组', link: '/hot100/substring/subarray-sum-equals-k' },
        { text: '滑动窗口最大值', link: '/hot100/substring/sliding-window-maximum' },
        { text: '最小覆盖子串', link: '/hot100/substring/minimum-window-substring' }
      ]
    },
    {
      text: '普通数组',
      collapsed: false,
      items: [
        { text: '最大子数组和', link: '/hot100/array/maximum-subarray' },
        { text: '合并区间', link: '/hot100/array/merge-intervals' },
        { text: '轮转数组', link: '/hot100/array/rotate-array' },
        { text: '除了自身以外数组的乘积', link: '/hot100/array/product-of-array-except-self' },
        { text: '缺失的第一个正数', link: '/hot100/array/first-missing-positive' }
      ]
    },
    {
      text: '矩阵',
      collapsed: false,
      items: [
        { text: '矩阵置零', link: '/hot100/matrix/set-matrix-zeroes' },
        { text: '螺旋矩阵', link: '/hot100/matrix/spiral-matrix' },
        { text: '旋转图像', link: '/hot100/matrix/rotate-image' },
        { text: '搜索二维矩阵 II', link: '/hot100/matrix/search-a-2d-matrix-ii' }
      ]
    },
    {
      text: '链表',
      collapsed: false,
      items: [
        { text: '相交链表', link: '/hot100/linked-list/intersection-of-two-linked-lists' },
        { text: '反转链表', link: '/hot100/linked-list/reverse-linked-list' },
        { text: '回文链表', link: '/hot100/linked-list/palindrome-linked-list' },
        { text: '环形链表', link: '/hot100/linked-list/linked-list-cycle' },
        { text: '环形链表 II', link: '/hot100/linked-list/linked-list-cycle-ii' },
        { text: '合并两个有序链表', link: '/hot100/linked-list/merge-two-sorted-lists' },
        { text: '两数相加', link: '/hot100/linked-list/add-two-numbers' },
        { text: '删除链表的倒数第 N 个结点', link: '/hot100/linked-list/remove-nth-node-from-end-of-list' },
        { text: '两两交换链表中的节点', link: '/hot100/linked-list/swap-nodes-in-pairs' },
        { text: 'K 个一组翻转链表', link: '/hot100/linked-list/reverse-nodes-in-k-group' },
        { text: '随机链表的复制', link: '/hot100/linked-list/copy-list-with-random-pointer' },
        { text: '排序链表', link: '/hot100/linked-list/sort-list' },
        { text: '合并 K 个升序链表', link: '/hot100/linked-list/merge-k-sorted-lists' },
        { text: 'LRU 缓存', link: '/hot100/linked-list/lru-cache' }
      ]
    },
    {
      text: '二叉树',
      collapsed: false,
      items: [
        { text: '二叉树的中序遍历', link: '/hot100/binary-tree/binary-tree-inorder-traversal' },
        { text: '二叉树的最大深度', link: '/hot100/binary-tree/maximum-depth-of-binary-tree' },
        { text: '翻转二叉树', link: '/hot100/binary-tree/invert-binary-tree' },
        { text: '对称二叉树', link: '/hot100/binary-tree/symmetric-tree' },
        { text: '二叉树的直径', link: '/hot100/binary-tree/diameter-of-binary-tree' },
        { text: '二叉树的层序遍历', link: '/hot100/binary-tree/binary-tree-level-order-traversal' },
        { text: '将有序数组转换为二叉搜索树', link: '/hot100/binary-tree/convert-sorted-array-to-binary-search-tree' },
        { text: '验证二叉搜索树', link: '/hot100/binary-tree/validate-binary-search-tree' },
        { text: '二叉搜索树中第 K 小的元素', link: '/hot100/binary-tree/kth-smallest-element-in-a-bst' },
        { text: '二叉树的右视图', link: '/hot100/binary-tree/binary-tree-right-side-view' },
        { text: '二叉树展开为链表', link: '/hot100/binary-tree/flatten-binary-tree-to-linked-list' },
        { text: '从前序与中序遍历序列构造二叉树', link: '/hot100/binary-tree/construct-binary-tree-from-preorder-and-inorder-traversal' },
        { text: '路径总和 III', link: '/hot100/binary-tree/path-sum-iii' },
        { text: '二叉树的最近公共祖先', link: '/hot100/binary-tree/lowest-common-ancestor-of-a-binary-tree' },
        { text: '二叉树中的最大路径和', link: '/hot100/binary-tree/binary-tree-maximum-path-sum' }
      ]
    },
    {
      text: '图论',
      collapsed: false,
      items: [
        { text: '岛屿数量', link: '/hot100/graph/number-of-islands' },
        { text: '腐烂的橘子', link: '/hot100/graph/rotting-oranges' },
        { text: '课程表', link: '/hot100/graph/course-schedule' },
        { text: '实现 Trie (前缀树)', link: '/hot100/graph/implement-trie-prefix-tree' }
      ]
    },
    {
      text: '回溯',
      collapsed: false,
      items: [
        { text: '全排列', link: '/hot100/backtrack/permutations' },
        { text: '子集', link: '/hot100/backtrack/subsets' },
        { text: '电话号码的字母组合', link: '/hot100/backtrack/letter-combinations-of-a-phone-number' },
        { text: '组合总和', link: '/hot100/backtrack/combination-sum' },
        { text: '括号生成', link: '/hot100/backtrack/generate-parentheses' },
        { text: '单词搜索', link: '/hot100/backtrack/word-search' },
        { text: '分割回文串', link: '/hot100/backtrack/palindrome-partitioning' },
        { text: 'N 皇后', link: '/hot100/backtrack/n-queens' }
      ]
    },
    {
      text: '二分查找',
      collapsed: false,
      items: [
        { text: '搜索插入位置', link: '/hot100/binary-search/search-insert-position' },
        { text: '搜索二维矩阵', link: '/hot100/binary-search/search-a-2d-matrix' },
        { text: '在排序数组中查找元素的第一个和最后一个位置', link: '/hot100/binary-search/find-first-and-last-position-of-element-in-sorted-array' },
        { text: '搜索旋转排序数组', link: '/hot100/binary-search/search-in-rotated-sorted-array' },
        { text: '寻找旋转排序数组中的最小值', link: '/hot100/binary-search/find-minimum-in-rotated-sorted-array' },
        { text: '寻找两个正序数组的中位数', link: '/hot100/binary-search/median-of-two-sorted-arrays' }
      ]
    },
    {
      text: '栈',
      collapsed: false,
      items: [
        { text: '有效的括号', link: '/hot100/stack/valid-parentheses' },
        { text: '最小栈', link: '/hot100/stack/min-stack' },
        { text: '字符串解码', link: '/hot100/stack/decode-string' },
        { text: '每日温度', link: '/hot100/stack/daily-temperatures' },
        { text: '柱状图中最大的矩形', link: '/hot100/stack/largest-rectangle-in-histogram' }
      ]
    },
    {
      text: '堆',
      collapsed: false,
      items: [
        { text: '数组中的第K个最大元素', link: '/hot100/heap/kth-largest-element-in-an-array' },
        { text: '前 K 个高频元素', link: '/hot100/heap/top-k-frequent-elements' },
        { text: '数据流的中位数', link: '/hot100/heap/find-median-from-data-stream' }
      ]
    },
    {
      text: '贪心算法',
      collapsed: false,
      items: [
        { text: '买卖股票的最佳时机', link: '/hot100/greedy/best-time-to-buy-and-sell-stock' },
        { text: '跳跃游戏', link: '/hot100/greedy/jump-game' },
        { text: '跳跃游戏 II', link: '/hot100/greedy/jump-game-ii' },
        { text: '划分字母区间', link: '/hot100/greedy/partition-labels' }
      ]
    },
    {
      text: '动态规划',
      collapsed: false,
      items: [
        { text: '爬楼梯', link: '/hot100/dp/climbing-stairs' },
        { text: '杨辉三角', link: '/hot100/dp/pascals-triangle' },
        { text: '打家劫舍', link: '/hot100/dp/house-robber' },
        { text: '完全平方数', link: '/hot100/dp/perfect-squares' },
        { text: '零钱兑换', link: '/hot100/dp/coin-change' },
        { text: '单词拆分', link: '/hot100/dp/word-break' },
        { text: '最长递增子序列', link: '/hot100/dp/longest-increasing-subsequence' },
        { text: '乘积最大子数组', link: '/hot100/dp/maximum-product-subarray' },
        { text: '分割等和子集', link: '/hot100/dp/partition-equal-subset-sum' },
        { text: '最长有效括号', link: '/hot100/dp/longest-valid-parentheses' }
      ]
    },
    {
      text: '多维动态规划',
      collapsed: false,
      items: [
        { text: '不同路径', link: '/hot100/multidimensional-dp/unique-paths' },
        { text: '最小路径和', link: '/hot100/multidimensional-dp/minimum-path-sum' },
        { text: '最长回文子串', link: '/hot100/multidimensional-dp/longest-palindromic-substring' },
        { text: '最长公共子序列', link: '/hot100/multidimensional-dp/longest-common-subsequence' },
        { text: '编辑距离', link: '/hot100/multidimensional-dp/edit-distance' }
      ]
    },
    {
      text: '技巧',
      collapsed: false,
      items: [
        { text: '只出现一次的数字', link: '/hot100/skills/single-number' },
        { text: '多数元素', link: '/hot100/skills/majority-element' },
        { text: '颜色分类', link: '/hot100/skills/sort-colors' },
        { text: '下一个排列', link: '/hot100/skills/next-permutation' },
        { text: '寻找重复数', link: '/hot100/skills/find-the-duplicate-number' }
      ]
    }
  ]
}

export default defineConfig({
  title: "Ac-Study",
  description: "前端八股文与面试总结",
  themeConfig: {
    // 顶部左侧 Logo
    logo: '/image.png',

    // 顶部导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '知识库', link: '/knowledge/html-css', activeMatch: '/knowledge/' },
      { text: '面经总结', link: '/interview/' },
      { text: 'Hot100', link: '/hot100/' },
      { text: '一起学习', link: '/study/' }
    ],

    // 侧边栏配置
    sidebar: {
      '/knowledge/': getKnowledgeSidebar(),

      // 面经
      '/interview/': [
        {
          text: '面试总结',
          items: [
            { text: '大厂面经', link: '/interview/big-company' },
            { text: '中厂面经', link: '/interview/medium-company' },
            { text: '小厂面经', link: '/interview/small-company' },
          ]
        }
      ],
      '/hot100/': getHot100Sidebar()
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ac666666666/vitepress' }
    ],

    // 本地搜索
    search: {
      provider: 'local'
    },

    // 页脚
    footer: {
      message: 'Power by VitePress',
      copyright: 'Copyright © 2026-present Ac-Study | All Rights Reserved'
    }
  }
})
