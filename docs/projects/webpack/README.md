---
title: 'webpack'
navbar: true
description: 'webpack'
tags: ['项目问题', '项目', 'webpack']
---

## webpack

### webpack-HRM原理

![webpack-HRM原理](./HMR.png)

### Tree-shaking

[Tree-Shaking性能优化实践 - 原理篇](https://juejin.cn/post/6844903544756109319)
[Tree-Shaking性能优化实践 - 实践篇](https://juejin.cn/post/6844903544760336398)

### webpack优化

1. webpack自带tree shaking(去除无用代码)
2. uglifyjs(代码压缩混淆)/terser-webpack-plugin
3. include exclude
4. alias 别名@
5. extensions 出现频率较高的文件后缀
6. happyPack 多进程loader转换/terser-webpack-plugin
7. dll 抽离第三方模块 我们都不希望这个开发的主力框架每次都被打包一遍，这样也是费时费力的事情; 如react, vue ,等不需要修改的库；add-asset-html-webpack-plugin 在index.html引入dll
8. webpack-bundle-analyzer 明确使用的包
9. CDN 在html文件中引入cdn文件，在webpack配置 externals，这样就不会打包引入的cdn的库;html-webpack-externals-plugin插入CDN文件到index.html
10. noParse noParse的作用是不去解析你所使用的第三方库中的依赖库
11. IgnorePlugin 忽略打包第三方模块指定的目录
12. webpack-dev-server 热更新和代理
13. webpack4中自带了抽取公共代码的方法，通过optimization里的splitChunks来做到 如lodash, vue, vuex, react, react-dom第三方库

[带你深度解锁Webpack系列(优化篇)](https://juejin.cn/post/6844904093463347208)

### webpack如何分包

- 旧版本
    CommonsChunkPlugin
- webpack4

```js
module.exports = {
    optimization: {
        splitChunks: {
            cacheGroups: {
                utils: {
                    chunks: initial,
                    minSize: 0,
                    minChunks: 2 //两个文件使用
                }
            }
        }
    }
};
```

### 玩转webpackppt

1. [玩转webpackppt 第一章](/interview/玩转webpackppt第一章.pdf)
2. [玩转webpackppt 第二章](/interview/玩转webpackppt第二章.pdf)
3. [玩转webpackppt 第三章](/interview/玩转webpackppt第三章.pdf)
4. [玩转webpackppt 第四章](/interview/玩转webpackppt第四章.pdf)
5. [玩转webpackppt 第五章](/interview/玩转webpackppt第五章.pdf)
6. [玩转webpackppt 第六章](/interview/玩转webpackppt第六章.pdf)
7. [玩转webpackppt 第七章](/interview/玩转webpackppt第七章.pdf)
8. [玩转webpackppt 第八章](/interview/玩转webpackppt第八章.pdf)
