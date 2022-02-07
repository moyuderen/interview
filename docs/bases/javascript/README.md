---
title: 'javascript基础'
navbar: true
description: '前端基础'
tags: ['前端基础','js', 'css', 'html']
---

## 闭包

[闭包](https://github.com/mqyqingfeng/Blog/issues/9)

ECMAScript中，闭包指的是：

- 从理论角度：所有的函数。因为它们都在创建的时候就将上层上下文的数据保存起来了。哪怕是简单的全局变量也是如此，因为函数中访问全局变量就相当于是在访问自由变量，这个时候使用最外层的作用域。

- 从实践角度：以下函数才算是闭包：
  - 即使创建它的上下文已经销毁，它仍然存在（比如，内部函数从父函数中返回）
  - 在代码中引用了自由变量

## 变量提升

## this

[JavaScript深入之从ECMAScript规范解读this](https://github.com/mqyqingfeng/Blog/issues/7)

## 对象继承

[JavaScript深入之继承的多种方式和优缺点](https://github.com/mqyqingfeng/Blog/issues/16)
[参考文章](https://github.com/mqyqingfeng/Blog/issues/16)

- 原型链继承
- 构造函数继承
- 组合继承

```js
// https://github.com/mqyqingfeng/Blog/issues/16
function Parent(name) {
    this.name = name
}

Parent.prototype.say = function() {
    console.log(this.name)
}


function Child(name, sex) {
    Parent.call(this, name)
    this.name = name
    this.sex = sex
}
// 不使用Child.prototype = Parent.prototype  内存共享Parent的原型改变会影响到Child
// 不使用Child.prototype = new Parent()  会多调用一次Parent的构造方法（Parent.call()）, 多存一份实例属性

Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child
```

## 箭头函数和普通函数的区别

1. 箭头函数的this指向，（定义时的所在的对象，不是调用的时候）（或者是一个包裹的不是箭头函数的函数调用时this的指向）
2. 箭头函数使用bind无效
3. 箭头函数没有arguments参数
4. 箭头函数没法new一个对象
5. 不可以使用yield命令， 因此箭头函数不能用作 Generator 函数

## 将虚拟的dom转换为真实的dom

```js
{
  tag: 'DIV',
  attrs:{
    id:'app'
  },
  children: [
    {
      tag: 'SPAN',
      children: [
        { tag: 'A', children: [] }
      ]
    },
    {
      tag: 'SPAN',
      children: [
        { tag: 'A', children: [] },
        { tag: 'A', children: [] }
      ]
    }
  ]
}
```

把上诉虚拟Dom转化成下方真实Dom

```html
<div id="app">
  <span>
    <a></a>
  </span>
  <span>
    <a></a>
    <a></a>
  </span>
</div>
```

```js
// 题解

const domTree = {
    tag: 'DIV',
    attrs: {
        id: 'app'
    },
    children: [{
            tag: 'SPAN',
            children: [{
                tag: 'A',
                children: []
            }]
        },
        {
            tag: 'SPAN',
            children: [{
                    tag: 'A',
                    children: []
                },
                {
                    tag: 'A',
                    children: ['我是一个数字1', 1]
                }
            ]
        },
        '我是一个文本节点'
    ]
}

function createDom(domTree) {
    if (typeof domTree === 'string' || typeof domTree === 'number') {
        return document.createTextNode(domTree)
    }
    return document.createElement(domTree.tag)
}

function setAttrs(dom, key, value) {
    dom.setAttribute(key, value)
}

function createRealDom(domTree) {
    let dom = createDom(domTree)

    if (domTree.attrs) {
        Object.keys(domTree.attrs).forEach(key => {
            setAttrs(dom, key, domTree.attrs[key])
        })
    }

    if (domTree.children) {
        domTree.children.forEach(child => {
            const childDom = createRealDom(child)
            dom.appendChild(childDom)
        })
    }

    return dom
}

console.log(createRealDom(domTree))

```

## 跨域

## 类型判断

```js
// 1. typeof
    /**
     * 无法判断对象类型的具体类型
     */
// 2. instanceof
    /**
     * instanceof  用来判断原始类型是不行的
     */
// 3. Object.prototype.toString.call(obj)

// 判断数组

let arr1 = [1, 2, 3, 4]

// instanceof
arr1 instanceof Array

// Array.isArray()  es6方法
Array.isArray(arr1)

// Object.prototype.toString.call() 比较常用了  在loadsh, axios等库中用来判断类型
Object.prototype.toString.call(arr1)
```

## 金额处理

[参考](https://www.jianshu.com/p/928c68f92c0c)

```js
// https://www.jianshu.com/p/928c68f92c0c 

function numFormat(num) {
    let [r1, r2] = num.toString().split('.')

    let ar1 = r1.split('').reverse()
    let res = []
    for(let i=0; i<ar1.length; i++) {
        if (i != 0 && i % 3 === 0) {
            res.push(',')
        }
        res.push(ar1[i])
    }
    res.reverse()
    r1 = res.join('')
    if(r2) {
        return r1 + '.' + r2
    }else {
        return r1
    }
}

function qian(num) {
    let [zhengshu, fenshu] = num.toString().split('.')
    let zhengshuArr = zhengshu.split('').reverse()
    let resultArr = []

    for(let i=0; i<zhengshuArr.length; i++) {
        if(i!=0 && i%3===0) {
            resultArr.push(',')
        }
        resultArr.push(zhengshuArr[i])
    }

    let zhengshuStr = resultArr.reverse().join('')
    return `${zhengshuStr}${fenshu ? `.${fenshu}` : ''}`
}
```

## 实现filter

```js
Array.prototype.filter = function (callback, thisArg) {
    if (this == null) {
        throw new TypeError('this is null or not defined')
    }

    if (typeof callback !== "function") {
        throw new TypeError(callback + ' is not a function')
    }

    let arr = Object(this)
    let len = arr.length
    let k = 0
    let result
    while (k < len) {
        if (k in arr) {
            if(callback.call(thisArg, arr[k], k, arr)) {
                result.push(arr[k])
            }
        }

        k++
    }

    return result
}
```

## 实现forEach

```js
Array.prototype.forEach = function(callback, thisArg) {
    if (this == null) {
        throw new TypeError('this is null or not defined')
    }

    if (typeof callback !== "function") {
        throw new TypeError(callback + ' is not a function')
    }

    let arr = Object(this)
    let len = arr.length
    let k = 0

    while(k < len) {
        if(k in arr) {
            callback.call(thisArg, arr[k], k, arr)
        }

        k++
    }
}
```

## 实现map

```js
Array.prototype.map = function (callback, thisArg) {
    if (this == null) {
        throw new TypeError('this is null or not defined')
    }

    if (typeof callback !== "function") {
        throw new TypeError(callback + ' is not a function')
    }

    let arr = Object(this)
    let len = arr.length
    let k = 0
    let result
    while (k < len) {
        if (k in arr) {
            result[k] = callback.call(thisArg, arr[k], k, arr)
        }

        k++
    }

    return result
}
```

## 实现reduce

```js
Array.prototype.reduce = function (callback, thisArg) {
    if (this == null) {
        throw new TypeError('this is null or not defined')
    }

    if (typeof callback !== "function") {
        throw new TypeError(callback + ' is not a function')
    }

    let arr = Object(this)
    let len = arr.length
    let k = 0
    let acc
    if (thisArg) {
        acc = thisArg
    }else {
        // 没传入初始值的时候，取数组中第一个非 empty 的值为初始值
        while (k < len && !(k in arr)) {
            k++
        }
        if (k > len) {
            throw new TypeError('Reduce of empty array with no initial value');
        }
        acc = arr[k++]
    }

    while (k < len) {
        if (k in arr) {
            acc = callback.call(acc, arr[k], k, arr)
        }

        k++
    }

    return acc
}
```

## 实现some

```js
Array.prototype.some = function (callback, thisArg) {
    if (this == null) {
        throw new TypeError('this is null or not defined')
    }

    if (typeof callback !== "function") {
        throw new TypeError(callback + ' is not a function')
    }

    let arr = Object(this)
    let len = arr.length
    let k = 0
    
    while (k < len) {
        if (k in arr) {
            if (callback.call(thisArg, arr[k], k, arr)) {
                return true
            }
        }

        k++
    }

    return false
}
```

## 使用setTimeout实现setInertval

```js
function interval(cb, time) {
    let obj = {
        timer: null
    }

    function say() {
        cb()

        obj.timer = setTimeout(say, time)
    }

    obj.timer = setTimeout(say, time)

    return obj
}

// setTimeout(() => {
//     setTimeout(agruments.callee, 200)
// }, 200)

function setInterval(fn, interval) {
    let timer = null
    let clear = false

    function run() {
        if (clear) {
            return
        }

        timer = setTimeout(() => {
            run()
        }, interval);
        fn()
    }

    run()

    return () => {
        clear = true
        timer = null
    }
}

const cancel = setInterval(() => {
    console.log('log....')
}, 2000)

setTimeout(() => {
    cancel()
}, 20000);
```

## 手写-实现一个对象的 flatten 方法

```js
const obj = {
    a: {
        b: 1,
        c: 2,
        d: {
            e: 5
        }
    },
    b: [1, 3, {
        a: 2,
        b: 3
    }],
    c: 3
}

// flatten(obj) 结果返回如下

// {
//  'a.b': 1,
//  'a.c': 2,
//  'a.d.e': 5,
//  'b[0]': 1,
//  'b[1]': 3,
//  'b[2].a': 2,
//  'b[2].b': 3
//   c: 3
// }

function isObject(obj) {
    return typeof obj === 'object' && obj !== null
}

function isArray(obj) {
    return Array.isArray(obj)
}

function flatten(obj) {
    let result = {}

    const fun = (obj, prefix) => {
        if (!isObject(obj)) {
            result[prefix] = obj
        } else {
            if (isArray(obj)) {
                obj.forEach((item, index) => {
                    fun(item, `${prefix}[${index}]`)
                })
            } else {
                for (let k in obj) {
                    fun(obj[k], `${prefix}${prefix ? "." : ""}${k}`);
                }
            }
        }
    }

    fun(obj, '')

    return result
}

flatten(obj)
```

## 异步并发实现

## axios&fetch

## 原型和原型链

- Object 是所有对象的爸爸，所有对象都可以通过 __proto__ 找到它
- Function 是所有函数的爸爸，所有函数都可以通过 __proto__ 找到它

![原型链](/interview/原型链.jpeg)

## call

```js
Function.prototype.myCall = function myCall(context = window) {
    if(typeof this !== 'function') {
        throw new Error('类型错误')
    }
    const args = Array.from(arguments).slice(1)
    let result
    context.fn = this
    result =  context.fn(...args)
    delete context.fn
    return result
}

Function.prototype.myCall = function (target = window, ...args) {

    let result
    target.fn = this
    result = target.fn(...args)
    delete target.fn

    return result
}
```

## apply

```js
Function.prototype.myApply = function myApply(context=window) {
    if(typeof this !== 'function') {
        throw new Error('类型错误')
    }

    const args = arguments[1]
    context.fn = this
    let result
    if (args) {
        result = context.fn(...args)
    }else {
        result = context.fn()
    }

    delete context.fn
    return result
}

Function.prototype.myApply = function (target = window, ...args) {
    let result
    target.fn = this
    result = target.fn(args)
    delete target.fn
    return result
}
```

## bind

[参考](https://github.com/mqyqingfeng/Blog/issues/12)

```js
// https://github.com/mqyqingfeng/Blog/issues/12
Function.prototype.myBind = function myBind(context = window) {
    if(typeof this !== 'function') {
        throw new Error('不是函数类型')
    }
    const that = this
    const args = [...arguments].slice(1)

    return function Fn() {
        // 因为返回了一个函数，我们可以 new F()，所以需要判断
        if(that instanceof Fn) {
            // that 是 Fn的实例
            return new Fn(...args, ...arguments)
        }
        return that.apply(context, args.concat(...arguments))
    }
}

Function.prototype.myBind = function (target = window, ...args) {

    let that = this
    const Fn = function () {
        if (that instanceof Fn) {
            return new Fn(...args.concat(arguments))
        }
        return that.apply(target, args.concat(arguments))
    }

    return Fn
}

Function.prototype.bind2 = function (context) {

    if (typeof this !== "function") {
        throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function () {};

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}

// static fixed absolute relative
```

## commonjs 和 es module区别

[commonjs和ES Moudle的区别](https://es6.ruanyifeng.com/#docs/module-loader#ES6-%E6%A8%A1%E5%9D%97%E4%B8%8E-CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%B7%AE%E5%BC%82)

- commonjs 是对模块值的拷贝；ES是映射
    common 修改模块内的值；外部不会改变
    es  修改模块的值，外部引用会改变

    所以es返回的是同一个实例，即使在不同模块总共引用了
- ES是只读的 不能赋值

## curry

```js
/**
 * 实现
 * add(1, 2, 3)
 * add(1)(2)(3)
 * add(1,2)(3)
 */

function curry(fn, ...args) {
    if (args.length >= fn.length) {
        return fn(...args)
    } else {
        return (..._args) => curry(fn, ...args, ..._args)
    }
}

function add1(x, y, z) {
    return x + y + z
}

const add = curry(add1)
```

## 深拷贝

[深拷贝实现过程](https://cloud.tencent.com/developer/article/1497418)

```js

var obj = {
    a:1,
    b: {
        m: 1,
        n: 2,
        q: [3,4]
    },
    c: [6,7],
    d: new Date(),
    e: new RegExp(),
    f: new Map(),
    g: new Set(),
    h: undefined,
    i: null,
    j: Symbol('j'),
    k: function() {}
} 

// 方法一
var obj1 = JSON.parse(JSON.stringify(obj))

//方法二 递归 边界条件无法处理
function deepClone() {
    let map = new Map() // 解决循环引用

    function _deepClone(obj) {
        function isObject(o) {
            return (typeof o === 'object' || typeof o === 'function') && o !== null
        }

        if (!isObject(obj)) {
            throw new Error('非对象')
        }

        if(obj instanceof Date) { // 特殊数据的特殊处理
            return new Date(obj)
        }

        if(obj instanceof RegExp) { // 特殊数据的特殊处理
            return new RegEXp(obj)
        }

        if(map.get(obj)) {
            return map.get(obj)
        }

        let isArray = Array.isArray(obj)
        let newObj = isArray ? [...obj] : {
            ...obj
        }
        map.set(obj, newObj)

        Reflect.ownKeys(newObj).forEach(key => {
            newObj[key] = isObject(obj[key]) ? _deepClone(obj[key]) : obj[key]
        })

        return newObj
    }

    return _deepClone(obj)
}

console.log(deepClone(obj))

// 方法三 proxy
/**
 * 1. Immer: https://github.com/immerjs/immer
 * 2. 源码地址: https://github.com/KieSun/Dream/blob/master/content/toys/deepClone/index.js
 */

const MY_IMMER = Symbol('my-immer1')

const isPlainObject = value => {
    if (
        !value ||
        typeof value !== 'object' || {}.toString.call(value) != '[object Object]'
    ) {
        return false
    }
    var proto = Object.getPrototypeOf(value)
    if (proto === null) {
        return true
    }
    var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor
    return (
        typeof Ctor == 'function' &&
        Ctor instanceof Ctor &&
        Function.prototype.toString.call(Ctor) ===
        Function.prototype.toString.call(Object)
    )
}

const isProxy = value => !!value && !!value[MY_IMMER]

function produce(baseState, fn) {
    const proxies = new Map()
    const copies = new Map()

    const objectTraps = {
        get(target, key) {
            if (key === MY_IMMER) return target
            const data = copies.get(target) || target
            return getProxy(data[key])
        },
        set(target, key, val) {
            const copy = getCopy(target)
            const newValue = getProxy(val)
            // 这里的判断用于拿 proxy 的 target
            // 否则直接 copy[key] = newValue 的话外部拿到的对象是个 proxy
            copy[key] = isProxy(newValue) ? newValue[MY_IMMER] : newValue
            return true
        }
    }

    const getProxy = data => {
        if (isProxy(data)) {
            return data
        }
        if (isPlainObject(data) || Array.isArray(data)) {
            if (proxies.has(data)) {
                return proxies.get(data)
            }
            const proxy = new Proxy(data, objectTraps)
            proxies.set(data, proxy)
            return proxy
        }
        return data
    }

    const getCopy = data => {
        if (copies.has(data)) {
            return copies.get(data)
        }
        const copy = Array.isArray(data) ? data.slice() : {
            ...data
        }
        copies.set(data, copy)
        return copy
    }

    const isChange = data => {
        if (proxies.has(data) || copies.has(data)) return true
    }

    const finalize = data => {
        if (isPlainObject(data) || Array.isArray(data)) {
            if (!isChange(data)) {
                return data
            }
            const copy = getCopy(data)
            Object.keys(copy).forEach(key => {
                copy[key] = finalize(copy[key])
            })
            return copy
        }
        return data
    }

    const proxy = getProxy(baseState)
    fn(proxy)
    return finalize(baseState)
}

const state = {
    info: {
        name: 'yck',
        career: {
            first: {
                name: '111'
            }
        }
    },
    data: [1]
}

const data = produce(state, draftState => {
    draftState.info.age = 26
    draftState.info.career.first.name = '222'
})

console.log(data, state)
console.log(data.data === state.data)


// 方法四 MessageChannel 
// 注意该方法是异步的
// 可以处理 undefined 和循环引用对象 无法处理Symbol() 和 函数
function structuralClone(obj) {
    return new Promise(resolve => {
        const {
            port1,
            port2
        } = new MessageChannel()
        port2.onmessage = ev => resolve(ev.data)
        port1.postMessage(obj)
    })
}


// obj.b.m = obj.b

var test = async () => {
    const clone = await structuralClone(obj)
    console.log(clone)
}
// test()

// 方法五 lodash


/**
 * deep clone
 * @param  {[type]} parent object 需要进行克隆的对象
 * @return {[type]}        深克隆后的对象
 */
const clone = parent => {
    // 判断类型
    const isType = (obj, type) => {
        if (typeof obj !== "object") return false;
        const typeString = Object.prototype.toString.call(obj);
        let flag;
        switch (type) {
            case "Array":
                flag = typeString === "[object Array]";
                break;
            case "Date":
                flag = typeString === "[object Date]";
                break;
            case "RegExp":
                flag = typeString === "[object RegExp]";
                break;
            default:
                flag = false;
        }
        return flag;
    };

    // 处理正则
    const getRegExp = re => {
        var flags = "";
        if (re.global) flags += "g";
        if (re.ignoreCase) flags += "i";
        if (re.multiline) flags += "m";
        return flags;
    };
    // 维护两个储存循环引用的数组
    const parents = [];
    const children = [];

    const _clone = parent => {
        if (parent === null) return null;
        if (typeof parent !== "object") return parent;

        let child, proto;

        if (isType(parent, "Array")) {
            // 对数组做特殊处理
            child = [];
        } else if (isType(parent, "RegExp")) {
            // 对正则对象做特殊处理
            child = new RegExp(parent.source, getRegExp(parent));
            if (parent.lastIndex) child.lastIndex = parent.lastIndex;
        } else if (isType(parent, "Date")) {
            // 对Date对象做特殊处理
            child = new Date(parent.getTime());
        } else {
            // 处理对象原型
            proto = Object.getPrototypeOf(parent);
            // 利用Object.create切断原型链
            child = Object.create(proto);
        }

        // 处理循环引用
        const index = parents.indexOf(parent);

        if (index != -1) {
            // 如果父数组存在本对象,说明之前已经被引用过,直接返回此对象
            return children[index];
        }
        parents.push(parent);
        children.push(child);

        for (let i in parent) {
            // 递归
            child[i] = _clone(parent[i]);
        }

        return child;
    };
    return _clone(parent);
};


const isObject = (target) => (typeof target === "object" || typeof target === "function") && target !== null;

function deepClone(target, map = new WeakMap()) {
    if (map.get(target)) {
        return target;
    }
    // 获取当前值的构造函数：获取它的类型
    let constructor = target.constructor;
    // 检测当前对象target是否与正则、日期格式对象匹配
    if (/^(RegExp|Date)$/i.test(constructor.name)) {
        // 创建一个新的特殊对象(正则类/日期类)的实例
        return new constructor(target);
    }
    if (isObject(target)) {
        map.set(target, true); // 为循环引用的对象做标记
        const cloneTarget = Array.isArray(target) ? [] : {};
        for (let prop in target) {
            if (target.hasOwnProperty(prop)) {
                cloneTarget[prop] = deepClone(target[prop], map);
            }
        }
        return cloneTarget;
    } else {
        return target;
    }
}

const targetMap = new Map()

function deepClone(target, targetMap) {
    if (!isObject(target)) {
        return target
    }
    // 解决特殊类型
    const Constructor = target.constructor
    if (target instanceof Constructor) {
        return new Constructor(target)
    }

    if(targetMap.get(target)) {
        return targetMap.get(target)
    }

    let result = Array.isArray(target) ? [] : {}

    targetMap.set(target, result)

    Reflect.ownKeys(target).forEach(key => {
        result[key] = deepClone(target[key], targetMap)
    })
    return result
}
```

## 事件循环

[原理](https://segmentfault.com/a/1190000022805523)

[JavaScript运行时的事件循环机制](https://segmentfault.com/a/1190000037516439)

```js
console.log(1);
setTimeout(() => {
    console.log(2)
});
process.nextTick(() => {
    console.log(3);
});
setImmediate(() => {
    console.log(4)
});
new Promise(resolve => {
    console.log(5);
    resolve();
    console.log(6);
}).then(() => {
    console.log(7)
});
Promise.resolve().then(() => {
    console.log(8);
    process.nextTick(() => {
        console.log(9)
    });
});
```

## event事件机制

```js
class Event {
    constructor() {
        this.events = {}
    }

    on(event, fn) {
        if (this.events[event]) {
            this.events[event] = [...this.events[event], fn]
        }else {
            this.events[event] = [fn]
        }
    }

    emit(event, msg) {
        if (this.events[event]) {
            this.events[event].forEach(fn => {
                fn(msg)
            })
        }
    }

    off(event, fn) {
        if (this.events[event]) {
            this.events[event].forEach((handler, index) => {
                if (handler === fn) {
                    this.events[event].splice(index, 1)
                }
            })
        }
    }

    once(event, fn) {
        function on() {
            this.off(event, on)
            fn.apply(this, arguments)
        }
        on.fn = fn
        this.on(event, on)
    }
}

const event = new Event()

let foo = () => {
    console.log('foo')
}

event.on('click', (msg) => {
    console.log(msg)
})

event.on('click', (msg) => {
    console.log(msg)
})

event.on('click', foo)

event.off('click', foo)

event.emit('click', 'test')



class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(type, listener) {
        // 因为其他的类可能继承自EventEmitter，子类的events可能为空，保证子类必须存在此实例属性
        if (!this.events) {
            this.events = {};
        }
        if (this.events[type]) {
            this.events[type].push(listener);
        } else {
            this.events[type] = [listener]
        }
    }

    emit(type, ...args) {
        if (this.events[type]) {
            this.events[type].forEach(fn => fn.call(this, ...args));
        }
    }

    // 只绑定一次，然后解绑
    once(type, listener) {
        const me = this;

        function oneTime(...args) {
            listener.call(this, ...args);
            me.off(type, oneTime);
        }
        me.on(type, oneTime)
    }
    
    off(type, listener) {
        if (this.events[type]) {
            const index = this.events[type].indexOf(listener);
            this.events[type].splice(index, 1);
        }
    }
}
```

## debounce

[防抖](https://www.cnblogs.com/coco1s/p/5499469.html)
[防抖](https://github.com/mqyqingfeng/Blog/issues/22)

```js
// 防抖 https://www.cnblogs.com/coco1s/p/5499469.html
// https://github.com/mqyqingfeng/Blog/issues/22

// 普通版本
function debounce(fn, waitTime = 300) {
    let timer = null
    // 不能使用箭头函数
    return function(...args) {
        let that = this
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.call(that, ...args)
        }, waitTime)
    }
}

// 立即执行的版本
function debounce(fn, wait = 300, immediate) {
    let timer = null

    return function() {
        const that = this
        const args = arguments

        const callNow = immediate && !timer

        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.call(that, ...args)
        }, wait)

        if (callNow) {
            fn.call(that, ...args)
        }
    }
}

// 立即执行， 取消
function debounce(fn, wait = 2000, immediate) {
    let timer = null

    let debounced = function (...args) {  
        const that = this
        const callNow = immediate && !timer

        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.call(that, ...args)
        }, wait)

        if (callNow) {
            fn.call(that, ...args)
        }
    }

    debounce.cancel = function() {
        clearTimeout(timer)
        timer = null
    }
    return debounced
}
```

## throttle

[throttle](https://github.com/mqyqingfeng/Blog/issues/26)

```js
// https://github.com/mqyqingfeng/Blog/issues/26

function throttle(fn, waitTime) {
    let start = null
    return function(...args) {
        let current = new Date().now()
        const that = this
        if (start === null || current - start > waitTime) {
            fn.apply(that, args)
            start = current
        }
    }
}

function throttle1(fn, wait = 500) {
    let run = true

    return function (...args) {
        if (run) {
            run = false
            setTimeout(() => {
                fn.call(this, ...args)
                run = true
            }, wait)
        }
    }
}
```

## fillArray

```js
// 1. 循环
// 2. new Array(length).fill(value)

var arr = new Array(10).fill(1)
var arr1 = new Array(10).fill({name:'moyuderen'}) // 修改一个值会影响到其他的值

//3. Array.from()

var c = Array.from({length: 10}, x => x = {name: 'moyuderen'})

//4. 递归

```

## flat

```js
// 1 es10 flat([deep])
// 2递归
// 3reduce
// stack

var arr = [1, 2, 4, [5, [6, 7], 8]]

function flat1(arr) {
    if (arr.length === 0) {
        return arr
    }
    let res = []

    function fn(arr) {
        arr.forEach((item) => {
            if (Array.isArray(item)) {
                fn(item)
            } else {
                res.push(item)
            }
        })
    }
    fn(arr)

    return res
}

function flat11(arr, num) {
    let result = []
    function fn(arr, num) {
        arr.forEach(item => {
            if(num > 0) {
                if (Array.isArray(item)) {
                    fn(arr, num - 1)
                } else {
                    result.push(item)
                }
            }
        })
    }

    fn(arr, num)

    return result
}

function flat2(arr) {
    let res = []

    ;
    (function flat(arr) {
        arr.forEach(item => {
            if (Array.isArray(item)) {
                flat(item)
            } else {
                res.push(item)
            }
        })
    })(arr)

    return res
}

function flat3(arr) {
    return arr.reduce((total, cur) => {
        if (Array.isArray(cur)) {
            return total.concat(flat3(cur))
        } else {
            return total.concat(cur)
        }
    }, [])
}

function flat33(arr, num = 1) {
    return num > 0
        ? arr.reduce((pre, item) => {
            return pre.concat(Array.isArray(item) 
                ? flat33(item, num-1) 
                : item)
        }, [])
        : arr.slice()
}

function flat4(arr) {
    let stack = [...arr]
    let res = []

    while (stack.length) {
        let last = stack.pop()

        if (Array.isArray(last)) {
            stack.push(...last)
        } else {
            res.push(last)
        }
    }
    res.reverse()

    return res
}
```

## 垃圾回收机制 GC

[垃圾回收机制](https://juejin.cn/post/6844904016325902344)

> 面试话术：（要有逻辑性）
>>
>> - 说到垃圾回收机制，就要谈到内存的生命周期（内存的分配，使用，释放）
>> - v8的垃圾回收策略是分代回收（新生代，老生代）
>> - 新生代：1. from, to空间，晋升，25%，空间小，及时清楚
>> - 老生代：标记（根节点逐层访问到，则是还在引用）清除，标记整理，内存碎片，全停顿（增量标记）
>> - 避免的方式： 避免全局挂载变量，减少闭包，定时器计时器及时清除，dom引用要手动清除

- 内存生命周期
    1. 分配内存
    2. 使用内存（读取）
    3. 释放回收

- V8的内存回收机制 分代回收

  - 新生代 生命周期短
        内存一分为二
        一半用来分配内存，内存满了则进行垃圾回收；检查存活对象，若存活看是否满足了晋升条件（已经被翻转一次；或者to空间内存使用超过了25%），满足则晋升到老生代空间，不满足则复制到to空间；而如果对象不存在则实际释放；完成复制之后翻转；

  - 老生代 存活时间长
        采用标记清楚的方式
        1. 遍历所有的对象，对存活的对象标记
        2. 清除，对未标记的对象进行垃圾回收

    清除后内存不连续，再次分配大内存无法分配；引入了新的算法（把可回收内存先移动到一边，再清理边界外的内存）；但是这种方式耗时过长，v8采用前者，在内存不足的时候使用后者；

    全停顿会导致应用逻辑来执行，停顿一次GC的时间；v8优化：把一次GC分批执行，间隙执行应用逻辑，交替执行

  - 全停顿

    在执行垃圾回收的时候，要暂停所有的应用逻辑，垃圾回收完成之后恢复应用逻辑

## instanceOf

```js
function myInstacnceof(cur, target) {

    while (cur.__proto__) {
        if (cur.__proto__ === target.prototype) {
            return true
        }
        cur.__proto__ = cur.__proto__.__proto__
    }

    return false
}

function myInstacnceof1(cur, target) {
    let prototype = target.prototype
    let proto = cur.__proto__

    while(true) {
        if(proto === null || proto === undefined) {
            return false
        }
        if(proto === prototype) {
            return true
        }else {
           proto = proto.__proto__ 
        }
    }
}

function instanceOf(cur, target) {
    let prototype = target.prototype
    let proto = cur.__proto__

    while (proto) {
        if (proto === prototype) {
            return true
        }

        proto = proto.__proto__
    }

    return false
}
```

## js执行机制

- v8 引擎
  - 内存堆
  - 调用栈

  - 只靠引擎不行：编译执行代码；分配内存，垃圾回收等；但是无法完成ajax 事件等操作，所以需要运行时

- 可执行的代码
    1. 编译阶段
        - 词法分析
        - 预编译等
    2. 执行阶段（一个代码块一个代码块执行）
        - 代码执行压入栈中
        - 执行上下文（全局；函数上下文）

    将上下文中的变量赋值，然后执行代码，执行完毕栈顶的play函数后弹出，接着执行say函数，完毕后弹出。

## new的实现原理

[参考](https://github.com/mqyqingfeng/Blog/issues/13)

``` js
function myNew(){
  var obj = {}
  var constructorFunction = [].shift.call(arguments)
  obj.__proto__ = constructorFunction.prototype
  var params = arguments
  var res = constructorFunction.apply(obj, params)

  return res instanceof Object ? res : obj
}
```

```js
// https: //github.com/mqyqingfeng/Blog/issues/13

function myNew() {
    var obj = {}
    var constructorFunction = [].shift.call(arguments)
    // var constructorFunction = Array.prototype.shift.call(arguments)
    obj.__proto__ = constructorFunction.prototype
    var params = arguments
    var res = constructorFunction.apply(obj, params)

    return res instanceof Object ? res : obj
}


function create(ctx, ...args) {
    /**
     * 1.创建一个对象
     * 2.this指向改变
     * 3.原型链
     */
    if (!ctx || !ctx.prototype) {
        throw new Error('没有构造函数')
    }
    
    let obj = {} // 空对象
    let result = ctx.call(obj, ...args) // this
    obj.__proto__ = ctx.prototype // 原型链

    return result instanceof Object ? result : obj
}




// 返回值效果实现
// 接下来我们再来看一种情况， 假如构造函数有返回值， 举个例子：

function Otaku(name, age) {
    this.strength = 60;
    this.age = age;

    return {
        name: name,
        habit: 'Games'
    }
}

var person = new Otaku('Kevin', '18');

console.log(person.name) // Kevin
console.log(person.habit) // Games
console.log(person.strength) // undefined
console.log(person.age) // undefined
// 在这个例子中， 构造函数返回了一个对象， 在实例 person 中只能访问返回的对象中的属性。

// 而且还要注意一点， 在这里我们是返回了一个对象， 假如我们只是返回一个基本类型的值呢？

// 再举个例子：

function Otaku(name, age) {
    this.strength = 60;
    this.age = age;

    return 'handsome boy';
}

var person = new Otaku('Kevin', '18');

console.log(person.name) // undefined
console.log(person.habit) // undefined
console.log(person.strength) // 60
console.log(person.age) // 18

// 结果完全颠倒过来， 这次尽管有返回值， 但是相当于没有返回值进行处理。

// 所以我们还需要判断返回的值是不是一个对象， 如果是一个对象， 我们就返回这个对象， 如果没有， 我们该返回什么就返回什么。

// 再来看第二版的代码， 也是最后一版的代码：

// 第二版的代码
function objectFactory() {

    var obj = new Object(),

        Constructor = [].shift.call(arguments);

    obj.__proto__ = Constructor.prototype;

    var ret = Constructor.apply(obj, arguments);

    return typeof ret === 'object' ? ret : obj;

};
```

### 返回值效果实现

1. 接下来我们再来看一种情况， 假如构造函数有返回值， 举个例子：

    ```js
    function Otaku(name, age) {
        this.strength = 60;
        this.age = age;

        return {
            name: name,
            habit: 'Games'
        }
    }

    var person = new Otaku('Kevin', '18');

    console.log(person.name) // Kevin
    console.log(person.habit) // Games
    console.log(person.strength) // undefined
    console.log(person.age) // undefined
    ```

    - 在这个例子中， 构造函数返回了一个对象， 在实例 person 中只能访问返回的对象中的属性。
    - 而且还要注意一点， 在这里我们是返回了一个对象， 假如我们只是返回一个基本类型的值呢？

2. 再举个例子：

    ```js
    function Otaku(name, age) {
        this.strength = 60;
        this.age = age;

        return 'handsome boy';
    }

    var person = new Otaku('Kevin', '18');

    console.log(person.name) // undefined
    console.log(person.habit) // undefined
    console.log(person.strength) // 60
    console.log(person.age) // 18
    ```

    - 结果完全颠倒过来， 这次尽管有返回值， 但是相当于没有返回值进行处理。

    - 所以我们还需要判断返回的值是不是一个对象， 如果是一个对象， 我们就返回这个对象， 如果没有， 我们该返回什么就返回什么。

3. 再来看第二版的代码， 也是最后一版的代码：

    ```js
    // 第二版的代码
    function objectFactory() {

        var obj = new Object()

        var Constructor = [].shift.call(arguments);

        obj.__proto__ = Constructor.prototype;

        var ret = Constructor.apply(obj, arguments);

        return typeof ret === 'object' ? ret : obj;

    };
    ```

### 参考文章

[js中的new操作符实现原理](https://www.jianshu.com/p/5e2ce3338f9f)

## Object.create

```js
function create(proto, propertiesObject) {
    if(typeof Object.create !== 'function') {
        function F(){}
        Fn.prototype = proto
        return new F()
    }

    return Object.create(proto, propertiesObject)
}
```

参考[Object.create()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)

## parseUrlParam

```js
const url = 'https://baidu.com?a=1&b=2&c=3&b=4'

// expaction {a:1, b:[2,4], c:3}

function parseUrl(url) {
    let searchs = url.split('?')[1].split('&')
    let params = searchs.reduce((params, cur) => {
        let [key, val] = cur.split('=')
        val = window.decodeURIComponent(val)
        
        if (!params[key]) {
            params[key] = val
        }else {
            params[key] = [...params[key], val]
        }
        return params
    }, {})
    
    return params
}
```

## rem

```js
;(function (d, c) {
    var e = d.documentElement,
        b = "orientationchange" in window ? "orientationchange" : "resize",
        a = function () {
            var f = e.clientWidth;
            if (!f) {
                return
            }
            if (f >= 750) {
                e.style.fontSize = "100px"
            } else {
                e.style.fontSize = (f / 375 * 100) + "px"
            }
        };
    if (!d.addEventListener) {
        return
    }
    c.addEventListener(b, a, false);
    d.addEventListener("DOMContentLoaded", a, false);
    a()
})(document, window);
```

## templateRender

```js
var template = '我是{{name}}, 年纪{{age}}, 性别{{sex}}'

var options = {
    name: 'yiqi',
    age: 18,
    sex: 'boy'
}

function render(template, options) {
    if (!template) {
        return ''
    }
    const reg = /\{\{(\w+)\}\}/
    if (reg.test(template)) {
        const key = reg.exec(template)[1]
        template = template.replace(reg, options[key])

        return render(template, options)
    }

    return template
}

var tp = 'get-element-by-id'

function foo(str) {
    const reg = /-\w/g
    return str.replace(reg, x => {
        return x.slice(1).toUpperCase()
    })
}
```

## loadjs 异步加载js文件

```js


function stdOnEnd(script, cb) {
    script.onload = function () {
        this.onerror = this.onload = null
        cb(null, script)
    }
    script.onerror = function () {
        // this.onload = null here is necessary
        // because even IE9 works not like others
        this.onerror = this.onload = null
        cb(new Error('Failed to load ' + this.src), script)
    }
}

function ieOnEnd(script, cb) {
    script.onreadystatechange = function () {
        if (this.readyState != 'complete' && this.readyState != 'loaded') return
        this.onreadystatechange = null
        cb(null, script) // there is no way to catch loading errors in IE8
    }
}

class LoadJs {
    constructor(src, opts, cb) {
        this.src = src
        this.opts = opts || {}
        this.cb = cb || function () {}
        this.script = null

        this.createDom()
    }

    createDom() {
        const head = document.head || document.getElementsByTagName('head')[0]
        this.script = document.createElement('script')

        this.script.type = this.opts.type || 'text/javascript'
        this.script.async = 'async' in this.opts ? !!this.opts.async : true
        this.script.src = this.src

        this.load(this.script, this.cb)

        head.appendChild(script)
    }

    get load() {
        return 'onload' in this.script ? stdOnEnd : ieOnEnd
    }

}

function loadJs(src, cb, opts) {
    opts = Object.assign({
        async: true
    }, opts)
    
    createDom()

    let stOnEnd = (dom) => {
        dom.onload = function() {
           dom.onload = dom.onerror = null
           cb(dom)
        }

        dom.onerror = function (e) {  
            dom.onload = dom.onerror = null
            throw new Error(e)
        }
    }

    let ieOnEnd = (dom) => {
        dom.onreadystatechange = function () {
            if (this.readyState === 'complete' || this.readyState === 'loaded') {
                this.onreadystatechange = null
                cb(dom)
            }
        }
    }

    let onload = (dom) => {
        'onload' in dom ? stOnEnd(dom) : ieOnEnd(dom)
    }

    let createDom = () => {
        let dom = null
        const head = document.head || document.getElementsByTagName('head')[0]
        dom = document.createElement('script')
        dom.type = 'script/text'
        dom.async = opts.async
        dom.src = src

        onload(dom)

        head.appendChild(dom)
    }
}
```

## upload

```js


var uid = 0
var kb = 1024
var mb = 1024 * kb
class Uploader {
    constructor(options) {
        const defaultOptions = {
            url: '',

            multiple: 'multiple',
            accept: '*',
            limit: -1,
            maxSize: mb * 5,
            autoUpload: true,
            wrapper: document.body,

            data: {},
            headers: {},
            withCredentials: false,
        }

        this.options = Object.assign(defaultOptions, options)
        this.inputEl = null
        this.uploadFiles = [] 

        this.init()
    }

    init() {
        this.initInputElement()
        this.getFiles()
    }

    initInputElement() {
        const {wrapper, multiple, accept} = this.options
        this. inputEl = document.createElement('input')
        const inputElAttr = {
            type: 'file',
            // hidden: true,
            accept,
            multiple,
        }

        Object.entries(inputElAttr).forEach(([key, value]) => {
            this.inputEl[key] = value
        })

        wrapper.appendChild(this.inputEl)
    }

    getFiles() {
        if (!this.inputEl) return
        this.inputEl.addEventListener('change', (e) => {
            const files = [...e.target.files]
            this.uploadFiles = files
            this.loadFiles()
        })
    }

    loadFiles() {
        let { uploadFiles } = this
        this.uploadFiles = uploadFiles.map(file => {
            if(file.uid && file.rawFile) {
                return file
            }else {
                return {
                    uid: uid++,
                    rawFile: file,
                    size: file.size,
                    fileName: file.name,
                    status: 'ready'
                }
            }
        })
        if (this.isOverLimit()) return false
        if (this.isOverSize()) return false

        this.onChange(this.uploadFiles)
        this.options.autoUpload && this.upload()
    }

    upload() {
        this.uploadFiles.forEach(file => {
            file.status === 'ready' && this._post(file)
        })
    }

    isOverLimit() {
        if (this.limit !== 1 && this.limit > 0 && this.uploadFiles.length > this.limit) {
            return true
        }
        return false
    }

    isOverSize() {
        const totalSize = this.uploadFiles.reduce((total, file) => {
            return total + file.size
        }, 0)

        if (totalSize > this.options.maxSize) {
            return true
        }
        return false
    }

    removeFile(file) {
        const uid = file.uid
        const index = this.uploadFiles.findIndex(item => item.uid === uid)
        if (index > -1) {
            this.uploadFiles.splice(index, 1)
            this.onChange(this.uploadFiles);
        }
    }

    clear() {
        this.uploadFiles = []
        this.onChange(this.uploadFiles);
    }

    _post(file) {
        if(!file) return
        this.http(file)
    }

    http(file) {
        const { url, withCredentials, data, headers} = this.options
        const xhr = new XMLHttpRequest()
        let formData = new FormData()
        formData.append('file', file.rawFile, file.name)
        Object.keys(data).forEach(key => {
            formData.append(key, data[key])
        })

        file.status = 'uploading'

        Object.keys(headers).forEach(key => {
            xhr.setRequestHeader(key, headers[key])
        })

        xhr.withCredentials = withCredentials

        xhr.onload = () => {
            if (xhr.readyState === 4 && (xhr.status >= 200 || xhr.status < 300)) {
                file.status = 'success'
                this.suconSuccesscess(xhr, file, this.uploadFiles)
            } else {
                file.status = 'error'
                this.onError(xhr, file, this.uploadFiles)
            }
        }


        xhr.onerror = e => {
            file.status = 'error'
            this.onError(xhr, file, this.uploadFiles)
        }

        xhr.upload.onprogress = e => {
            const {
                total,
                loaded
            } = e
            e.percent = total > 0 ? loaded / total * 100 : 0
            this.onProgress(e, file, list)
        }

        xhr.open('post', url, true)
        xhr.send(formData)
        
    }

    onChange(list) {

    }

    onSuccess(xhr, file, list) {

        return this
    }

    onError(xhr, file, list) {

        return this
    }

    onProgress(e, file, list) {

        return this
    }

}

// var uploader = new Uploader({
//     wrapper: document.getElementById('logo-default')
// })

// uploader.onSuccess = (xhr, file, list) => {
//     console.log(xhr, file, list)
// }

// uploader.onError = (xhr, file, list) => {
//     console.log(xhr, file, list)
// }

// uploader.onProgress = (e, file, list) => {
//     console.log(e.percent, file, list)
// }
```

## vant 按需引入

就拿我最近开发移动端用的 vant 为例，

import { Button } from 'vant'

这种写法经过这个插件之后会变成

import Button from 'vant/lib/Button'

这种写法，引用整个 vant 变成了我只用了 vant 下面的某一个文件，打包后的文件会比全部引入的文件大小要小很多

### 原理

- webpcak plugin 解析ast, 把 `import { Button } from vant` 转换为 `import Button from 'vant/lib/Button'`

## websocket

## xhr

```js
const  xhr = new XMLHttpRequest()

xhr.open('post', data ,true)

xhr.timeout = 12000

xhr.onreadystatechange = function handleLoad() {
    if (!xhr || xhr.readyState !== 4) {
        return;
    }

    if (xhr.status === 0 && !(xhr.responseURL && xhr.responseURL.indexOf('file:') === 0)) {
        return;
    }

};

xhr.onabort = function handleAbort() {
    if (!xhr) {
        return;
    }
};

xhr.onerror = function handleError() {
    
};

xhr.ontimeout = function handleTimeout() {
    var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
    
};

xhr.setRequestHeader(key, val)

xhr.withCredentials = !!config.withCredentials;

xhr.responseType = config.responseType;

xhr.addEventListener('progress', config.onDownloadProgress);

xhr.upload.addEventListener('progress', config.onUploadProgress);

xhr.abort();

xhr.send(requestData);
```

## Promise

### 实现Promise

[参考文章](https://juejin.cn/post/6850037281206566919)

- 标准实现

```js
var Promise = (function () {
    function Promise(resolver) {
        if (typeof resolver !== 'function') {
            throw new TypeError('Promise resolver ' + resolver + ' is not a function')
        }
        if (!(this instanceof Promise)) return new Promise(resolver)

        var self = this
        self.callbacks = []
        self.status = 'pending'

        function resolve(value) {
            setTimeout(function () {
                if (self.status !== 'pending') {
                    return
                }
                self.status = 'resolved'
                self.data = value

                for (var i = 0; i < self.callbacks.length; i++) {
                    self.callbacks[i].onResolved(value)
                }
            })
        }

        function reject(reason) {
            setTimeout(function () {
                if (self.status !== 'pending') {
                    return
                }
                self.status = 'rejected'
                self.data = reason

                for (var i = 0; i < self.callbacks.length; i++) {
                    self.callbacks[i].onRejected(reason)
                }
            })
        }

        try {
            resolver(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }

    function resolvePromise(promise, x, resolve, reject) {
        var then
        var thenCalledOrThrow = false

        if (promise === x) {
            return reject(new TypeError('Chaining cycle detected for promise!'))
        }

        if ((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))) {
            try {
                then = x.then
                if (typeof then === 'function') {
                    then.call(x, function rs(y) {
                        if (thenCalledOrThrow) return
                        thenCalledOrThrow = true
                        return resolvePromise(promise, y, resolve, reject)
                    }, function rj(r) {
                        if (thenCalledOrThrow) return
                        thenCalledOrThrow = true
                        return reject(r)
                    })
                } else {
                    return resolve(x)
                }
            } catch (e) {
                if (thenCalledOrThrow) return
                thenCalledOrThrow = true
                return reject(e)
            }
        } else {
            return resolve(x)
        }
    }

    Promise.prototype.then = function (onResolved, onRejected) {
        onResolved = typeof onResolved === 'function' ? onResolved : function (v) {
            return v
        }
        onRejected = typeof onRejected === 'function' ? onRejected : function (r) {
            throw r
        }
        var self = this
        var promise2

        if (self.status === 'resolved') {
            return promise2 = new Promise(function (resolve, reject) {
                setTimeout(function () {
                    try {
                        var x = onResolved(self.data)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        return reject(e)
                    }
                })
            })
        }

        if (self.status === 'rejected') {
            return promise2 = new Promise(function (resolve, reject) {
                setTimeout(function () {
                    try {
                        var x = onRejected(self.data)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        return reject(e)
                    }
                })
            })
        }

        if (self.status === 'pending') {
            return promise2 = new Promise(function (resolve, reject) {
                self.callbacks.push({
                    onResolved: function (value) {
                        try {
                            var x = onResolved(value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            return reject(e)
                        }
                    },
                    onRejected: function (reason) {
                        try {
                            var x = onRejected(reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            return reject(e)
                        }
                    }
                })
            })
        }
    }

    Promise.prototype.valueOf = function () {
        return this.data
    }

    Promise.prototype.catch = function (onRejected) {
        return this.then(null, onRejected)
    }

    Promise.prototype.finally = function (fn) {
        // 为什么这里可以呢，因为所有的then调用是一起的，但是这个then里调用fn又异步了一次，所以它总是最后调用的。
        // 当然这里只能保证在已添加的函数里是最后一次，不过这也是必然。
        // 不过看起来比其它的实现要简单以及容易理解的多。
        // 貌似对finally的行为没有一个公认的定义，所以这个实现目前是跟Q保持一致，会返回一个新的Promise而不是原来那个。
        return this.then(function (v) {
            setTimeout(fn)
            return v
        }, function (r) {
            setTimeout(fn)
            throw r
        })
    }

    Promise.prototype.spread = function (fn, onRejected) {
        return this.then(function (values) {
            return fn.apply(null, values)
        }, onRejected)
    }

    Promise.prototype.inject = function (fn, onRejected) {
        return this.then(function (v) {
            return fn.apply(null, fn.toString().match(/\((.*?)\)/)[1].split(',').map(function (key) {
                return v[key];
            }))
        }, onRejected)
    }

    Promise.prototype.delay = function (duration) {
        return this.then(function (value) {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve(value)
                }, duration)
            })
        }, function (reason) {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    reject(reason)
                }, duration)
            })
        })
    }

    Promise.all = function (promises) {
        return new Promise(function (resolve, reject) {
            var resolvedCounter = 0
            var promiseNum = promises.length
            var resolvedValues = new Array(promiseNum)
            for (var i = 0; i < promiseNum; i++) {
                (function (i) {
                    Promise.resolve(promises[i]).then(function (value) {
                        resolvedCounter++
                        resolvedValues[i] = value
                        if (resolvedCounter == promiseNum) {
                            return resolve(resolvedValues)
                        }
                    }, function (reason) {
                        return reject(reason)
                    })
                })(i)
            }
        })
    }

    Promise.race = function (promises) {
        return new Promise(function (resolve, reject) {
            for (var i = 0; i < promises.length; i++) {
                Promise.resolve(promises[i]).then(function (value) {
                    return resolve(value)
                }, function (reason) {
                    return reject(reason)
                })
            }
        })
    }

    Promise.resolve = function (value) {
        var promise = new Promise(function (resolve, reject) {
            resolvePromise(promise, value, resolve, reject)
        })
        return promise
    }

    Promise.reject = function (reason) {
        return new Promise(function (resolve, reject) {
            reject(reason)
        })
    }

    Promise.fcall = function (fn) {
        // 虽然fn可以接收到上一层then里传来的参数，但是其实是undefined，所以跟没有是一样的，因为resolve没参数啊
        return Promise.resolve().then(fn)
    }

    Promise.done = Promise.stop = function () {
        return new Promise(function () {})
    }

    Promise.deferred = Promise.defer = function () {
        var dfd = {}
        dfd.promise = new Promise(function (resolve, reject) {
            dfd.resolve = resolve
            dfd.reject = reject
        })
        return dfd
    }

    try { // CommonJS compliance
        module.exports = Promise
    } catch (e) {}

    return Promise
})()
```

- 自己实现

```js
/**
 * new Promise((resolve,reject) => {
 *      resolve()
 *      // or reject()
 * }).then(res => {
 *      // todo
 * }, rej => {
 *      // todo
 * }).then(res => {
 *      // todo
 * }.rej => {
 *      // todo
 * })
 */

const STATUS = {
    pending: 'pending',
    fulfilled: 'fulfilled',
    rejected: 'rejected'
}

function Promise(resolver) {

    this.status = STATUS.pending // 当前的状态
    this.value = undefined // 当前的值
    this.reason = undefined // 当前的错误的原因

    // 成功和错误处理数组 用来处理异步
    this.onFilledCallbacks = []
    this.onRejecedCallbacks = []

    // resolve函数
    function resolve(value) {
        if (this.status === STATUS.pending) {
            this.status = STATUS.fulfilled
            this.value = value
            this.onFilledCallbacks.forEach(fn => fn())
        }
    }
    // reject函数
    function reject(reason) {
        if (this.status === STATUS.pending) {
            this.status = STATUS.rejected
            this.reason = reason
            this.onRejecedCallbacks.forEach(fn => fn())
        }
    }
    // 执行传入的函数
    try {
        resolver(resolve, reject)
    } catch (e) {
        // 如果有报错直接抛出错误
        reject(e)
    }
}

Promise.prototype.then = function (onFulfilled, onRejeced) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejeced = typeof onRejeced === 'function' ? onRejeced : err => {
        throw err
    }

    // 解决链式调用 需要返回一个新的promise

    let promise2 = new Promise((resolve, reject) => {
        if (this.status === STATUS.fulfilled) {
            let x = onFulfilled(this.value)
            // 防止循环引用自己
            resolvePromise(promise2, x, resolve, reject)
        }

        if (this.status === STATUS.rejected) {
            let x = onRejeced(this.reason)
            resolvePromise(promise2, x, resolve, reject)
        }

        if (this.status === STATUS.pending) {
            this.onFilledCallbacks.push(() => {
                let x = onFulfilled(this.value)
                resolvePromise(promise2, x, resolve, reject)
            })

            this.onRejecedCallbacks.push(() => {
                let x = onRejeced(this.reason)
                resolvePromise(promise2, x, resolve, reject)
            })
        }
    })

    return promise2
}

function resolvePromise(promise2, x, resolve, reject) {

    if (x === promise2) {
        // reject报错
        return reject(new TypeError('Chaining cycle detected for promise'));
    }

    let then
    let thenCalledOrThrow = false

    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            then = x.then
            if (typeof then === 'function') {

                then.call(x, y => {
                    if (thenCalledOrThrow) {
                        return
                    }
                    thenCalledOrThrow = true
                    // resolve的结果依旧是promise 那就继续解析
                    resolvePromise(promise2, y, resolve, reject)

                }, err => {
                    if (thenCalledOrThrow) {
                        return
                    }
                    thenCalledOrThrow = true
                    reject(err)
                })
            } else {
                if (thenCalledOrThrow) {
                    return
                }
                thenCalledOrThrow = true
                resolve(x)
            }
        } catch (e) {
            if (thenCalledOrThrow) {
                return
            }
            thenCalledOrThrow = true
            reject(e)
        }
    } else {
        // 基础类型直接返回
        resolve(x)
    }
}

Promise.race = function (promises) {
    return new Promise((reslove, reject) => {
        promises.forEach(promise => {
            promise.then(reslove, reject)
        })
    })
}


Promise.all = function (promises) {
    return new Promise((resolve, reject) => {
        let len = promises.length
        let arr = new Array(len)
        let time = 0

        function resolveData(data, index) {
            time++
            arr[index] = data
            if (time === len) {
                reslove(arr)
            }
        }

        for (let i = 0; i < len; i++) {
            if (promise instanceof Promise) {
                promise.then(res => {
                    resolveData(res, i)
                }, err => {
                    reject(err)
                })
            } else {
                resolveData(promises[i], i)
            }
        }
    })
}
```

### Promise.all

```js

// Promise.all([1,2,3].then())
Promise.prototype.myAll = function(args) {
    let len = args.length
    let promises = new Array(len)
    let time = 0

    return new Promise((reslove, reject) => {
        for(let i=0; i<len; i++) {
            time++
            ;(function (i) { // 闭包 自执行函数保存异步i
                let promise = args[i]
                if (promise instanceof Promise) {
                    
                    promise.then(res => {
                        // 保证输出的顺序
                        promises[i] = res
                    }, (err) => {
                        reject(err)
                    })
                } else {
                    promises[i] = promise
                }
                time === len ? reslove(promises) : ''
            })(i)
        }
    })
}

var foo = new Promise((reslove) => {
    reslove('foo')
})
var bar = new Promise((reslove) => {
    reslove('bar')
})
var baz = new Promise((reslove) => {
    reslove('baz')
})

var m = 'moyuderen'

Promise.prototype.myAll([foo, bar, baz, m]).then(res => {
    console.log(res)
})

Promise.prototype.all = function (promises) {  
    return new Promise((resolve, reject) => {
        let count = 0
        let len = promises.length
        let rets = []

        const resoveRt = function(ret, index) {
            rets[index] = ret
            count++
            if (count === len) {
                resolve(rets)
            }
        }

        promises.forEach((promise, i) => {
            if(typeof promise === 'function') {
                promise.then((res) => {
                    resoveRt(ret, i)
                }, e => {
                    reject(e)
                })
            }else {
                resoveRt(ret, i)
            }
        })
    })
}
```

### Promise.all请求出错 补偿机制

[promise.all请求出错，重新发起请求](https://www.cnblogs.com/huanglei-/p/9396783.html)

``` js

let fails = []

function foo1() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('foo1')
        }, 2000)
    })
}

function foo2() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('foo2')
        }, 3000)
    })
}


function foo3() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('foo3')
        }, 2000)
    }).catch(e => {
        // 关键代码，需要在此处拦截错误，否则在Promise.all 中逻辑会命中catch
        console.log('e: foo3', e)
        fails.push(foo3())
    })
}

let result = []
let max = 3
let cur = 1

let promises = [foo1(), foo2(), foo3()]

function all(promises) {
    return new Promise((reolve, reject) => {
        function fetchAll(promises) {
            Promise.all(promises).then(res => {
                console.log('res: ====> ', res)
                result = result.concat(res.filter(i => i !== undefined))
                if(fails.length && cur < max) {
                    console.log('result', result)
                    console.log('fails', fails)
                    fetchAll(fails)
                    fails = []
                }else {
                    reolve(result)
                }
            }).catch(e => {
                console.log('e', e)
                reject(e)
            })
        }

        fetchAll(promises)
    })
}

```

### Promise.retry

[Promise.retry](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/387)

### Promise 执行池

[参考文章](https://github.com/rxaviers/async-pool/blob/master/lib/es6.js)

```js
// es6
function asyncPool(limit, arr, fn) {
    let i = 0 //执行到数组的第几个的闭包
    let executing = [] //正在队列中执行的数组
    let proList = [] //存promise索引

    const enqueue = function () {
        if (i === arr.length) {
            return Promise.resolve() // 边界条件
        }

        let item = arr[i++] //相当于一个递归
        let pro = fn(item) //在这里就执行了promise
        proList.push(pro)

        let e = pro.then(() => {
            executing.splice(executing.indexOf(e), 1)
        })
        executing.push(e);
        
        let r = Promise.resolve()
        if (executing.length >= limit) {
            r = Promise.race(executing)
        }
        return r.then(() => enqueue())
    }

    return enqueue().then(() => {
        return Promise.all(proList)
    });
}

// es7
// const results = await asyncPool(2, [1000, 5000, 3000, 2000], timeout);

async function asyncPool(poolLimit, array, iteratorFn) {
    const ret = [];
    const executing = [];

    for (const item of array) {
        const p = Promise.resolve().then(() => iteratorFn(item, array)); // Promsise
        ret.push(p);
        console.log('ret', ret)
        if (poolLimit <= array.length) {
            const e = p.then(() => executing.splice(executing.indexOf(e), 1)); // Promise
            executing.push(e)
            if (executing.length >= poolLimit) {
                console.log('executing', executing)
                const executingRet = await Promise.race(executing);
                console.log('executingRet', executingRet)
            }
        }
    }
    return Promise.all(ret);
}


const timeout = (i) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            console.log('i', i)
            res(i)
        }, i)
    })
}

async function consoleResults() {
    const results = await asyncPool(2, [1000, 5000, 3000, 2000], timeout);
    console.log('results', results)
}

consoleResults()

// --------------------------------------------------------------
function promisePools(limit, arr) {
    let pools = []

    while (pools.length < limit) {
        let task = arr.shift()
        pools.push(task)
        task.then(res => {
            let taskIndex = pools.indexOf(task)
            pools.splice(taskIndex, 1)
        })
    }

    const run = (races) => {
        races.then(res => {
            let task = arr.shift()
            task.then(res => {
                let taskIndex = pools.indexOf(task)
                pools.splice(taskIndex, 1)
            })

            return run(Promise.race(pools))
        })
    }

    let races = Promise.race(pools)
    run(races)
}
```
