const sidebar = require('./sidebar.js')
const nav = require('./nav.js')

module.exports = {
    base: '/interview/',
    head: [
        ['link', { rel: 'icon', href: 'favicon.ico' }],
    ],
    title: 'interview', // FIXME: 标题
    description: 'interview-持续学习记录',
    contentLoading: true,
    // dest: 'docs',
    markdown: {
        lineNumbers: true, // 代码显示行号
        extractHeaders: ["h2", "h3", "h4", "h5", "h6"], // 增加此配置可以为所有标题匹配
    },
    themeConfig: {
        search: true,
        displayAllHeaders: true, // 默认值：false
        sidebarDepth: 3, // 侧边栏菜单显示标题级别
        // 侧边栏菜单
        sidebar: {
            collapsable: true,
            ...sidebar
        },
        // 头部导航定义
        nav: nav,
        // 显示最后一次 git commit 提交的时间
        lastUpdated: '最后更新时间', // string | boolean
        // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
        // repo: 'https://github.com/moyuderen/interview',
        // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
        // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
        // repoLabel: '查看源码',

        // 以下为可选的编辑链接选项
        docsDir: 'docs',
        // 假如文档放在一个特定的分支下：
        docsBranch: 'docs',
        // 默认是 false, 设置为 true 来启用
        editLinks: true,
        // 默认为 "Edit this page"
        editLinkText: '帮助我们改善此页面！'
    },
    plugins: [
        '@vuepress/back-to-top'
    ]
}