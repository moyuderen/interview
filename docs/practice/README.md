---
title: '实战'
navbar: true
sidebar: 'auto'
description: '实战真题'
tags: ['实战真题', '面试题实战']
---

## 字节医疗（2021/07）

### 一面

1. webpcak优化
    - [玩转 webpack，使你的打包速度提升 90%](https://juejin.cn/post/6844904071736852487#heading-14)
2. cookie跨域
3. app环境切换
4. webpack各个插件原理
    1. 图片压缩
        [原理](https://zhuanlan.zhihu.com/p/24995298)
    2. 多线程打包
        - ParallelUglifyPlugin（无人维护）
        - happyPack
            [happyPack原理](https://segmentfault.com/a/1190000021037299)
        - speed-measure-webpack-plugin 测各个打包阶段的时间
        - thread-loader
        - terser-webpack-plugin （webpack4）
5. cdn原理
6. 手写题
7. sentry原理 错误收集
    [sentry](https://zhuanlan.zhihu.com/p/205144885)
8. tracker原理
    [原理](https://juejin.cn/post/6844903984457580551)
9. tree shaking原理
10. uglifyjs 原理
    [压缩了什么](https://www.cnblogs.com/stoneniqiu/p/7240632.html)
11. webpack vue-cli https的配置

### 二面

1. webpack优化
2. cdn
3. ssr
    1. cdn
    2. 优缺点 该怎么解决
    3. 区分serve和client环境
4. 首屏优化
5. 手写题 arrToTree
6. cookie跨域
7. 跨域问题
    1. 请求头设置
        [前端请求如果携带Cookie信息，那么后端Access-Control-Allow-Origin不能为 *](https://segmentfault.com/a/1190000015552557)
    2. cookie问题
8. common.js 和 es模块化区别
    1. 在代码中的体现
    2. tree shaking
    3. 哪些代码不容易被tree shaking
9. 动画的实现 和原理 （回到顶部）

    ```js
    const scrollToTop = () => {
        const beginTime = Date.now()
        const beginValue = el.value.scrollTop
        const rAF = window.requestAnimationFrame || (func => setTimeout(func, 16))
        const frameFunc = () => {
            const progress = (Date.now() - beginTime) / 500
            if (progress < 1) {
            el.value.scrollTop = beginValue * (1 - easeInOutCubic(progress))
            rAF(frameFunc)
            } else {
            el.value.scrollTop = 0
            }
        }
        rAF(frameFunc)
    }
    ```

10. 环境注入的原理

## 字节广告平台

### 一面

# 一面

1. [vue2和vue3的区别](https://v3.cn.vuejs.org/guide/migration/introduction.html#%E5%80%BC%E5%BE%97%E6%B3%A8%E6%84%8F%E7%9A%84%E6%96%B0%E7%89%B9%E6%80%A7)
    - 底层原理
2. cookie
    - 常用属性
    - 跨域
3. [cdn为什么快，原理](https://segmentfault.com/a/1190000039045541)
    - [回源](https://www.huaweicloud.com/zhishi/cdn001.html)
4. [BFC](https://blog.csdn.net/sinat_36422236/article/details/88763187)
    - 什么是BFC
    - BFC有什么特点
5. [盒模型](https://segmentfault.com/a/1190000025121604)
6. [项目优化](https://juejin.cn/post/6911472693405548557)
7. 手写题
    - promise.all的实现
    - 括号匹配

    ```js
    const str1 = '(){]'
    const str2 = '([]){}'

    const map = {
        '(': -1,
        ')': 1,
        '[': -2,
        ']': 2,
        '{': -3,
        '}': 3
    }

    function check(str) {
        if(!str) {
            return false
        }

        if(str.length % 2) {
            return false
        }

        let arr = str.split('')
        let stack = []

        for(item of arr) {
            if(map[item] < 0) {
                stack.push(item)
            }else {
                const pop = stack.pop()
                if(map[pop] + map[item] !== 0) {
                    return false
                }
            }
        }
        if(stack.length) {
            return false
        }

        return true
    }
    ```

### 二面

[classname的用处](https://www.cnblogs.com/suihang/p/10417755.html)
[classname的实现](https://github.com/JedWatson/classnames/blob/master/index.js)

## 字节（2021/06）

1. ssr
2. 技术难点
3. 变量提升

    ``` js
    alert(a);
    a();

    let a = 3;

    function a (){
        alert(10)
    }

    alert(a);
    a = 6;
    a()
    
    // a已经定义了
    // 函数提升一直存在，所以会报错a已经定义
    ```

    ``` js
    alert(a);
    a();

    var a = 3;

    function a (){
        alert(10)
    }

    alert(a);
    a = 6;
    a()
    
    // 结果：
    // function a() {}
    // 10
    // 3 
    // 报错： a不是一个函数
    ```

4. [spa和多页面的优势和缺点](https://juejin.cn/post/6913436819115737102)
5. promise.all 实现

    ``` js
    // const [re1, res2] = Promise.all(['', '', ''])

    Promise.prototype.all = function (promises) { 
        return new Promise((resolve, reject) => {
            let result = []
            let count = 0
            let l = promises.length

            const resolveResult = function(data, index) {
                count++
                result[index] = data
                
                if(count === l) {
                    resolve(result)
                }
            }

            for(let i=0; i<l; i++) {
                if(typeof promises[i].then === 'function') {
                    promises[i].then(res => {
                        resolveResult(res, i)
                    }, e => {
                        reject(e)
                    })
                }else {
                    resolveResult(promises[i], i)
                }
            }
        })
    }
    ```

6. flex布局
    1. 父元素600px,子元素分别是200px并且设置了flex: 1,是什么样的展示
    2. 子元素的的属性，
    3. flex:1 是什么的缩写
    4. 垂直水平居中
7. vue [tempele的解析过程](https://blog.nowcoder.net/n/57623d6fe8574541907b410195d56f1d)
8. [多个异步同时拿到数据的解决方案 多种（哨兵）](https://segmentfault.com/a/1190000012357567)； [asyc/await 替代](https://segmentfault.com/a/1190000020100107)
9. let
10. ts
11. [px/rem/em/vh/vw](https://www.jianshu.com/p/82f02af17e78)
12. spa页面的实现 [vue-router的原理](https://zhuanlan.zhihu.com/p/27588422)

## 美团（酒店）

- 正则 字符串最长的数字，金额千分位
- mpvue原理
- typescript
  - type interface区别
  - 项目中用到的typscript语法有哪些
- vue hooks function-api
- react hooks

    ```jsx
    function Test() {
      const [name, setName] = useState('moyuderen')
      const inputEl = useRef(null)

      useEffect(() => {
        this.timer = setTimeout(() => {
          document.title = 'useEffect'
        }, 300)
        return () => {
          // 清除的内容在返回的函数内执行
          clearTimeout(this.timer)
        }
      }, [name])

      useEffect(() => {
        console.log('触发useEffect')
      })

      const handleClick = () => {
        setName('zeo')
        inputEl.current.focus()
      }

      return(
        <>  
          <p>name</p>
          <input ref={inputEl} type="text"/>
          <button onClick={handleClick}></button>
      </>
     )
    }
    ```

- 1px rem vw/vh
- 缓存
- nginx的配置

    ```nginx
    server {
      listen          80;
      server_name     _;
      index   index.html index.htm;

      gzip                on;
      gzip_min_length     1k;
      gzip_buffers        4 16k;
      gzip_http_version   1.0;
      gzip_comp_level     2;
      gzip_types          text/html text/plain text/xml text/css text/javascript application/javascript application/x-javascript application/xml application/json application/octet-stream image/x-icon image/png image/gif;
      gzip_vary           on;

      location ~ /partners_app/brokerage-agency.html {
        rewrite /partners_app/brokerage-agency.html(.*) /partners_app/$1 permanent;
      }

      location / {
        alias /med/dist/;

        location ~* .*(html|json)$ {
          expires -1s;
          add_header 'Cache-Control' 'no-store';
          add_header 'Access-Control-Allow-Origin' '*';
          add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        }

        location ~* .*(js|css|png|jpeg|jpg|gif)$ {
          expires max;
        }

        proxy_pass http://www.baidu.com
  }
    }

    ```

- vue-router的原理
- vue history 后端需要配合处理什么
    nginx

    ```nginx
    # nginx 去匹配url 没有就匹配到啊index.html
    location / {
      try_files $uri $uri/ /index.html;
    }
    ```

    原生Node

    ```js
    const http = require('http')
    const fs = require('fs')
    const httpPort = 80

    http.createServer((req, res) => {
      // 划重点
      fs.readFile('index.htm', 'utf-8', (err, content) => {
        if (err) {
          console.log('We cannot open "index.htm" file.')
        }

        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8'
        })

        res.end(content)
      })
    }).listen(httpPort, () => {
      console.log('Server listening on: http://localhost:%s', httpPort)
    })
    ```

- fetch axios 跨域 携带cookie怎么处理 有什么区别
  - fetch axios都支持promise
  - fetch 原生api axios是对ajax和http的封装（web/node）
  - 跨域  
    - fetch credentials: 'include'允许所有； same-origin， omit  
    - fetch mode： no-cors, cors, *same-origin
    - axios withCredentials: true/false
  - 是否能取消
        xhr.abort
        fetch没有
  - 拦截器

- 新旧项目 lint冲突
  - .ignore

## 快手

- 自我介绍

- 项目上的亮点难点

- sentry sentry实现的原理

- typescript
  - typescript的优势
  - interface he type的区别
    - 相同点
            1. 都可以描述一个对象或者函数
            2. 都可以拓展和继承
                - interface extends
                - type &
                互相继承
    - 不同点
            1. type可以描述基本类型
            2. interface能够声明合并

- css
    1. 实现一个三角形
    2. 实现一个等边三角形

- 笔试题

    ```js
      // 1
      var a = { x: 1 };
      var b = a;
      a.x = a = { n: 1 };
      console.log(a);
      console.log(b);
    
    
      // 2
      Function.prototype.a = () => alert(1);
      Object.prototype.b = () => alert(2);
      function A() {}
      const a = new A();
      a.a(); // 报错
      a.b();
    
      console.log(a instanceof Function) // false
      console.log(a instanceof Object)
      console.log(A instanceof Function)
      console.log(A instanceof Object)
      console.log(a instanceof A)
    
      // 3
      console.log(a);
      var a = 0;
      
      console.log(b);
      let b = 0;

      console.log(c);
      function c() {}
      
      console.log(d);
      class d {}
    
      // 4
      var x = 10;
      function a(y) {
          var x = 20;
          return b(y);
      }
    
      function b(y) {
          return x + y
      }
      a(20); // 30
    
      // 5    
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
      })
    
      // 1, 5, 6, 3, 7, 8, 9, 2, 4
        
    ```

- 请实现一个cacheRequest方法，保证当使用ajax(请求相同资源时，此题中相同资源的判断是以url为判断依据)，真实网络层中，实际只发出一次请求（假设已存在request方法用于封装ajax请求，调用格式为：``request(url, successCallback, failCallback)``）比如调用方代码（并行请求）如下

    ```js
    // a.js
    cacheRequest('/user', data => {
        console.log('我是从A中请求的user，数据为' + data);
    })
    
    // b.js
    cacheRequest('/user', data => {
        console.log('我是从B中请求的user，数据为' + data);
    })
    ```

    ```js
    let cache = new Map()
    function cacheRequest(url, callback, fail) {
        if(cache.has(url)) {
            callback(cache.get(url))
        }else {
            request(url, function(data) {
                cache.set(url, data)
                callback(data)
            }, fail)
        }
    }
    ```

## 滴滴（乘客前端）

[一面](https://docs.qq.com/doc/DQkFjS09pdmJHTUZ1?&_t=1627992022786)

## 高德

- 变量提升
- this
- vue原理
- vue 异步更新队列
- react 原理
- es6
  - class
  - 箭头函数
  - let
- 缓存
  - 强缓存

    1. 命中： 返回 `200`, from： memory cahce/ disk cahce
    2. 没有命中：返回 200 资源来自网络

    - `expires`
    - `cache-control: max-age, no-store, no-cache` （每次都要去确定）
  - 协商缓存
    - `last-modified / if-modified-since`
    - `etag / if-none-match`
- webpack配置和优化

## 跟谁学

- css三角形
- 梯形
- 金额千分位处理：
  - 12345678 => 12,345,678
  - 正则
- promise原理
- promise.all 原理
- 实现一个Object.create()
- 深拷贝

## 美餐

- 重构
- 单元测试
- 开发流程
- 代码可读性 可维护性
- 如何保证代码质量

## 58 二手车业务

- [js 延迟执行的办法](https://www.cnblogs.com/songForU/p/10905031.html)
- 深拷贝
- 继承
- 原型链
- **webpack的优化 第三方包的处理**
- **vue2 vue3响应式原理**
- **native sdk原理**； 封装  id
- css 三角形，三列布局，
- 输入地址到渲染发生了什么
- 浏览器的缓存机制
- 事件循环机制 与Node的区别
- 是否有Node的开发经验
- ts的语法 装饰器

    ```ts
    interface City {
        
    }

    type Status = 1 | 2 | 3

    declare module '*vue' {
        import Vue from 'vue'
        return Vue
    }

    declare const Env: string
    
    enum Status {
        Start: 1
        Prograsss: 2
        End: 3
    }

    class Parent {

    }
    ```

- 移动端的适配 rem

## moka

- 项目中遇到的坑

- 实现一个JSON.stringify

```js
// 换行，逗号，缩进（记录深度），括号

var data = {
    a: 1,
    b: [
        1,
        2,
        {
            m: 1,
        }
    ],
}

stringify(data)

JSON.stringify(data, null, 2)
```

## 奇安信

- vue3的优势
- react hooks
- vue2 vue3的原理，[依赖收集的时机](https://blog.csdn.net/gongye2019/article/details/119011390)
- typescript的优势 代码质量？
- 错误上报和收集，try{} catch{}能收集异步错误嘛？ unhandleReject能收集到setTimeout的错误嘛
- react setData是异步的还是同步的

## 开课吧

## 一面

```js
function debounce(fn, wait) {
    let timer = null

    return function(args) {
        if(timer) {
            clearTimeout(timer)
            return
        }

        timer = setTimeout(() => {
            fn.call(this, ...args)
        }, wait);
    }
}

var arr = [1, 2, [3, [4, 5]]]

// 1. es10 flat方法
// 2. 
function flat1(arr) {
    let ret = []

    function run(arr) {
        arr.forEach(item => {
            if(Array.isArray(item)) {
                run(item)
            }else {
                ret.push(item)
            }
        });
    }

    run(arr)

    return ret
}

// 3. stack
function flat2(arr) {
    let stack = [...arr]
    let ret = []
    if (stack.length) {
        const last = stack.pop()
        if(Array.isArray(last)) {
            stack.concat(last)
        }else {
            ret.push(item)
        }
    }

    return ret.reverse()
}

function foo(a) {
    console.log(this, a)
}

var obj = {
    m: 222
}

foo.call(obj, 1)
Function.prototype.call = function (ctx = window, ...args) {
    
    ctx.fn = this
    const result = ctx.fn(...args)
    delete ctx.fn

    return result
}

function isObject(val) {
    return typeof val === 'object' && val !== null
}

const obj1 = {
    a: 1,
    b: {
        m: 1,
        n: [
            1,
            2,
            {
                q: 'q'
            },
        ]
    },
    p: obj1.b,
    date: new Date('2022-02-11')
}
console.log(deepClone(obj1))

function deepClone(target, map = new Map()) {
    if(!isObject(target)) {
        return target
    }

    const Constructor = target.constructor
    if (target instanceof Constructor) {
        return new Constructor(target)
    }

    if(map.has(target)) {
        return map.get(target)
    }

    let result = Array.isArray(target) ? [] : {}

    map.set(target, result)

    Reflect.ownKeys(target).forEach(key => {
        result[key] = deepClone(target[key], map)
    });
}

// p1 instanceof Parent
// P1.__proto__ === Parent.prototype

function sleep(timeout) {
    return new Promise((resolve, reject) => {
        const id = setTimeout(() => {
            clearTimeout(id)
            resolve()
        }, timeout);
    })
}

function fetchData(url) {
    return new Promise()
}


// 实现一个本地存储，超过1d后，重新请求接口更新数据
```

## umu

- axios cancel 原理，保证正确的执行顺序

    ```js
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()

    axios..get('get/username', {
        cancelToken: source.token
    })
    ```

    解析：

- 项目的难点 分片上传
- Promise.all 收集错误
- webpack原理 （.vue, 等怎么转换为js文件）
- vue3 composition api怎么实现的
- 缓存
- 离线化平台
- requestAnimationFrame
- 10000数据，数据多的时候怎么进行分片处理，不阻塞浏览器进程
- 输入url到页面渲染 cssdom规范 em-px, 哪些显示哪些不展示
