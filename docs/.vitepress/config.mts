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
      ]
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
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present'
    }
  }
})
