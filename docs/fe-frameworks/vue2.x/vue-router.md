---
title: 'vue-router'
navbar: true
description: 'vue2.x'
tags: ['框架', 'vue', 'vue2.x', 'vue-router']
---

## 原理

[vue路由](https://zhuanlan.zhihu.com/p/27588422)

- mode:base hash history

- 监听的方法：popstate replacestate是否存存在 存在则用否则使用hashchange方法

- 实例化路由

    `matcher => createMatcher(routes) => createRouteMap(routes) => addRouteRecord`

    触发 push replace  方法

    `$router.push() --> HashHistory.push() --> History.transitionTo() --> History.updateRoute() --> {app._route = route} --> vm.render()`

    confirmTransition => transitionTo(location)

    ``` js
    const route = this.router.match(location, this.current) 
    ```

    ```js
    updateRoute (route: Route) {
        const prev = this.current
        this.current = route
        this.cb && this.cb(route)
        this.router.afterHooks.forEach(hook => {
            hook && hook(route, prev)
        })
    }
    ```

    cb:

    ```  js
    listen(cb) {
        this.cb = cb
    }
    
    history.listen(route => {
        this.apps.forEach((app) => {
            app._route = route
        })
    })
    ```

## vue-router类

```js

class VueRouter {
    constructor(options) {
        this.$options = options

        this.mode = options.mode || 'hash'
        this.routes = options.routes
        this.routerMap = {}
        this.app = new Vue({
            current: '/'
        })
    }

    init() {
        this.bindEvent()

        this.createRouterMap()  

        this.initComponent()
    }

    bindEvent() {
        window.addEventListener('hashchange', this.onHashChange.bind(this))
    }

    onHashChange() {
        this.app.current = window.location.hash.split('#')[1] || '/'
    }

    createRouterMap() {
        this.routes.forEach(route => {
            this.routerMap[route.path] = route
        });
    }

    initComponent() {
        Vue.component('router-view', {
            render: (h) => {
                let com = this.routerMap[this.app.current].component
                return h(com)
            }
        })
    }

}

let Vue
VueRouter.install = function(_Vue) {
    if(!Vue) {
        Vue = _vue
    }

    Vue.mixin({
        beforeCreate () {
            if(this.$options.router) {
                this.$options.router.init()
            }
        }
    })
}
```