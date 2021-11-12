---
title: 'vue2.x'
navbar: true
description: 'vue2.x'
tags: ['框架', 'vue', 'vue2.x']
---

## 源码解析

1. [vue源码解析](https://github.com/answershuto/learnVue)
2. [vue技术揭秘-电子书](https://ustbhuangyi.github.io/vue-analysis/v2/prepare/)

## template-compile

1. parsre

    template模板 -> 模板字符串(正则匹配) -> AST树
2. optimize

    标记static属性， 表达式节点或者有if for :class等属性的为动态节点； 和静态节点；在patch的时候优化提高效率
3. generate
    ast -> code=generate(ast) -> 可以执行的render代码字符串（code=`with(this){_c("div")}`

    `_c` 创建节点
    `_t` 创建文本节点
    `_e` 空节点
    `_l` 创建列表节点
4. new Functunc(code)
5. render

```js
/* 渲染v-for列表 */
function renderList (val, render) {
    let ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
        ret[i] = render(val[i], i);
    }
}

render () {
    return isShow ? (new VNode('div', {
        'staticClass': 'demo',
        'class': c
    }, 
        /* begin */
        renderList(sz, (item) => {
            return new VNode('span', {}, [
                createTextVNode(item);
            ]);
        })
        /* end */
    )) : createEmptyVNode();
}
```

## vue-defineProperty

```js
class Vue {
    constructor(options) {
        this.$options = options
        this._data = this.$options.data
        let data = this._data

        Object.keys(data).forEach(key => {
            this.proxy(key)
        })
        
        new Watcher()
        observe(data)
    }

    proxy(key) {
        Object.defineProperty(this, key, {
            configurable: true,
            enumerable: true,
            get() {
                return this._data[key]
            },
            set(newVal) {
                if(newVal === this._data[key]) {
                    return
                }
                this._data[key] = newVal
            }
        })  
    }
}


class Dep {
    constructor() {
        this.watchs = []
    }

    addWatch(watch) {
        this.watchs.push(watch)
    }

    notify() {
        this.watchs.forEach(watch => {
            watch.update()
        })
    }
}

Dep.target = null

/**
 * 订阅者
 */
class Watcher {
    constructor() {
        Dep.target = this
    }

    update() {
        console.log('视图更新了')
    }
}

class Observe {
    constructor(data) {
        this.value = data
        this.walk(data)
    }

    walk(data) {
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key])
        })
    }
}

function defineReactive(obj, key, val) {
    const dep = new Dep()
    
    Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        get(key) {
            // 依赖收集
            dep.addWatch(Dep.target)
            return val
        }, 
        set(newVal) {
            if(val === newVal) {
                return
            }
            dep.notify()
        }
    })
}

function observe(data) {
    if(!data || typeof data !== 'object') {
        return
    }

    new Observe(data)
}

var a = new Vue({
    data: {
        m: 1
    }
})
```

## nextTick

## dom-diff

- patch是同层比较 复杂度为O(n)， 所以效率比较高

- 同层比较oldNode newNode
    1. oldNode不存在；newNode替代
    2. oldNode不存在，新节点也不存在 删除oldNode
    3. oldNode和newNode都存在
        1. oldNode newNode isSameNode -> nodePatch
        2. newNode替代oldNode

        - nodePatch
            1. oldNode === newNode 结束
            2. oldNode.static === newNode.static && oldNode.key === newNode.key
                newNode.el = oldNode.el
                newNode.componentIntance = oldNode.componentIntance  直接复用
            3. 比较子节点
                1. oldch && newch && (oldch !== newch) 更新子节点
                2. newch存在
                    如果oldch是文本节点 置空；且插入newch
                3. oldch存在
                    删除oldch
                4. oldch是文本 置空文本

                - updadeChildren() 更新子几点
                    1. 头和尾部向中间同时靠拢比较

## computed

[原理解析](https://www.mybj123.com/5865.html)

## eventbus

```js
// 实际是一个vue
// 1. vue的事件机制
import Vue from 'vue'

const eventBus = new Vue()  

class Bus {
    constructor() {
        this.events = new Map()
    }

    on(type, fn) {
        if (this.events.get(type)) {
            this.events.set(type, [...this.events.get(type), fn])
        }else {
            this.events.set(type, [fn])
        }
    }

    emit(type, args) {
        const fns = this.events.get(type)
        fns.forEach(fn => {
            fn(args)
        })
    }

    off(type, fn) {
        const fns = this.events.get(type)
        let index = fns.indexOf(fn)
        if(index > -1) {
            fns.splice(index, 1)
            this.events.set(type, fns)
        }
    }

    once(type, fn) {
        const F = function() {
            this.off(type, F)
            fn.apply(this, arguments)
        }
        F.fn = fn
        this.on(type, F)
    }
}

const bus = new Bus()
```

## keep-alive

[彻底搞懂Vue中keep-alive的魔法(上)](https://juejin.cn/post/6844903950886371342)
[彻底搞懂Vue中keep-alive的魔法(下)](https://juejin.cn/post/6844903966170431496)

```js

/**
 * 抽象组件  不会渲染到dom 也不会出现在父组件链中
 * 
 */

 /**
  * include 包含哪些组件  可以是 字符串’,‘隔开；正则；数组
  * exclude 不包含哪些组件  同include
  * max 缓存的最大组件数
  */
 <keep-alive include='a,b' exclude='/list/' max='10'>
     <template>
         
     </template>
 </keep-alive>

/**
 * 原理
 */

import {
    isRegExp,
    remove
} from 'shared/util'
import {
    getFirstComponentChild
} from 'core/vdom/helpers'

type VNodeCache = {
    [key: string]: ? VNode
};

// 获取组件name属性 如果没有name属性，取tag
function getComponentName(opts: ? VNodeComponentOptions): ? string {
    return opts && (opts.Ctor.options.name || opts.tag)
}

// 匹配是否在includs 或者 excludes的方法
function matches(pattern: string | RegExp | Array < string > , name: string) : boolean {
    if (Array.isArray(pattern)) { // 数组
        return pattern.indexOf(name) > -1
    } else if (typeof pattern === 'string') { // 字符串用 ','隔开
        return pattern.split(',').indexOf(name) > -1
    } else if (isRegExp(pattern)) { // 正则匹配
        return pattern.test(name)
    }
    /* istanbul ignore next */
    return false
}

// 遍历删除缓存的组件
function pruneCache(keepAliveInstance: any, filter: Function) {
    const {
        cache,
        keys,
        _vnode
    } = keepAliveInstance

    for (const key in cache) {
        const cachedNode: ? VNode = cache[key]
        if (cachedNode) {
            const name: ? string = getComponentName(cachedNode.componentOptions)
            // 不在includs 
            if (name && !filter(name)) {
                pruneCacheEntry(cache, key, keys, _vnode)
            }
        }
    }
}

// 删除当前缓存的组件
function pruneCacheEntry(
    cache: VNodeCache,
    key: string,
    keys: Array < string > ,
    current ? : VNode
) {
    const cached = cache[key]
    if (cached && (!current || cached.tag !== current.tag)) {
        cached.componentInstance.$destroy()
    }
    cache[key] = null
    remove(keys, key)
}

const patternTypes: Array < Function > = [String, RegExp, Array]

export default {
    name: 'keep-alive',
    abstract: true, // 抽象组件

    props: {
        include: patternTypes,
        exclude: patternTypes,
        max: [String, Number]
    },

    created() {
        // 创建缓存对象
        this.cache = Object.create(null)
        // 创建缓存对象的key值
        this.keys = []
    },

    destroyed() {
        // keep-alive组件卸载时销毁卸载 其下面缓存的组件
        for (const key in this.cache) {
            pruneCacheEntry(this.cache, key, this.keys)
        }
    },

    mounted() {
        // 监听 include 和 exclude熟悉变化 更新缓存对象中的内容
        this.$watch('include', val => {
            // val include中的值 [a,ee,e]; '1,ee,e'' /a/ 
            pruneCache(this, name => matches(val, name))
        })
        this.$watch('exclude', val => {
            pruneCache(this, name => !matches(val, name))
        })
    },

    render() {
        const slot = this.$slots.default
        // 第一个子组件
        const vnode: VNode = getFirstComponentChild(slot)
        const componentOptions: ? VNodeComponentOptions = vnode && vnode.componentOptions
        if (componentOptions) {
            // check pattern
            const name: ? string = getComponentName(componentOptions)
            const {
                include,
                exclude
            } = this
            // 不在include 或者在 exclude中 不缓存直接返回该子组件
            if (
                // not included
                (include && (!name || !matches(include, name))) ||
                // excluded
                (exclude && name && matches(exclude, name))
            ) {
                return vnode
            }

            const {
                cache,
                keys
            } = this
            const key: ? string = vnode.key == null
                // same constructor may get registered as different local components
                // so cid alone is not enough (#3269)
                ?
                componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '') :
                vnode.key

            // 如果已在缓存池中
            if (cache[key]) {
                // 改组件的实例使用缓存池中该组件的实例
                vnode.componentInstance = cache[key].componentInstance
                // make current key freshest
                // 更新当前组件位置 到最后一个
                remove(keys, key)
                keys.push(key)
            } else { // 如果不存在 加入缓存池中
                cache[key] = vnode
                keys.push(key)
                // prune oldest entry
                // 如果超过了max属性的限制的最大值 就删除缓存池中的一个组件
                if (this.max && keys.length > parseInt(this.max)) {
                    pruneCacheEntry(cache, keys[0], keys, this._vnode)
                }
            }
            // 标记组件为keepAlive状态； 会在insert组件时根据是否有该状态调用Activated等方法，以及在dom diff过程中对keepAlive状态组件的特殊判断
            vnode.data.keepAlive = true
        }
        return vnode || (slot && slot[0])
    }
}
```

## proxy this.data 代理到this._$data

```js

class Vue {
    constructor(options) {
        this.$options = options
        this._data = this.$options.data
    
        new Watcher()
        this._data = observe(this._data)

        let data = this._data
        Object.keys(data).forEach(key => {
            this.proxy(key)
        })
    }

    proxy(key) {
        Object.defineProperty(this, key, {
            configurable: true,
            enumerable: true,
            get() {
                return this._data[key]
            },
            set(newVal) {
                if (newVal === this._data[key]) {
                    return
                }
                this._data[key] = newVal
            }
        })
    }
}


class Dep {
    constructor() {
        this.watchs = []
    }

    addWatch(watch) {
        this.watchs.push(watch)
    }

    notify() {
        this.watchs.forEach(watch => {
            watch.update()
        })
    }
}

Dep.target = null

/**
 * 订阅者
 */
class Watcher {
    constructor() {
        Dep.target = this
    }

    update() {
        console.log('视图更新了')
    }
}


function observe(target) {
    if (!target || typeof target !== 'object') {
        return
    }

    const dep = new Dep()

    return new Proxy(target, {
        configurable: true,
        enumerable: true,
        get(target, key, receiver) {
            // 依赖收集
            dep.addWatch(Dep.target)
            console.log(dep)
            return Reflect.get(target, key, receiver);
        },
        set(target, key, value, receiver) {
            dep.notify()
            return Reflect.set(target, key, value, receiver);
        }
    })
}

var a = new Vue({
    data: {
        m: 1
    }
})
```

## 实现一个cofirm组件

```js
// index.js
import Vue from 'vue'
import ConfirmVue from './index.vue'

let ConfirmConstructor = Vue.extend(ConfirmVue)
let instance = null

const initInstance = () => {
    instance = new ConfirmConstructor().$mount()
}

const confirm = (options) => {
    if (!instance) {
        initInstance()
        document.body.appendChild(instance.$el)
    }

    Object.assign(instance, options)
    return new Promise((reslove, reject) => {
        instance.confirm(reslove, reject)
    })
}

export default confirm
```

```vue
<template>
    <transition name="fade">
        <section
            v-show="show"
            class="base-confirm"
            :style="{'z-index': zIndex}">
            <div class="confirm">
                <p
                    v-if="title"
                    class="title">
                    {{ title }} </p>
                <p
                    class="message"
                    :style="messageStyle">{{ message }}</p>
                <p class="btn">
                    <span
                        v-if="showCancel"
                        class="cancel"
                        :style="cancelStyle"
                        @click="handlerCancel">{{ cancelTxt }}</span>
                    <span
                        class="ok"
                        :style="okStyle"
                        @click="handlerOk">{{ okTxt }}</span>
                </p>
            </div>
        </section>
    </transition>
</template>
<script>

export default {
    props: {
        title: {
            type: String,
            default: '',
        },
        message: {
            type: String,
            default: 'i am a message!',
        },
        cancelTxt: {
            type: String,
            default: '取消',
        },
        okTxt: {
            type: String,
            default: '确定',
        },
        zIndex: {
            type: Number,
            default: 9999,
        },
        showCancel: {
            type: Boolean,
            default: true,
        },
        messageStyle: {
            type: Object,
            default() {
                return {}
            },
        },
        cancelStyle: {
            type: Object,
            default() {
                return {}
            },
        },
        okStyle: {
            type: Object,
            default() {
                return {}
            },
        },
    },
    data() {
        return {
            show: false,
        }
    },
    methods: {
        confirm(reslove, reject) {
            this.show = true
            this.reslove = reslove
            this.reject = reject
        },
        handlerCancel() {
            this.show = false
            this.reject()
        },
        handlerOk() {
            this.show = false
            this.reslove()
        },
    },
}
</script>
<style lang="scss" scoped>
$arg: 7.2/7.5;
section.base-confirm{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(33,36,47,0.3);
  z-index: 999;
  .confirm{
    position: absolute;
    left: 0.44rem*$arg;
    top: 50%;
    transform: translateY(-50%);
    right: 0.44rem*$arg;
    background: #fff;
    border-radius: 0.08rem*$arg;
    overflow: hidden;
    p.title{
      line-height: 0.24rem*$arg;
      text-align: center;
      font-size: 0.16rem*$arg;
      color: #21242F;
      padding: 0.2rem*$arg 0 0 0;
      font-weight: 800;
    }
    p.message{
      font-size: 0.16rem*$arg;
      color: #21242F;
      letter-spacing: 0;
      line-height: 0.24rem*$arg;
      text-align: center;
      padding: 0.24rem*$arg 0.395rem*$arg;
      // border: 1px solid #e3e4ea;
      @include border-side-1px(bottom,#e3e4ea);
    }
    p.btn{
      display: flex;
      justify-content: center;
      align-items: center;
      span{
        flex: 1;
        text-align: center;
        padding: 0.105rem*$arg 0 0.13rem*$arg;
        font-size: 0.15rem*$arg;
        letter-spacing: 0;
      }
      span.cancel{
        @include border-side-1px(right,#e3e4ea);

        // border-right: 1px solid #e3e4ea;
        color: #666D7F;
      }
      span.ok{
        color: #4E6AF0;
      }
    }
  }

}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
@-webkit-keyframes fadeIn {
  0% {
  opacity: 0; /*初始状态 透明度为0*/
  }
  50% {
  opacity: 0; /*中间状态 透明度为0*/
  }
  100% {
  opacity: 1; /*结尾状态 透明度为1*/
  }
}
</style>
```
