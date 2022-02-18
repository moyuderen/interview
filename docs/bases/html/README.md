---
title: 'html基础'
navbar: true
description: 'html基础'
tags: ['前端基础','js', 'css', 'html']
---

## html语义化

`header`, `section`, `article`, `nav`, `aside`, `footer`

- 结构清晰
- 利于seo,根据标签来确定上下文 和关键字的权重
- 方便设备解析
- 有利于开发人员的维护，可读性高

## h5中新的标签

- canvas
- audio
- video
- SVG

## h5中的新的属性和方法

### Canvas

### WebSocket

### draggable 拖拽api

### Web Workers API

### Web Storage API

### history api (路由 )

### [requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)

## script执行顺序
[async、defer与DOMContentLoaded的执行先后关系](https://blog.csdn.net/zyj0209/article/details/79698430)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>test</title>
    <script src='./a.js' defer></script>
    <script src='./b.js' async ></script>
    <script>
        console.log('header')
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOMContentLoaded')
        })

        window.addEventListener('load', () => {
            console.log('load')
        })
    </script>
</head>
<body>
    <script>
        console.log('div')
    </script>
</body>
</html>
```

执行结果 ：

header
div
a
DOMContentLoaded
b
load

分析：
defer在 DOMContentLoaded后执行，因为defer是在文档解析完成后执行，并不是加载完成
async 在边解析边执行，执行时会暂停文档的解析（文档未解析完成），顺序无法确定
