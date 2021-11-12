---
title: 'css基础'
navbar: true
description: 'css基础'
tags: ['前端基础','js', 'css', 'html']
---

## 1像素

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

- 标准
    margin + border + padding + content

    1. 如果设置了dom的宽高,添加了border,padding,margin
    2. 然后获取dom的宽度: 包括 content,padding,border

- 怪异
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

## flex

## px.em.rem.vw.vh

[px/rem/em/vh/vw](https://www.jianshu.com/p/82f02af17e78)
