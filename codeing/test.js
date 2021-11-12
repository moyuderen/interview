
Function.prototype.bind = function(target = window, ...args) {
    const that = this
    const Fn = function(...args2) {
        if(that instanceof Fn) {
            return new Fn(...args, ...args2)
        }
        return that.call(target, ...args, ...args2)
    }

    return Fn
}

Promise.prototype.all = function(promiseArray) {
    return new Promise((resolve, reject) => {
        const len = promiseArray.length
        const result = new Array(len)
        let count = 0

        promiseArray.forEach((promise, index) => {
            Promise.resolve(promise).then((res) => {
                count++
                result[index] = res
                console.log(index)
                if (count === len) {
                    resolve(result)
                }
            }).catch(e => {
                reject(e)
            })
        });
    })
}

function a() {
    return new  Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('a')
        }, 2000)
    })
}

function b() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('b')
        }, 3000)
    })
}

function c() {
    return 'c'
}

Promise.all([a(), b(), c()]).then(res => {
    console.log('res', res)
}).catch(e => {
    console.log(e)
})

function Father(name, friends) {
    this.name = name
    this.friends = friends
}

Father.prototype.say = function() {
    console.log(this.name)
}

function Child(name, friends) {
    Father.call(this ,name, friends)
}

Child.prototype = Object.create(Father.prototype)
Child.prototype.constructor = Child

function createNew(target, ...args) {
    let obj = {}
    obj.__proto__ = Object.create(target.prototype)
    let result = target.call(obj, ...args)
    return typeof result === 'object' ? ret : obj;
}

function mySetIntervall(fn, time) {
    let timer = null
    let isClear = false

    function interval() {
        if(isClear) {
            clearTimeout(timer)
            return
        }

        fn()
        timer = setTimeout(interval, time)
    }

    fn()
    timer = setTimeout(interval, time)
    
    return () => {
        isClear = true
    }
}

mySetIntervall(fn, 300)

function EventEmitter () {
    this.event = {}

    this.on = function(name, callback) {
        if(this.event[name]) {
            this.event[name] = [...this.event[name], callback]
        }else {
            this.event[name] = [callback]
        }
    }

    this.emitter = function (name, ...args) {
        const callbcaks = this.event[name] || []
        callbcaks.forEach(callback => {
            callback.apply(this, args)
        })
    }

    this.off = function(name, callback) {
        if(this.event[name]) {
            const index = this.events[name].indexOf(callback);
            this.event[name].splice(index, 1)
        }
    }

    this.once = function (name, callback) {
        const fn = () => {
            callback.call(this)
            this.off(name, fn)
        }

        this.on(name, fn)
    }
}

function debounce(fn, wait = 500) {
    let timer = null

    return function(...args) {
        if(timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.call(this, ...args)
        }, wait)
    }
}

function throttle(fn, wait = 500) {
    let start =  null
    return function(...args) {
        let end = new Date()

        if (!start || end - start > wait) {
            fn.call(this, ...args)
            start = end
        }
    }
}

function throttle1(fn, wait = 500) {
    let run = true

    return function(...args) {
        if(run) {
            run = false
            setTimeout(() => {
                fn.call(this, ...args)
                run = true
            }, wait)
        }
    }
}


const str = '()[]{}'

const map = {
    '(': 1,
    ')': -1,
    '[': 2,
    ']': -2,
    '{': 3,
    '}': -3
}

function isValid(str) {
    if (str%2 !== 0) {
        return false
    }

    const arr = str.split('')
    const stack = []

    for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        if(item > 0) {
            stack.push(item)
        }else {
            const last = stack.pop()
            if(last + item !== 0) {
                return false
            }
        }
    }

    if (stack.length) {
        return false
    }

    return true
}

function longestCommonPrefix(strs) {
    let prefix = ''
    let tp = strs[0]

    while(tp.length) {
        const flag = strs.every(item => {
            return item.startWith(tp)
        })

        if(flag) {
            prefix = tp
            return prefix
        }else {
            tp = tp.splice(0, tp.length - 1)
        }
    }

    return prefix
}