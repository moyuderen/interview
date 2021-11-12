---
title: 'vue3.x'
navbar: true
description: 'vue3.x'
tags: ['框架', 'vue', 'vue3.x']
---

## function-api

```js

setup(props, context) {
    const count = value(0)
    
    count.value ++

    onMounted(() => {

    })

    onBeforeDestroy(() => {

    })

    watch(() => {
        count.value
    }, () => {
        // todo
    }, {
        deep: true
    })
    return {
        count
    }
}
```
