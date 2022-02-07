---
title: 'css基础'
navbar: true
description: 'css基础'
tags: ['前端基础','js', 'css', 'html']
---

## 动画

## 什么是BFC

[MDN:格式化上下文](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)
[BFC](https://zhuanlan.zhihu.com/p/25321647)

BFC决定了元素如何对其内容进行定位，以及与其他元素的关系和相互作用。

具有 BFC 特性的元素可以看作是隔离了的独立容器，容器里面的元素不会在布局上影响到外面的元素，并且 BFC 具有普通容器所没有的一些特性。

触发条件

- HTML 根元素
- 浮动元素：float 除 none 以外的值
- 绝对定位元素：position (absolute、fixed)
- display 为 inline-block、table-cells、flex
- overflow 除了 visible 以外的值 (hidden、auto、scroll)

BFC的原理（渲染规则）

- BFC内的元素垂直方向的边距会发生重叠。属于不同BFC的元素外边距不会发生重叠
- BFC的区域不会与浮动元素的布局重叠。
- BFC元素是一个独立的容器，外面的元素不会影响里面的元素。里面的元素也不会影响外面的元素。
- 计算BFC高度的时候，浮动元素也会参与计算(清除浮动)

## 1像素问题

- less实现

```less
// 0.5px边框 （top bottom left right）
.border-side-1px (@side, @color) {
    position: relative;

    &::after {
        content: '';
        position: absolute;
        background-color: @color;

        & when (@side =top) or (@side =bottom) {
            @{side}: 0;
            left: 0;
            width: 100%;
            height: 1px;
            transform: scale(1, .5);
        }

        & when (@side =left) or (@side =right) {
            @{side}: 0;
            top: 0;
            width: 1px;
            height: 100%;
            transform: scale(.5, 1);
        }

        & when (@side =all) {
            left: 0;
            top: 0;
            width: 200%;
            height: 200%;
            transform: scale(0.5, 0.5);
            transform-origin: 0 0;
            border: 1px solid @color;
            background-color: transparent;
        }
    }
}
```

- sass实现

```scss
@mixin borer-1px ($direction: all, $color: #000000, $radius: 4px) {
    position: relative;

    &::after {
        content: '';
        position: absolute;

        @if $direction==all {
            left: 0;
            top: 0;
            border: 1px solid $color;
            width: 100%;
            height: 100%;
        }

        @if $direction==left {
            left: 0;
            top: 0;
            border-left: 1px solid $color;
            width: 1px;
            height: 100%;
        }

        @if $direction==right {
            right: 0;
            top: 0;
            border-right: 1px solid $color;
            width: 1px;
            height: 100%;
        }

        @if $direction==top {
            left: 0;
            top: 0;
            border-top: 1px solid $color;
            width: 100%;
            height: 1px;
        }

        @if $direction==bottom {
            right: 0;
            bottom: 0;
            border-bottom: 1px solid $color;
            width: 100%;
            height: 1px;
        }

        @media (-webkit-min-device-pixel-ratio: 2) {
            @if $direction==all {
                transform-origin: 0 0;
                border-radius: $radius;
                width: 200%;
                height: 200%;
                transform: scale(0.5, 0.5);
            }

            @if $direction==left or $direction==right {
                border-radius: $radius;
                transform: scale(0.5, 1);
            }

            @if $direction==top or $direction==bottom {
                border-radius: $radius;
                transform: scale(1, 0.5);
            }
        }

        @media (-webkit-min-device-pixel-ratio: 3) {
            @if $direction==all {
                transform-origin: 0 0;
                border-radius: $radius;
                width: 300%;
                height: 300%;
                transform: scale(0.33, 0.33);
            }

            @if $direction==top or $direction==bottom {
                border-radius: $radius;
                transform: scale(1, 0.33);
            }
        }
    }
}
```

## 盒模型

IE模型和标准模型唯一的区别是内容计算方式的不同

- 标准

    ```css
        box-sizing: content-box
    ```

    标准模型元素宽度width=content
    margin + border + padding + content

    1. 如果设置了dom的宽高,添加了border,padding,margin
    2. 然后获取dom的宽度: 包括 content,padding,border

- 怪异

    ```css
        box-sizing: border-box;
    ```

    IE模型元素宽度width=content+padding+border
    width(border+padding+content) + margin

    1. 如果设置了dom的宽高,添加了border,padding,margin
    2. 获取dom的宽度仍为content
    3. 添加的border,padding实际是向内挤的

## 三角形,梯形

- 三角形

    ```css
    .div{
      width: 0px;
      height: 0px;
      border-width:100px;
      border-left: transparent;
      border-right: transparent;
      border-top: transparent;
      border-bottom: solid red
    }
    ```

- 梯形

    ```css
    .div{
      width: 50px;
      height: 50px;
      border-width:40px;
      border-left: transparent;
      border-right: transparent;
      border-top: transparent;
      border-bottom: solid red
    }
    ```

- 用伪类实现

    [伪类实现三角形（实心，虚）](https://www.jianshu.com/p/d5868ae36707)

## 水平垂直居中

[CSS-水平居中、垂直居中、水平垂直居中](https://segmentfault.com/a/1190000014116655)

- 定位，
    1. left,right,top,bottom都是0,  smargin:auto
    2. 已知宽高margin-left: -30px
    3. 未知宽高：transform: traslat(-50%, -50%)
- display: flex
- table-cell

    ```css
    .div { 
        display:table-cell;
        text-align:center;
        vertical-align: middle;
    } 
    ```

## flex

[Flex 布局教程：语法篇](https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

- flex-direction
- flex-wrap
- flex-flow: flex-direction属性和flex-wrap属性的简写形式，默认值为row nowrap
- justify-content
- align-items
- align-content

项目属性

- order: 属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。
- flex-grow: 属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。
- flex-shrink: 属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
    如果所有项目的flex-shrink属性都为1，当空间不足时，都将等比例缩小。如果一个项目的flex-shrink属性为0，其他项目都为1，则空间不足时，前者不缩小。负值对该属性无效
- flex-basis
- flex: flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。
- align-self: align-self属性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。

## px.em.rem.vw.vh

[px/rem/em/vh/vw](https://www.jianshu.com/p/82f02af17e78)
