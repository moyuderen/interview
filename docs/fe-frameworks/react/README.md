---
title: 'react'
navbar: true
description: 'react'
tags: ['框架', 'react',]
---

## hooks

```js
function Test() {
  const [count, setCount] = useState(0)
    useEffect(() => {
     // todo
      return () => {
        // clear todo
      }
   }, [count])
}
```
