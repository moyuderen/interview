/**
 *  new Promise((resolve, reject) => {
         setTimeout(() => {
             resolve(1)
         }, 2000)
     })
     .then((res) => {
         console.log(res)
     }, (err) = {
         console.log(err)
     })
 */

const PENDING = 'pending'
const FULFILLED = 'fullfilled'
const REJECTED = 'rejected'

const isFunction = (fn) => {
    return typeof fn === 'function'
}

const isObject = (obj) => {
    return (typeof obj === 'object' && obj !== null ) || typeof obj === 'function'
}

const resolvePromise = (promise2, x, resolve, reject) => {
    if(promise2 === x) {
        reject(Error('重复引用'))
    }

    let called = false
    if(isObject(x)) {
        if(typeof x.then === 'function') {
            let then = x.then
            // 不要写成 x.then，直接 then.call 就可以了 因为 x.then 会再次取值，Object.defineProperty  Promise/A+ 2.3.3.3
            then.call(x, y => {
                if(called) return
                called = true
                // 递归解析的过程（因为可能 promise 中还有 promise） Promise/A+ 2.3.3.3.1
                resolvePromise(promise2, y, resolve, reject)
            }, e => {
                if(called) return
                reject(e)
            })
        }else {
            resolve(x)
        }
    }else {
        resolve(x)
    }
}


class Promise {
    constructor(executor) {
        this._status = PENDING
        this._value = undefined
        this._reason = undefined

        this._onFulfilledCallbacks = []
        this._onRejectedallbacks = []

        let resolve = (value) => {
            if(this._status === PENDING) {
                this._status = FULFILLED
                this._value = value

                this._onFulfilledCallbacks.forEach((fn) => {
                    fn()
                })
            }
        }

        let reject = (reason) => {
            if(this._status === PENDING) {
                this._status = REJECTED
                this._reason = reason

                this._onRejectedallbacks.forEach((fn) => {
                    fn()
                })
            }
        }

        try {
            executor(resolve, reject)
        } catch(err) {
            reject(err)
        }
    }

    then(onFulfilled, onRejected) {

        onFulfilled = isFunction(onFulfilled) ? onFulfilled : v => v
        onRejected = isFunction(onRejected) ? onRejected: e => { throw new Error(e)}

        const promise2 = new Promise((resolve, reject) => {
            if (this._status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this._value)
                        // resolvePromise
                        resolvePromise(promise2, x, resolve, reject)
                    } catch(e) {
                        reject(e)
                    }
                }, 0) 
            }

            if (this._status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this._reason)
                        resolvePromise(promise2, x, resolve, reject)
                        // resolvePromise
                    } catch(e) {
                        reject(e)
                    }
                }, 0)
            }

            if (this._status === PENDING) {
                this._onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        let x = onFulfilled(this._value)
                        resolvePromise(promise2, x, resolve, reject)
                    }, 0)
                })

                this._onRejectedallbacks.push(() => {
                    setTimeout(() => {
                        let x = onRejected(this._reason)
                        resolvePromise(promise2, x, resolve, reject)
                    }, 0)
                   
                })
            }
        })
        return promise2
    }
}

Promise.all = function (values) { 
    if(!Array.isArray(values)) {
        throw new Error('请传入数组作为参数')
        return
    }

    return new Promise((resolve, reject) => {
        let results = []
        let count = 0
        const processResultByKey = (value, index) => {
            results[index] = value
            count++

            if (count === values.length) {
                resolve(results)
            }
        }

        for (let i = 0; i < values.length; i++) {
            const value = values[i]
            if (typeof value.then === 'function') {
                value.then(res => {
                    processResultByKey(res, i)
                }, e => {
                    reject(e)
                })
            } else {
                processResultByKey(value, i)
            }
        }
    })
}

Promise.race = function (values) { 
    if (!Array.isArray(values)) {
        throw new Error('请传入数组作为参数')
        return
    }

    return new Promise((resolve, reject) => {
        for(let i=0; i<values.length; i++) {
            const value = values[i]
            if(value.then) {
                values.then(res => {
                    resolve(res)
                }, e => {
                    reject(e)
                })
            }else {
                resolve(value)
            }
        }
    })
}


const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('成功');
    }, 1000);
}).then(
    (data) => {
        console.log('success', data)
    },
    (err) => {
        console.log('faild', err)
    }
)
