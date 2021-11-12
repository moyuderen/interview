---
title: '算法'
navbar: true
description: '算法'
tags: ['数据结构与算法','算法']
---

## leetcode

[leetcode](https://leetcode-cn.com/progress/)

## 冒泡排序

```js

var arr = [13,3,12,4,4,1,56]

function sort(arr) {
    if(!Array.isArray(arr)) {
        return
    }
    if(arr.length <=1) {
        return arr
    } 
    
    let len = arr.length
    for(let i=0; i<len-1; i++) {
        let num = 0
        for(let j=0; j<len-1-i; j++) {
            if(arr[j] > arr[j+1]) {
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]]
                num++
            }
        }
        
        if(num === 0) {
            return arr
        }
    }

    return arr
}

sort(arr)
```

```js
var arr = [1, 2, 3, 31, 45, 5, 1, 27, 8, 1, 223]

function bubbleSort(arr) {
    let result = [...arr]

    for(let i=0; i<result.length-1; i++) {
        for(let j=0; i<result.length-1-j; j++) {
            let pre = result[j]
            let next = result[j+1]
            if(pre > next) {
                [result[j], result[j+1]] = [result[j+1], result[j]]
            }
        }
    }

    return [result, arr]
}

const [target, source] = bubbleSort(arr)

// console.log('source', source)
console.log('target', target)

// 原理：
// 1. 比较相邻两个元素的大小，较大或者较小的元素向后排（交换位置），直到排到最后一个元素，
// 2. 排除最后一个元素，重复执行1步骤


function bubbleSort(list) {
    for (let i = 0; i < list.length - 1; i++) {
        for (let j = 0; j < list.length - 1 - i; j++) {
            if (list[j] < list[j + 1]) {
                let tmp = list[j]
                list[j] = list[j + 1]
                list[j + 1] = tmp
            }
        }
    }
    return list
}

function bubbleSort1(list) {
    const len = list.length
    for (let i = len - 1; i > 0; i--) {
        for (let j = 0; j < i; j++) {
            if (list[j] > list[j + 1]) {
                let temp = list[j + 1]
                list[j + 1] = list[j]
                list[j] = temp
            }
        }
    }
    return list
}
// 优化  本来就排序好的
function optimizeBubbleSort(list) {
    const len = list.length
    for (let i = 0; i < len - 1; i++) {
        let count = 0
        for (let j = 0; j < len - 1 - i; j++) {
            if (list[j] > list[j + 1]) {
                [list[j], list[j + 1]] = [list[j + 1], list[j]]
                count++
            }
        }
        if (count === 0) {
            return list
        }
    }
    return list
}
const list = [212, 33, 3, 21, 67, 3, 88, 5, 5]
const list1 = [1, 2, 3, 4, 5, 6, 7]

console.log(bubbleSort(list))
console.log(bubbleSort1(list))
console.log(optimizeBubbleSort(list1))
```

## 选择排序

```js
// 原理
// 1. 遍历所有元素，选择其中的最大或者最小的值，排到最后一位
// 2. 排除最后一位，重复执行1步骤

const arr = [1, 2, 3, 31, 45, 5, 1, 27, 8, 1, 223]

function selectSort(arr) {
    let ret = [...arr]

    for(let i=0; i<ret.length-1; i++) {
        let maxindex = i
        for(let j=i+1; j<ret.length; j++) {
            if(ret[j] > ret[maxindex]) {
                maxindex = j
            }
        }
        
        [ret[i], ret[maxindex]] = [ret[maxindex], ret[i]]
    }

    return ret
}

console.log(selectSort(arr))


function selectSort(list) {
    const len = list.length
    for (let i = 0; i < len - 1; i++) {
        let min_index = i
        // 找到最小的元素下标
        for (let j = i + 1; j < len; j++) {
            if (list[min_index] > list[j]) {
                min_index = j
            }
        }
        // 如果最小元素下班 就是当前下标位置不动 否则交互两个元素位置
        if (min_index != i) {
            const temp = list[i]
            list[i] = list[min_index]
            list[min_index] = temp
        }
    }
    return list
}


const list = [212, 33, 3, 21, 67, 3, 88, 5, 5]

console.log(selectSort(list))
```

## 插入排序

```js
var arr = [1, 2, 3, 31, 45, 5, 1, 27, 8, 1, 223]

function insert_sort(arr) {
    for(let i=0; i<arr.length; i++) {
        for(let j=0; j<i; j++) {
            if(arr[i+1] > arr[j]) {
                [arr[i+1], arr[j]] = [arr[j], arr[i+1]]
            }
        }
    }
    return arr
}

console.log(insert_sort(arr))

function insertSort(list) {
    const len = list.length
    for (let index = 0; index < len - 1; index++) {
        for (let i = 0; i < index; i++) {
            if (list[index + 1] > list[i]) {
                const temp = list[i]
                list[i] = list[index + 1]
                list[index + 1] = temp
            }
        }
    }
    return list
}

function insertSort1(list) {
    const len = list.length
    for (let i = 0; i < len - 1; i++) {
        for (let j = i; j >= 0; j--) {
            if (list[j + 1] < list[j]) {
                [list[j], list[j + 1]] = [list[j + 1], list[j]]
            }
        }
    }
    return list
}

const list = [212, 33, 3, 21, 67, 3, 88, 5, 5]
console.log(insertSort(list))
console.log(insertSort1(list))
```

## 快速排序

```js
var arr = [1, 2, 3, 31, 45, 5, 1, 27, 8, 1, 223]

function quickSort(arr) {
    if(arr.length <=1) {
        return arr // 终止条件
    }

    let pointIndex = Math.floor(arr.length/2)
    let point = arr.splice(pointIndex, 1)[0]
    let left = []
    let rigth = []

    for(let i=0; i<arr.length; i++) {
        if (arr[i] < point) {
            left.push(arr[i])
        }else {
            rigth.push(arr[i])
        }
    }

    return quickSort(left).concat([point], quickSort(rigth))
}

// console.log('quickSort', quickSort(arr))

function quick_sort(arr) {
    if(arr.length <= 1) {
        return arr
    }

    let midIndex = Math.floor(arr.length/2)
    let mid = arr.splice(midIndex, 1)
    let left = []
    let right = []

    arr.forEach(item => {
        if(item < mid) {
            left.push(item)
        }else {
            right.push(item)
        }
    })

    return quickSort(left).concat(mid, quickSort(right))
}

console.log('quick_sort', quick_sort(arr))

// concat 参数可以是多个元素，或者一个数组； concat不会改变原来的数组
// push 参数可以是一个或者多个元素；push会改变原来的数组
    // push 参数是一个数组时，插入的元素为一个数组
```

## 反转链表

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
    if (!head || !head.next) {
        return head
    }

    let cur = head
    let pre = null

    while (cur) {
        let next = cur.next
        cur.next = pre
        pre = cur
        cur = next
    }

    return pre
};
```

## 斐波那契

```ts
function fib1(n: number): number {
    if (n === 0 || n === 1) {
        return n
    }

    return fib1(n - 1) + fib1(n - 2)
};

/**动态规划 */
function fib(n: number): number {
    if (n < 2) {
        return n
    }

    let p = 0
    let q = 0
    let r = 1
    for (let i = 2; i <= n; i++) {
        p = q
        q = r
        r = p + q
    }
    return r
};
```

## 给定一个链表，判断链表中是否有环

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function (head) {
    let node = head
    let map = new Map()

    while (node) {
        if (map.has(node)) {
            return true
        }
        map.set(node, node)
        node = node.next
    }

    return false
};
```

## 括号匹配

```js

var str = '(){}'

function check(str) {
    const map = {
        '(':-1,
        ')':1,
        '[':-1,
        ']':1,
        '{':-1,
        '}':1
    }
    let arr = []
    for(val of str) {
        if(map[val] < 0) {
            arr.push(val)
        }else {
            let last = arr.pop()
            if(map[last] + map(val) !== 0) return false
        }
    }

    if(arr.length) return false
    return true
}
```

## 两个大数相加

```js
let a = '9007199254740991'
let b = '1234567899999999999'

function add (a, b) {  
    const maxLength = Math.max(a.length, b.length)
    
    a = a.padStart(maxLength, '0') // '0009007199254740991'
    b = b.padStart(maxLength, '0') // '1234567899999999999'

    let sum = ''
    let f = 0 // 进位
    let t
    for(let i=maxLength-1; i>=0; i--) {
        t = parseInt(a[i]) + parseInt(b[i]) + f
        if(t >= 10) {
            f = 1
        }else {
            f = 0
        }

        sum = sum + t % 10
    }

    if(f === 1) {
        sum = '1' + sum
    }

    return sum
}
```

## 罗马数字转整数

罗马数字包含以下七种字符: I， V， X， L，C，D 和 M。

字符          数值
I             1
V             5
X             10
L             50
C             100
D             500
M             1000
例如， 罗马数字 2 写做 II ，即为两个并列的 1。12 写做 XII ，即为 X + II 。 27 写做  XXVII, 即为 XX + V + II 。

通常情况下，罗马数字中小的数字在大的数字的右边。但也存在特例，例如 4 不写做 IIII，而是 IV。数字 1 在数字 5 的左边，所表示的数等于大数 5 减小数 1 得到的数值 4 。同样地，数字 9 表示为 IX。这个特殊的规则只适用于以下六种情况：

I 可以放在 V (5) 和 X (10) 的左边，来表示 4 和 9。
X 可以放在 L (50) 和 C (100) 的左边，来表示 40 和 90。
C 可以放在 D (500) 和 M (1000) 的左边，来表示 400 和 900。
给定一个罗马数字，将其转换成整数。输入确保在 1 到 3999 的范围内。

```ts
const RomanMapToInt = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
}

function romanToInt(str: string): number {
    let total = 0

    for(let i=0; i< str.length; i++) {
        const currStr = str[i]
        const nextStr = str[i+1]
        const currNum = RomanMapToInt[currStr] 
        const nextNum = RomanMapToInt[nextStr]

        if(!nextNum) {
            total += currNum
            break
        }

        if(currNum < nextNum) {
            total = total + nextNum - currNum
            i++
        }else {
            total += currNum
        }
    }

    return total
};
```

```js
var mySqrt = function(x) {
    let res = 1
    while(res * res <= x) {
        res++
    }
    return res - 1
};
```

## 平方根

```js
var mySqrt = function(x) {
    if(x === 1) {
        return 1
    }

    let last = Math.floor(x / 2)

    for(let i=0; i<=last;  i++) {
        if(i*i > x) {
            return i-1
        }
    }

    return last
};
```

## 删除列表中的节点

```js
class ListNode {
    val: number
    next: ListNode | null
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val === undefined ? 0 : val)
        this.next = (next === undefined ? null : next)
    }
}

/**
 Do not return anything, modify it in-place instead.
 */

function deleteNode(root: ListNode | null): void {
    if (!root) {
        return
    }

    root.val = root.next.val
    root.next = root.next.next
};
```

## 删除有序数组中的重复项

```js
function removeDuplicates(nums: number[]): number {
    let map = new Map()

    for (let i = 0; i < nums.length; i++) {
        const item = nums[i]
        if (map.has(item)) {
            nums.splice(i, 1)
            i--
            continue
        }

        map.set(item, true)
    }

    return nums.length
};
```

## 实现 strStr()

```js
// 给你两个字符串 haystack 和 needle ，请你在 haystack 字符串中找出 needle 字符串出现的第一个位置（下标从 0 开始）。如果不存在，则返回  -1 。

function strStr1(haystack: string, needle: string): number {
    const ex =  new RegExp(`${needle}`).exec(haystack)
    return ex ? ex.index : -1
};


function strStr2(haystack: string, needle: string): number {
    return haystack.indexOf(needle)
};

function strStr3(haystack: string, needle: string): number {
    if (!needle) {
        return 0
    }

    if (!haystack) {
        return -1
    }
    // 最坏的情况是 要匹配的字符在最后面，所以比较前面的长度，遇到匹配字符时在比较
    for (let i = 0; i <= haystack.length - needle.length; i++) {
        if (haystack[i] === needle[0]) {
            let flag = true

            for (let j = 0; j < needle.length; j++) {
                if (haystack[i + j] !== needle[j]) {
                    flag = false
                    break
                }
            }

            if (flag) {
                return i
            }
        }
    }

    return -1
};
```

## trim

```js
function trim(str) {
    return str.replace(/^s+|s+$/g, '')
}
```

## 是否为回文数

```js
function isPalindrome2(x: number): boolean {
    let xStr = x.toString()
    let mid = Math.floor(xStr.length / 2)

    for (let i = 0; i < mid; i++) {
        if (xStr[i] !== xStr[xStr.length - i - 1]) {
            return false
        }
    }

    return true
};

/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function (str) {
    str = str.replace(/[^0-9a-zA-Z]/g, '').toLowerCase()
    let len = str.length
    let min = 0
    let max = len - 1

    while (min < max) {
        if (str[min] !== str[max]) {
            return false
        }
        min++
        max--
    }

    return true
}
```

## 数组去重

```js
// https://github.com/mqyqingfeng/Blog/issues/27

function unique1(arr) {
    var res = arr.filter(function (item, index, array) {
        return array.indexOf(item) === index
    })
    return res
}

var unique2 = arr => [...new Set(arr)]

function unique3(arr) {
    let result = []

    arr.forEach((item) => {
        if (!result.includes(item)) {
            result.push(item)
        }
    })

    return result
}


function unique3(arr) {
    const map = new Map()
    let result = []

    arr.forEach(item => {
    const map = new Map()
        if(!map.get(item)) {
            result.push(item)
            map.set(item, true)
        }
    })

    return result
}
```

## 数组中的第K个最大元素

```ts
function findKthLargest(nums: number[], k: number): number {
    let sortNums = nums.sort((a, b) => {
        return b - a
    })

    const map = new Map()

    sortNums.forEach((num, index) => {
        map.set(index+1, num)
    })


    return map.get(k)
};

function findKthLargest1(nums: number[], k: number): number {
    return nums.sort((a, b) => {
        return b - a
    })[k - 1]
};
```

## 整数反转

```js
// 给你一个 32 位的有符号整数 x， 返回将 x 中的数字部分反转后的结果。

// 如果反转后整数超过 32 位的有符号整数的范围[−2^31, 2^31− 1]， 就返回 0。

// 假设环境不允许存储 64 位整数（ 有符号或无符号）。

function isSafeValue(x: number): boolean {
    const max = Math.pow(2, 31)
    return x > -max - 1 && x < max
}

function reverse(x: number): number {
    const sign = x >= 0 ? 1 : -1
    const arr = (Math.abs(x) + '').split('')
    const reverseX = Number(arr.reverse().join('')) * sign

    if (!isSafeValue(reverseX)) {
        return 0
    }

    return reverseX

};
```

## 只出现一次的数字

```ts
function singleNumber(nums: number[]): number {
    let map = new Map()

    nums.forEach((item) => {
        if (map.has(item)) {
            map.delete(item)
        } else {
            map.set(item, item)
        }
    })

    for (let value of map.values()) {
        return value
    }
};
```

## 字符串中的第一个唯一字符

```ts
function firstUniqChar(s: string): number {
    let map = new Map()

    for(let i=0; i<s.length; i++) {
        if(map.has(s[i])) {
            const count = map.get(s[i]).count
            map.set(s[i], { count: count+1, index: i})
        }else {
            map.set(s[i], { count: 1, index: i})
        }
    }

    let mapValues = []
    for(let value of map.values()) {
        mapValues.push(value)
    }

    const uniqChars = mapValues.filter((item) => {
        return item.count === 1
    })

    if(uniqChars.length) {
        return uniqChars[0].index
    }

    return -1
};

function firstUniqChar1(s: string): number {
    let map: Map<string, number> = new Map()

    // map值的顺序为插入时的顺序
    for (const char of s) {
        map.set(char, map.has(char) ? map.get(char) + 1 : 1)
    }

    for (const [char, count] of map) {
        if (count === 1) {
            return s.indexOf(char)
        }
    }

    return -1
};
```

## 最长公共前缀

```ts
/**
 * 1.使用正则
 * 2.使用es7的 startWith()
 */
function longestCommonPrefix(strs: string[]): string {

    if(strs.length === 0) {
        return ''
    }

    let prefix = ''
    let tp = strs[0]
    let reg = new RegExp(`^${tp}`)

    while(tp.length > 0) {
        const flag = strs.every((item) => {
            return reg.test(item)
        })

        if(flag) {
            prefix = tp
            return prefix
        }else {
            tp = tp.slice(0, tp.length-1)
            reg = new RegExp(`^${tp}`)
        }
    }

    return prefix
};

function longestCommonPrefix2(strs: string[]): string {
    let prefix = ''

    if (strs.length === 0) {
        return prefix
    }

    let tp = strs[0]

    while (tp.length > 0) {
        const flag = strs.every((item) => {
            return item.startsWith(tp)
        })

        if (flag) {
            prefix = tp
            return prefix
        } else {
            tp = tp.slice(0, tp.length - 1)
        }
    }

    return prefix
};
```

## arrToTree

```js
let arr = [{
        id: 1,
        name: '部门1',
        pid: 0
    },
    {
        id: 2,
        name: '部门2',
        pid: 1
    },
    {
        id: 3,
        name: '部门3',
        pid: 1
    },
    {
        id: 4,
        name: '部门4',
        pid: 3
    },
    {
        id: 5,
        name: '部门5',
        pid: 4
    },
]

function arrToTree(arr) {
    let result = []
    let map = {}

    for(item of arr) {
        map[item.id] = { ...item, children: [] }
    }

    for(item of arr) {
        if(item.pid === 0) {
            result.push(map[item.id])
        }else {
            map[item.pid].children.push(map[item.id])
        }
    }

    return { result, map }
}

const tree = arrToTree(arr)
console.log(tree)
```

## classnames

```js
var hasOwn = {}.hasOwnProperty;

function classNames() {
    var classes = [];

    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (!arg) continue;

        var argType = typeof arg;

        if (argType === 'string' || argType === 'number') {
            classes.push(arg);
        } else if (Array.isArray(arg)) {
            if (arg.length) {
                var inner = classNames.apply(null, arg);
                if (inner) {
                    classes.push(inner);
                }
            }
        } else if (argType === 'object') {
            if (arg.toString === Object.prototype.toString) {
                for (var key in arg) {
                    if (hasOwn.call(arg, key) && arg[key]) {
                        classes.push(key);
                    }
                }
            } else {
                classes.push(arg.toString());
            }
        }
    }

    return classes.join(' ');
}
```

## lru缓存

```ts
class LRUCache {
    capacity: number
    caches: Map<number, number>

    constructor(capacity: number) {
        this.capacity = capacity
        this.caches = new Map()

    }

    get(key: number): number {
        if (!this.caches.has(key)) {
            return -1
        }
        const value = this.caches.get(key)
        this.caches.delete(key)
        this.caches.set(key, value)
        return value
    }

    put(key: number, value: number): void {
        if (this.caches.has(key)) {
            this.caches.delete(key)
        }
        this.caches.set(key, value)

        if (this.caches.size > this.capacity) {
            let keys = this.caches.keys()
            let key = keys.next().value
            this.caches.delete(key)
        }
    }
}

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
```

```js
class LruCache {
    constructor(max = 10) {
        this.max = max
        this.caches = []
    }

    set(key, value) {
        for(let i=0, l=this.caches.length; i<l; i++) {
            // 已存在
            if(this.caches[i].key === key) {
                this.caches.splice(i, 1)
            }else { // 不存在
                if(this.caches.length === max) {
                    this.caches.shift()
                }
            }
        }

        this.caches.push({ key, value})
    }

    get(key) {
        for (let i = 0, l = this.caches.length; i < l; i++) {
            // 已存在
            if (this.caches[i].key === key) {
                this.caches.splice(i, 1)
                this.caches.push({ key, value})
                return this.caches[i].value
            }else {
                return -1
            }
        }
    }
}


// new Map() 顺序是按插入顺序的
// 使用最频繁的是值放在最后
class LruCache2 {
    constructor(limit = 10) {
        this.limit = limit
        this.caches = new Map()
    }

    get(key) {
        if(this.caches.has(key)) {
            const value = this.caches.get(key)
            this.caches.delete(key)
            this.set(key, value)

            return value
        }else {
            return -1
        }
    }

    set(key, value) {
        if(this.caches.has(key)) { // 已存在
            this.caches.delete(key)
        }else {
            if(this.caches.size === this.limit) {
                // 获取第一个key https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/keys
                const firstKey = this.caches.keys().next().value
                this.caches.delete(firstKey)
            }
        }

        this.caches.set(key, value)
    }
}

function lruCache(limit = 10) {
    this.limit = limit
    this.caches = new Map()
}

lruCache.prototype.set = function(key, value) {
    if (this.caches.has(key)) {
        this.caches.delete(key)
    }

    this.caches.set(key, value)

    if(this.caches.size > this.limit) {
        const dKey = this.caches.keys().next().value
        this.caches.delete(dKey)
    }
}

lruCache.prototype.get = function (key) {
    if(!this.caches.has(key)) {
        return -1
    }

    const value = this.caches.get(key)
    this.caches.delete(key)
    this.caches.set(key, value)
}
```
