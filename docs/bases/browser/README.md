---
title: '浏览器'
navbar: true
description: '浏览器'
tags: ['前端基础','js', 'css', 'html']
---

## 浏览器工作原理与实践

[浏览器工作原理与实践](https://blog.poetries.top/browser-working-principle/guide/part5/lesson23.html#%E9%82%A3%E6%B8%B2%E6%9F%93%E6%B5%81%E6%B0%B4%E7%BA%BF%E4%B8%BA%E4%BB%80%E4%B9%88%E9%9C%80%E8%A6%81-cssom-%E5%91%A2%EF%BC%9F)

## 从输入url发生了什么

![img](https://static001.geekbang.org/resource/image/92/5d/92d73c75308e50d5c06ad44612bcb45d.png)

1. 输入url

    1. 检测是否是url或者是搜索的关键字
        1. 否：用浏览器默认浏览器拼接url， 例如 <https://www.baidu.com/s?wd>=关键字
        2. 是：直接使用url（或者加上协议，http(s)//:）

2. url请求

    1. 浏览器会通过进程间通信（ipc）把url转发到网络进程
    2. 是否有缓存
        1. 有：直接返回使用缓存资源
        2. 否：开始发起请求 进行下一步
    3. 解析DNS
        1. 是否有DNS缓存（前端可以使用预解析）
        2. 否：请求DNS服务器解析域名
        3. 有：直接使用ip
        4. 是否为https请求
            1. 否：发起请求
            2. 是：需要建立TLS连接
    4. 建立TCP连接
        2. 构建请求行（请求方法 http版本 url）; 请求头 cookie等信息；然后发起请求
    5. 接收响应 包括响应行 响应头 响应体
        1. code是否为302或者301，有个loaction:字段（表示重定向的地址）；比如http重定向到https,302临时重定向
            1. 是：重定向到新的url,网络进程会从响应头Location中读取重定向地址，重新发起网络请求
            2. 否：200；继续处理
                如果是下载文件（content-type来判断），移交给下载器，否则执行后续的内容

3. 准备渲染进程

4. 提交文档

    所谓提交文档，就是指浏览器进程将网络进程接收到的 HTML 数据提交给渲染进程，具体流程是这样的

    - 首先当浏览器进程接收到网络进程的响应头数据之后，便向渲染进程发起“提交文档”的消息；
    - 渲染进程接收到“提交文档”的消息后，会和网络进程建立传输数据的“管道”
    - 等文档数据传输完成之后，渲染进程会返回“确认提交”的消息给浏览器进程
    - 浏览器进程在收到“确认提交”的消息后，会更新浏览器界面状态，包括了安全状态、地址栏的 URL、前进后退的历史状态，并更新 Web 页面

5. 渲染阶段

    1. Html 构建dom树
            浏览器不能直接识别html文件，需要使用html解析器解析为dom树，dom就可以通过js来操作了
    2. 样式计算（cssom）
        1. styleSheets。
        2. 转换样式表中的属性值，使其标准化
            - 2em 被解析成了 32px，red 被解析成了 rgb(255,0,0)，bold 被解析成了 700……
        3. 计算出 DOM 树中每个节点的具体样式
    3. 布局阶段
        1. 创建布局树（渲染树）
            - DOM 树还含有很多不可见的元素，比如 head 标签，还有使用了 display:none 属性的元素。所以在显示之前，我们还要额外地构建一棵只包含可见元素布局树。
        2. 布局计算 坐标计算，具体的位置保存在布局数中
        3. 分层
            - 因为页面中有很多复杂的效果，如一些复杂的 3D 变换、页面滚动，或者使用 z-indexing 做 z 轴排序等，为了更加方便地实现这些效果，渲染引擎还需要为特定的节点生成专用的图层，并生成一棵对应的图层树（LayerTree）
            - 每一层分别绘制

## 缓存

- Service Worker
- memory cache
- disk cache
- Push Cache

![浏览器缓存图](/interview/浏览器缓存.png)

- 强缓存
    1. Expires http 1的产物， 更改本地时间会时效
    2. Cache-Control

        - public：所有内容都将被缓存（客户端和代理服务器都可缓存）。具体来说响应可被任何中间节点缓存，如 Browser <-- proxy1 <-- proxy2 <-- Server，中间的proxy可以缓存资源，比如下次再请求同一资源proxy1直接把自己缓存的东西给 Browser 而不再向proxy2要。

        - private：所有内容只有客户端可以缓存，`Cache-Control`的默认取值。具体来说，表示中间节点不允许缓存，对于Browser <-- proxy1 <-- proxy2 <-- Server，proxy 会老老实实把Server 返回的数据发送给proxy1,自己不缓存任何数据。当下次Browser再次请求时proxy会做好请求转发而不是自作主张给自己缓存的数据。

        - no-cache：客户端缓存内容，是否使用缓存则需要经过协商缓存来验证决定。表示不使用 `Cache-Control`的缓存控制方式做前置验证，而是使用 `Etag` 或者`Last-Modified`字段来控制缓存。需要注意的是，`no-cache`这个名字有一点误导。设置了`no-cache`之后，并不是说浏览器就不再缓存数据，只是浏览器在使用缓存数据时，需要先确认一下数据是否还跟服务器保持一致。

        - no-store：所有内容都不会被缓存，即不使用强制缓存，也不使用协商缓存

        - max-age：`max-age=xxx (xxx is numeric)`表示缓存内容将在xxx秒后失效

        - s-maxage（单位为s)：同`max-age`作用一样，只在代理服务器中生效（比如CDN缓存）。比如当`s-maxage=60`时，在这60秒中，即使更新了CDN的内容，浏览器也不会进行请求。`max-age`用于普通缓存，而s-maxage用于代理缓存。`s-maxage`的优先级高于`max-age`。如果存在`s-maxage`，则会覆盖掉`max-age`和`Expires header`。

        - max-stale：能容忍的最大过期时间。`max-stale`指令标示了客户端愿意接收一个已经过期了的响应。如果指定了max-stale的值，则最大容忍时间为对应的秒数。如果没有指定，那么说明浏览器愿意接收任何age的响应（age表示响应由源站生成或确认的时间与当前时间的差值）。

        - min-fresh：能够容忍的最小新鲜度。`min-fresh`标示了客户端不愿意接受新鲜度不多于当前的age加上`min-fresh`设定的时间之和的响应。

    3. Expires和Cache-Control两者对比
        其实这两者差别不大，区别就在于`Expires` 是http1.0的产物，`Cache-Control`是http1.1的产物，两者同时存在的话，`Cache-Control`优先级高于`Expires`；在某些不支持HTTP1.1的环境下，Expires就会发挥用处。所以Expires其实是过时的产物，现阶段它的存在只是一种兼容性的写法。
        强缓存判断是否缓存的依据来自于是否超出某个时间或者某个时间段，而不关心服务器端文件是否已经更新，这可能会导致加载文件不是服务器端最新的内容，那我们如何获知服务器端内容是否已经发生了更新呢？此时我们需要用到协商缓存策略。

- 协商缓存
    1. Last-Modified和If-Modified-Since
        - 浏览器下一次请求这个资源，浏览器检测到有 Last-Modified这个header，于是添加If-Modified-Since这个header，值就是Last-Modified中的值；服务器再次收到这个资源请求，会根据 If-Modified-Since 中的值与服务器中这个资源的最后修改时间对比，如果没有变化，返回304和空的响应体，直接从缓存读取，如果If-Modified-Since的时间小于服务器中这个资源的最后修改时间，说明文件有更新，于是返回新的资源文件和200 者所有。
        - 如果本地打开缓存文件，即使没有对文件进行修改，但还是会造成 Last-Modified 被修改，服务端不能命中缓存导致发送相同的资源
        因为 Last-Modified 只能以秒计时，如果在不可感知的时间内修改完成文件，那么服务端会认为资源还是命中了，不会返回正确的资源
        既然根据文件修改时间来决定是否缓存尚有不足，能否可以直接根据文件内容是否修改来决定缓存策略？所以在 HTTP / 1.1 出现了 ETag 和If-None-Match

    2. ETag和If-None-Match

        - Etag是服务器响应请求时，返回当前资源文件的一个唯一标识(由服务器生成)，只要资源有变化，Etag就会重新生成。浏览器在下一次加载资源向服务器发送请求时，会将上一次返回的Etag值放到request header里的If-None-Match里，服务器只需要比较客户端传来的If-None-Match跟自己服务器上该资源的ETag是否一致，就能很好地判断资源相对客户端而言是否被修改过了。如果服务器发现ETag匹配不上，那么直接以常规GET 200回包形式将新的资源（当然也包括了新的ETag）发给客户端；如果ETag是一致的，则直接返回304知会客户端直接使用本地缓存即可。
    3. 两者之间对比：

        首先在精确度上，Etag要优于Last-Modified。
    Last-Modified的时间单位是秒，如果某个文件在1秒内改变了多次，那么他们的Last-Modified其实并没有体现出来修改，但是Etag每次都会改变确保了精度；如果是负载均衡的服务器，各个服务器生成的Last-Modified也有可能不一致。

        第二在性能上，Etag要逊于Last-Modified，毕竟Last-Modified只需要记录时间，而Etag需要服务器通过算法来计算出一个hash值。
    第三在优先级上，服务器校验优先考虑Etag

- 缓存机制

    强制缓存优先于协商缓存进行，若强制缓存(Expires和Cache-Control)生效则直接使用缓存（缓存命中不进行请求返回200），若不生效则进行协商缓存(Last-Modified / If-Modified-Since和Etag / If-None-Match)，协商缓存由服务器决定是否使用缓存，若协商缓存失效，那么代表该请求的缓存失效，返回200，重新返回资源和缓存标识，再存入浏览器缓存中；生效则返回304，继续使用缓存

    [彻底理解浏览器的缓存机制](https://juejin.cn/post/6844903593275817998)

## 回流和重绘

## 三次握手，四次挥手

[3次握手，4次挥手](https://blog.csdn.net/qzcsu/article/details/72861891)

## 同源策略

同源策略
    协议，域名，端口号

    安全性
        1. 数据
        2. dom
        3. 网络请求
    
    xss攻击
        1. 存储型，恶性脚本存储到服务端，用户点击执行，比如输入昵称加入 script脚本
        2. 反射型，服务端把代码反射到前端页面，执行恶意脚本
        3. dom，操作dom改变页面结构，收集用户信息
    xss攻击防御
        1. 服务端过滤或者转码 <script></script>
        2. csp
        3. 关键cookie使用httpOnly, 让脚本不能通过document.cookie来获取cookie信息

    CSRF攻击
        利用用户号的登录状态发起请求，
        1. 自动get请求，比如图片的src是个请求地址
        2. 自动Post请求，比如隐藏的form表单
        3. 引导用户点击链接或者图片，发起一次请求

    CSRF防御
        1. 利用cookie same-site属性
            Strict 完全禁止第三方cookie
            Lax
            None
        2. 验证站点来源
            referrer  https://web.dev/referrer-best-practices/
            origin 不带地址信息，只有域名信息
        3. token

## cookie

- http 无状态；出现了cookie来记录状态

- cookie的设置：

1. client发送请求到serve
2. server 返回set-cookie
3. 浏览器接收到存储cookie
4. 之后每次请求都会在请求头中携带cookie

- cookie属性

    1. key/value

    2. expires: Wed, 21 Oct 2015 07: 28: 00 GMT

    3. max-age: 10000

        - 正数：

        - 负数：会话级别

        - 0：直接删除

        - max-age优先级高于expires

    4. Domain 主机名

        - 像淘宝首页设置的 Domain 就是.taobao.com， 这样无论是 a.taobao.com 还是 b.taobao.com 都可以使用 Cookie。在这里注意的是， 不能跨域设置 Cookie， 比如阿里域名下的页面把 Domain 设置成百度是无效

    5. path 请求的起源路径匹配才能携带 一般为 `/`

    6. Secure  只能在https请求下才能携带；保证cookie不会篡改

    7. httpOnly 只能服务器通过set-cookie设置，客户端不能获取和修改

    8. SameSite

        - Strict: 同站才能携带

        - Lax: 允许部分第三方携带

            1. 允许

            ```html
                <a href=''></a>
            ```

            ```html
            // 预加载
            <link ref='prerender' href=''></link>             
            ```

            get表单

            2. 不允许

            - iframe
            - post表单
            - ajax/fetch

            ``` html
                <img src='' />
            ```

            3. ![Strict-Lax-None](/interview/Strict-Lax-None.png)

- None: 允许所有第三方

- 由于新版本Chrome 80以上 默认策略是SameSite设置为Lax, 为了避免网站受影响， 许多人想到的最简单的方法就是设置SameSite属性为None。 不过有些老版本浏览器并不识别值为None的情况， 所以一般服务端需要这么设置：`Set-cookie: key=value; SameSite=None; Secure`
`Set-cookie: key=value; Secure`另外一点需要注意的是当设置SameSite = None时， 必须同时设置Secure属性。有些浏览器不识别`SameSite = None`或者把`SameSite = None`当`成SameSite = Strict`来处理.

- 同站

  a.taobao.com b.taobao.com 一级域名一样视为同站

- [cookie跨域](https://segmentfault.com/a/1190000039227924)
- [跨源资源共享（CORS）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)
- [HTTP cookies](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies#samesite_cookies)
- [cookie的sameSite属性](http://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html)

- sameSite是为了防止csrf攻击而产生的属性，如果不知道啥是CSRF攻击，可以看我这篇文章。由于我们需要在请求中带上cookie，所以需要在set-cookie时将cookie的sameSite设置为none；又由于将sameSite设置为none时，也需要将Secure设置上，所以请求需要基于https;

## fetch-ajax

[fetch-ajax](https://github.com/camsong/blog/issues/2)

[阮一峰: Fetch API 教程](http://www.ruanyifeng.com/blog/2020/12/fetch-tutorial.html)

<https://www.cnblogs.com/wonyun/p/fetch_polyfill_timeout_jsonp_cookie_progress.html>

Fetch 常见坑

1. Fetch 请求默认是不带 cookie 的，需要设置 fetch(url, {credentials: 'include'})
2. 服务器返回 400，500 错误码时并不会 reject
3. 只有网络错误这些导致请求不能完成时，fetch 才会被 reject。
4. fetch 不支持设置timeout
5. fetch 下载进度 Response.body

    ``` js
    const response = await fetch('flower.jpg');
    const reader = response.body.getReader();

    while(true) {
        const {done, value} = await reader.read();

        if (done) {
            break;
        }

        console.log(`Received ${value.length} bytes`)
    }
    ```

6. 取消fetch()请求

    ``` js
    let controller = new AbortController();
    let signal = controller.signal;

    fetch(url, {
    signal: controller.signal
    });

    signal.addEventListener('abort',
    () => console.log('abort!')
    );

    controller.abort(); // 取消

    console.log(signal.aborted); // true
    ```

7. fetch不支持JSONP
8. fetch不支持progress事件

IE 使用策略

- 所有版本的 IE 均不支持原生 Fetch，fetch-ie8 会自动使用 XHR 做 polyfill。但在跨域时有个问题需要处理。
- IE8, 9 的 XHR 不支持 CORS 跨域，虽然提供 XDomainRequest，但这个东西就是玩具，不支持传 Cookie！如果接口需要权限验证，还是乖乖地- 使用 jsonp 吧，推荐使用 fetch-jsonp。如果有问题直接提 issue，我会第一时间解决。

## http

1. http/0.9
2. http/1.0
    请求头，响应头
    多种类型文件的下载
3. http/1.1
    持久连接，一个tpc支持多个http请求
    虚拟主机（cdn）
    不成熟的管线化（一个http请求成功，下一个才能发起）
    Chunk transfer 机制来解决这个问题，服务器会将数据分割成若干个任意大小的数据块，每个数据块发送时会附上上个数据块的长度，最后使用一个零长度的块作为发送数据完成的标志。这样就提供了对动态内容的支持。
4. http/2
    一个带宽只有一个tcp请求，防止tcp彼此竞争造成带宽浪费

    多路复用（增加了二进制分帧层）
        请求ID的帧编号
    请求优先级 一般是html>css>静态js>font=image>async js
    请求头和响应头的压缩

## https

[前端进阶高薪必看-HTTPS篇](https://juejin.cn/post/6844904150115827725)

## sessionStorage,localStorage

local 同源，跨会话，跨窗口共享

session 同源，跨会话，跨窗口都不共享

## sso

[soo点击登录](https://yq.aliyun.com/articles/636281)

1. 同域
   - cookie不能跨域携带
   - 设置同域名.a.com（顶级域名）
2. 不同域
   1. app1登录
      1. 没有登录
      2. 跳转到SSO系统
         1. 用户没有登录则弹出到用户登录页面
      3. 用户填写用户名，密码
         1. 进入SSO系统验证，将登录状态写入SSO系统的session; 浏览器写入SSO域下的cookie
      4. SSO系统在登录完成之后会给app系统发送ST(service ticket), 跳转到app1系统
      5. app1系统拿着ST向SSO发送，验证是否有效
      6. 验证通过后，在app1系统中存session并设置app1系统下的cookie
   2. app2登录
      1. 用户访问app2系统没有登录，跳转到SSO系统
      2. SSO已经登录不需要验证
      3. SSO发送ST到app2系统，并跳转到app2系统
      4. app2拿到ST,发送请求到SSO，没有失效验证成功
      5. 验证成功；在app2讲登录状态写入session,并在app2下种下cookie
      6. app2就不需要登录了

## 图片直接下载

- 一个图片 url 访问后直接下载怎样实现？

请求的返回头里面，用于浏览器解析的重要参数就是 OSS 的 API 文档里面的返回 http
头，决定用户下载行为的参数。
下载的情况下：

1. x-oss-object-type: Normal
2. x-oss-request-id: 598D5ED34F29D01FE2925F41
3. x-oss-storage-class: Standard

- 公司实现方式

content-disposition: attachment; filename="cf239bf37fe8428c976bf323c04ff585.jpg"

Content-Disposition属性有两种类型：inline 和 attachment inline ：将文件内容直接显示在页面 attachment：弹出对话框让用户下载

## 解析url

```js
// url += (url.indexOf('?') === -1) ? '?' : '&';

// url += (url.includes('?')) ? '&' : '?'

function parse(url) { 
    const queryString= url.split('?')[1]
    const queryArray = queryString.split('&')
    let result = {}

    queryArray.forEach((keyValueStr) => {
        if (keyValueStr.includes('=')) {
            let [key, value] = keyValueStr.split('=')

            // decode
            value = decodeURIComponent(value)
            value = isNumber(value) ? parseFloat(value) : value

            if (result[key]) {
                result[key] = [result[key], value]
            }else {
                result[key] = value
            }
        }else {
            result[keyValueStr] = true
        }
    })

    return result
}

function isNumber(str) {
    return /^d+$/.test(str)
}
```
