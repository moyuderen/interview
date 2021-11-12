

module.exports = {
    '/bases/': [
        '/bases/html/',
        '/bases/css/',
        '/bases/javascript/',
        '/bases/typescript/',
        '/bases/browser/',
        '/bases/modular/',
    ],
    // 数据结构与算法
    '/data-structures-and-algorithms/': [
        '/data-structures-and-algorithms/data-structures',
        '/data-structures-and-algorithms/algorithms',
        // {
        //     title: '数据结构与算法',
        //     collapsable: false,
        //     children: [
        //         '/data-structures-and-algorithms/data-structures',
        //         '/data-structures-and-algorithms/algorithms'
        //     ]
        // },
    ],

    // 设计模式
    '/design-patterns/': [''],
    
    // 好文推荐
    '/good-articles/': [''],

    // 项目问题
    '/projects/': [
        '',
        '/projects/webpack/'
    ],

    // 框架
    '/fe-frameworks/': [
        {
            title: '前端框架',
            collapsable: false,
            children: [
                {
                    title: 'vue2.x',
                    collapsable: false,
                    children: [
                        '/fe-frameworks/vue2.x/',
                        '/fe-frameworks/vue2.x/vue-router',
                        '/fe-frameworks/vue2.x/vuex',
                    ]
                },
                {
                    title: 'vue3.x',
                    collapsable: false,
                    children: [
                        '/fe-frameworks/vue3.x/',
                    ]
                },
                {
                    title: 'react',
                    collapsable: false,
                    children: [
                        '/fe-frameworks/react/',
                    ]
                },
                {
                    title: 'ssr',
                    collapsable: false,
                    children: [
                        '/fe-frameworks/ssr/',
                    ]
                },
                {
                    title: '微前端',
                    collapsable: false,
                    children: [
                        '/fe-frameworks/server-less/',
                    ]
                },
            ]
        },
    ],

    // 实战
    '/practice/': [
        '',
        '/practice/empty',
    ],
}
    

