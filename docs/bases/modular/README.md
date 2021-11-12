---
title: '模块化'
navbar: true
description: '模块化'
tags: ['前端基础','js', 'css', 'html']
---

## 什么是模块化

[模块化](https://segmentfault.com/a/1190000017466120)

- commonjs和es6的差别
    1. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
    2. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。（第二个差异是因为 CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。）

### 总结

- CommonJS规范主要用于服务端编程，加载模块是同步的，这并不适合在浏览器环境，因为同步意味着阻塞加载，浏览器资源是异步加载的，因此有了AMD CMD解决方案。
- AMD规范在浏览器环境中异步加载模块，而且可以并行加载多个模块。不过，AMD规范开发成本高，代码的阅读和书写比较困难，模块定义方式的语义不顺畅。
- CMD规范与AMD规范很相似，都用于浏览器编程，依赖就近，延迟执行，可以很容易在Node.js中运行。不过，依赖SPM 打包，模块的加载逻辑偏重
- ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。

## AMD

- 代表require.js

## CMD

- 代表sea.js

## common.js

- CommonJS规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。

1. CommonJS模块的加载机制是，输入的是被输出的值的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。这点与ES6模块化有重大差异

``` js
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};
```

上面代码输出内部变量counter和改写这个变量的内部方法incCounter。

``` js
// main.js
var counter = require('./lib').counter;
var incCounter = require('./lib').incCounter;

console.log(counter);  // 3
incCounter();
console.log(counter); // 3
```

上面代码说明，counter输出以后，lib.js模块内部的变化就影响不到counter了。这是因为counter是一个原始类型的值，会被缓存。除非写成一个函数，才能得到内部变动后的值。

## ES6模块化

- 使用import命令的时候，用户需要知道所要加载的变量名或函数名，否则无法加载。为了给用户提供方便，让他们不用阅读文档就能加载模块，就要用到export default命令，为模块指定默认输出。

## IIFE

自执行函数

### 缺点

1. 多个依赖时会导致混乱，不好维护，难以确地依赖关系

## namespace模式 : 简单对象封装

### 缺点

1. 内部变量值会被修改
