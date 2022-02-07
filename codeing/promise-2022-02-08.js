// new Promise((resolve, reject) => {
// resolve(1)
// reject(err)
// }).then(res => {

// }, err => {

// }).catch(res => {

// })

const Pending = 'pending'
const Fulfilled = 'fulfilled'
const Reject = 'rejecr'
class Promise {
    constructor(executor) {
        this.status = Pending
        this.value = undefined
        this.reason = undefined

        this.onFulfilledCallbacks = []
        this.onRejectCallBacks = []

        const resolve = (value) => {
            if (value instanceof Promise) {
                return value.then(resolve, reject)
            }
            if (this.status === Pending) {
                this.status = Fulfilled
                this.value = value
                // 
                this.onFulfilledCallbacks.forEach(fn => {
                    fn()
                });
            }
        }

        const reject = (reason) => {
            if (this.status === Pending) {
                this.status = Reject
                this.reason = reason

                this.onRejectCallBacks.forEach(fn => {
                    fn()
                })
            }
        }

        try {
            executor(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }

    then(onFulfilled, onReject) {
        onFulfilled = onFulfilled || (v => v)
        onReject = onReject || (r => r)

        let promise2 = new Promise((resolve, reject) => {
            if (this.status === Fulfilled) {
                const value = onFulfilled(this.value)
                try {
                    reslovePromise(promise2, value, resolve, reject)
                } catch {
                    reject()
                }
            }

            if (this.status === Reject) {
                const reason = onReject(this.reason)
                try {
                    reslovePromise(promise2, reason, resolve, reject)
                } catch {
                    reject()
                }
            }

            if (this.status === Pending) {
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        const value = onFulfilled(this.value)
                        try {
                            reslovePromise(promise2, value, resolve, reject)
                        } catch {
                            reject()
                        }
                    });
                })
                this.onRejectCallBacks.push(() => {
                    setTimeout(() => {
                        const reason = onReject(this.reason)
                        try {
                            reslovePromise(promise2, reason, resolve, reject)
                        } catch {
                            reject()
                        }
                    });
                })
            }
        })
        return promise2
    }

    static resolve(data) {
        return new Promise((resolve) => {
            resolve(data)
        })
    }

    static reject(err) {
        return new Promise((resolve, reject) => {
            reject(err)
        })
    }
}

// Promise.resolve()

function reslovePromise(promise2, x, resolve, reject) {
    let called = false
    if (promise2 === x) {
        reject()
    }

    if (typeof x === 'object' && x !== null) {
        try {
            let then = x.then
            // 是promise对象
            if (then) {
                then.call(x, (v) => {
                    if (called) {
                        return
                    }

                    resolve(v)
                    called = true
                }, (r) => {
                    if (called) {
                        return
                    }

                    reject(r)
                    called = true
                })
            } else {
                !called && resolve(x)
                called = true
            }
        } catch {
            reject()
        }
    } else {
        resolve(x)
        called = true
    }
}

// Promise.all([p1, p2, p3]).then(args => {
//     console.log(args)
// })
Promise.all = function (promiseArray) {
    return new Promise((resolve, reject) => {
        const len = promiseArray.length
        const count = 0
        let result = new Array(len)

        const resolveResult = (res, index) => {
            count++
            result[index] = res
            if (count === len) {
                resolve(result)
            }
        }

        promiseArray.forEach((p, index) => {
            if (p instanceof Promise) {
                p.then((res) => {
                    resolveResult(res, index)
                }, (err) => {
                    reject(err)
                })
            } else {
                resolveResult(p, index)
            }
        })
    })
}

// Promise.race([p1, p2, p3]).then()
Promise.race = function(promiseArray) {
    return new Promise((resolve, reject) => {
        promiseArray.forEach(p => {
            if(p instanceof Promise) {
                p.then(resolve, reject)
            }else {
                resolve(p)
            }
        })
    })
}

// promise没法取消

function withAbort(promise) {
    let reject
    let newPromise =  new Promise((resolve, reject) => {
        reject = reject
    })
    const p = Promise.race[promise, newPromise]
    p.reject = reject
    return p
}

const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('成功111');
    }, 1000);
}).then(
    (data) => {
        console.log('success', data)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(7777)
            }, 3000);
        })
    },
    (err) => {
        console.log('faild', err)
    }
).then(res => {
    console.log(res)
})