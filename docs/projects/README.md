---
title: '项目问题'
navbar: true
description: '项目问题'
tags: ['项目问题', '项目']
---

## 项目介绍

负责*****业务相关需求的开发，某业务的话就是从买家意向购买车，到车交到买家手上的流程；包括，相关材料的邮寄，车的物流，提档，落档，过户，接车（车况检查），交付顾问邀约客户最后的接待看车；完成交车；送车上门等流程；

主要包括对车商的工单，提档落档，车商账单，

对一线人员如交付顾问提供的工具应用，材料的邮寄接收，车况的记录等

整个交付流程的crm后台，gps管理。手续材料，车务工单，交付任务，交付顾问带看工单，交付引擎

## 项目难点

- 上传组件，兼容多个app,包括测试时候的web环境，私有云，公有云，七牛金山云
- 业务上各种表单提交比较多，入材料手续，快递材料，具体的车况信息等待；抽离封装
- 流程图
- 录音，视频
  - h5
    - h5录制状态
    - 兜底时间30min, 客户端的同步（多次调用）
    - 视频的分段，到达兜底时间的时候是否继续录制
    - 多个接待看车任务的时候，只能有一个录制任务存在
    - 退出webview页面的时候，状态会丢失；需要把录制状态，或者兜底时间存在native端（小的插曲，就是native对clear支持不是很好，经常会导致app崩溃，定位问题找了好久）
      - 所以为了方便开发和调试，整理开发了一个用于native的交互的调试页面，上面包含了常用的交付api的调用；和打印出报错信息
    - 外接设备的不稳定性，导致设备断开等问题，需要对这些特殊的边界情况进行处理，是重置状态，还是直接完成录制
    - 业务过程中操作的不断升级，录制音频，智能眼镜。为了不对流程进行卡点，兼容多种的方式
  - crm 播放，mp4和流

## 项目优化

### 首屏优化

1. 图片懒加载

### 开发体验优化

#### 切换test pre online环境

#### 如何定位性能瓶颈

> 控制台观察

- 观察js css 图片的加载速率
- performance
    1. 看饼状图 看性能瓶颈
    2. 准备发起请求

#### 网络

- DSN(DNS预解析DNS Prefetch)
- 建立TCP连接（减少http请求的量 资源整合） 请求资源 返回资源 渲染domm

#### webpack

- 基础环境
    1. include exclude
    2. 压缩打包
    3. 分包处理
        1. 懒加载路由
        2. splitChunks
        3. dll 抽取公用的模块

- 测试环境
    1. `unused-files-webpack-plugin` 没有使用到的文件
    2. `webpack-bundle-analyzer` 分析包的大小 上传到远端查看
    3. `sw-precache-webpack-plugin` 打包速度
    4. `webpack-dev-server` 开启热更新

#### nginx

- 配置里 index.html no-store
- js css png图片等使用 expires max
- 开启了gzip

#### 离线化平台

1. 部署信息
   1. 构建时间
   2. 构建人
   3. 构建文件
   4. 提交信息（commitID）分支
   5. 等等

## 项目监控

### 错误监控

[JS错误捕获](https://juejin.cn/post/6844904113134632973)
[如何处理 JavaScript 的异步捕获？](https://www.imyangyong.com/blog/2020/06/javascript/%E5%A6%82%E4%BD%95%E5%A4%84%E7%90%86%20JavaScript%20%E7%9A%84%E5%BC%82%E6%AD%A5%E6%8D%95%E8%8E%B7%EF%BC%9F/)
[常见的错误拦截](https://blog.fundebug.com/2018/12/07/how-to-handle-frontend-error/)

1. `window.onerror()` 可以捕获同步或者异步运行时的错误，但是不能捕获语法错误； 也不能捕获资源加载的和接口异常的错误

    ``` js
    window.onerror(message, source, lineno, colno, error){
    // message：错误信息（字符串）。可用于HTML onerror=""处理程序中的event。
    // source：发生错误的脚本URL（字符串）
    // lineno：发生错误的行号（数字）
    // colno：发生错误的列号（数字）
    // error：Error对象（对象） 
    }
    ```

    - 如果想通过onerror函数收集不同域的js错误，我们需要做两件事：
    - 相关的js文件上加上`Access-Control-Allow-Origin:*`的response header
    - 引用相关的js文件时加上crossorigin属性

2. `unhandledrejection` 继承自 [`PromiseRejectionEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/PromiseRejectionEvent)，而 [`PromiseRejectionEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/PromiseRejectionEvent) 又继承自 [`Event`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event)。因此`unhandledrejection` 含有 `PromiseRejectionEvent` 和 `Event` 的属性和方法。

    - 当[`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 被 reject 且没有 reject 处理器的时候，会触发 **`unhandledrejection`** 事件；这可能发生在 [`window`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window) 下，但也可能发生在 [`Worker`](https://developer.mozilla.org/zh-CN/docs/Web/API/Worker) 中。 这对于调试回退错误处理非常有用。

    ```js
    window.addEventListener("unhandledrejection", event => {
        console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
    });
    ```

    - unhandledrejection 只能捕获未显式处理的Promise异常

    ```js
    // 能触发 unhandledrejection ，因为未显式处理
    Promise.reject('test').then()

    // 能触发 unhandledrejection ，因为未显式处理
    Promise.reject('test').then(console.log)

    // 不能触发 unhandledrejection ，因为已处理
    Promise.reject('test').then(console.log, console.log)

    // 不能触发 unhandledrejection ，因为没处理，直接抛出异常
    Promise.reject('test')
    ```

    在 ES6 的 Promise 中，对于直接 reject 的异常未处理任务，不会进行错误提示：

    ```js
    const rejected = Promise.reject('err') // 直接报异常
    ```

    除非手动去处理一下：

    ```js
    const rejected = Promise.reject('err')

    rejected.catch(function (err) {
        console.log('catch', err)
    })
    ```

3. try catch 只能捕获同步**运行**的错误，对**语法**和**异步**错误无法捕获

   ```js
   try {
   
   } catch {
   
   }
   ```

4. 接口请求的错误
    - ajax

    ```js
    window.addEventListener('error', (e)=>{
        console.log('addEventListener')
        console.log(e)
    }
    ```

    - fetch

    ```js
    window.addEventListener("unhandledrejection", function(e) {
        console.log('unhandledrejection')
        console.log(e)
    }, true);
    ```

5. 资源加载错误`window.addEventListener('error',(e)=> {})`
6. iframe

    ```js
    var frames = window.frames;
    for (var i = 0; i < frames.length; i++) { 
        frames[i].addEventListener('error', (e)=>{
            console.log('addEventListener')
            console.log(e)
        }, true);
    }
    ```

. vue

- [errorCaptured](https://cn.vuejs.org/v2/api/#errorCaptured)钩子

- sentry

  - 对window.onerror和unhandlerejection的重写
  - 跨浏览的兼容
  - [sentry原理](https://segmentfault.com/a/1190000023089675)
  - [源码解析 知乎](https://zhuanlan.zhihu.com/p/75577689)

  - window.onerror
    - 只能捕获运行时错误
    - 无法捕获语法错误
    - 无法捕获资源加载错误（可使用window.addEventListener('error')  资源加载错误的节点活冒泡到window对象， 并且没法知道错误码）

### 埋点监控

阅读tracker源码

fetch
ajax
image图片上报
Navigator.sendBeacon()

### 性能监控

利用`window.performance`来统计

### 敏感数据反爬

1. css font
    - 自己生成wotff
    - 不同的unicode码对应数字
    - 规则给到后端
    - 后端对敏感数字返回相对应的unicode
    - 前端通过自定义字体解析unicode展示响应的内容

## native-sdk

### h5和nativa通信

1. native在webview的全局`window`对象下面挂载了一个全局对象`webviewJsBridge`
2. `webviewJsBridge`中有`callHandler`和`registter`方法
3. h5调用native方法使用

    ```js
    window.webviewJsBridge.callHandler(apiName, callback)
    ```

    三种 js 调用 native 方法

    - 拦截 Url Schema（假请求）
    - 拦截 prompt alert confirm
    - 注入 JS 上下文

4. native调用js

    ```js
    window.webviewJsBridge.registerHandler(apiName, callback)
    ```

![图1](/interview//native-sdk/通信1.png)
![通信2](/interview//native-sdk/通信2.png)

### h5调用native

![h5调用native](/interview//native-sdk/h5调用native.png)

### native调用h5

![native调用h5](/interview//native-sdk/native调用h5.png)

### 参考资料

[JSBridge 实现原理解析](https://segmentfault.com/a/1190000025182935)

## 其他

### 抓包

1. charles
2. [spy-debugger](https://github.com/wuchangming/spy-debugger)
3. [whistlejs](https://wproxy.org/whistle/questions.html)

### CDN

- [cdn为什么快，原理](https://segmentfault.com/a/1190000039045541)
- [cdn回源](https://www.huaweicloud.com/zhishi/cdn001.html)

### spa页面 和 多页面对比

- [spa和多页面的优势和缺点](https://juejin.cn/post/6913436819115737102)
spa

- 优点
    1. 切换的流畅度比较高
    2. 前后端分离，利于维护
    3. 减轻服务端压力
    4. 跳转动画有优化的空间
- 缺点
    1. seo不友好
    2. 一次要加载所有资源（可使用路由懒加载）
    3. 需要额外的管理路由（不能使用浏览器天然的前进后退）
        - 这里需要去复习弄清楚 vue-router的原理

> mpa  

- 优点
    1. seo友好
    2. 首屏加载快
- 缺点
    1. 每次都需要去加载公告的资源（js, css, html，图片等）
    2. 页面跳转没有跳转动画
    3. 项目维护起来比较麻烦，重复的代码较大

#### 解决方案

- 可使用ssr方案解决

## 项目介绍思路

### 思路和角度

- 业务相关
    1. 业务数据 tracker
    2. 业务流程（业务理解）
    3. 项目规划

- 技术相关
    1. 采集业务数据 tracker
    2. 性能监控
    3. 错误捕获 sentry
    4. 错误监控
        1. 页面错误
        2. 接口错误

    5. 代码质量
        1. sonar
        2. ts
        3. elsint stylelint husky
        4. 代码review
    6. 项目优化
        1. 首页优化
        2. 打包优化 html, js, css
            1. 分包
            2. 压缩
            3. tree shaking
            4. 抽离css
            5. webpack 其他优化问题
        3. 开发（体验）阶段优化
        4. cdn
        5. ssr
        6. 离线化
    7. 代码重构
    8. 字体反爬
    9. native-sdk原理

### 项目亮点难点

- typescript
- sentry
- 友商过户评分 用到zrender 绘制了评分雷达图
- 重构
  - 重构原因
    - 项目各个列表 和 订单耦合度过大，添加新功能时改动过大
    - 向公司的ske-cli脚手架靠拢，统一开发模式
    - 引入typescript 代码的约束

  - 重构的方案
    - 创建新到的代码到src目录下，把久的项目放入old的目录下， 分别打包，把最后的dist包合并到一起
    - 新老页面跳转 replace的方式跳转（封装了跳转方法，过渡阶段需要使用）
    - 抽离公用组件
    - 抽离页面代码 解耦
    - 新老页面跳转 白屏问题
    - 加入单元测试

  - 重构顺序和重构时机
    - 制定了重构的计划： 列出步骤和方向
    - 把不流量小的页面首先抽离重构
    - 二级页面，或者三级页面重构
    - 抽离出一些公用的模块 button，头部，没网，没数据的组件，toast,dialog组件，或者native方法封装
    - 最后重构一级页面，和改动频繁的页面，建立新的测试分支
    - 每个模块的完事后的自测 开会codereview代码，测试环境的部署，稳定一段时间后，合分支准上线

  - 遇到的问题

    - 新老页面白屏问题（nginx配置缓存html）
    - eslint冲突
    - 新旧页面的baseUrl不同，协调客户端进行强更
    - 兜底方案 nginx重定向，把旧的页面重定向到新的页面
    - 健康检查 url改变，导致健康检查过不去，更新部署包

  - 重定向
        保证没有强制更新的用户 能够用正常跳转到页面

    ```nginx
    location ~ /partners_app/brokerage-agency.html {
        rewrite /partners_app/brokerage-agency.html(.*) /partners_app/$1 permanent;
    }
    ```
