---
title: 'typescript'
navbar: true
description: 'typescript'
tags: ['前端基础','js', 'css', 'html']
---

## 常用的ts语法有哪些

- type 类型别名
- interface
- enum
- class
- 联合类型
- 泛型
- 断言
- 声明文件 declare

    ```typescript
    declare modlue '*.vue' {
     import Vue from 'vue'
     export Vue
    }
    ```

- 全局变量

    ```typescript
    declare const mock: bolean
    declare const CODE_VERSION: string
    ```

## type和interface的区别

- 共同点
  - 都能描述一个对象
  - 都能实现继承,也可以相互继承

    ```typescript
    interface A = {}
    interface B = {}
    type c = xxx
    type d = yyy

    A extends B
    c & d

    A extends c
    d & A
    ```

- 不同点
  - type是对类型的重新定义
  - type可以约束基本类型,interface不行

    ```typescript
    type numberOrString = number | string
    ```

  - type 的继承用合并

    ```typescript
    type a = number
    type b = string
    
    b & a
    ```

  - interface 有声明合并
