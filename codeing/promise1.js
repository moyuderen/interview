
// new Promise((resolve, reject) => {
//     resolve()
//     reject()
// }).then(res => {
//     console.log(res)
// }, err => {
//     console.log(err)
// })
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

function Promise(executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined

    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []

    let resolve = (value) => {
        if(this.status === PENDING) {
            this.status = FULFILLED
            this.value = value
            this.onResolvedCallbacks.forEach(fn => fn())
        }
    }

    let reject = (reason) => {
        if(this.status === PENDING) {
            this.status = REJECTED
            this.reason = reason
            this.onRejectedCallbacks.forEach(fn => fn())
        }
    }

    try {
        executor(resolve, reject)
    } catch(err) {
        reject(err)
    }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
    onRejected = typeof onRejected === 'function' ? onRejected : v => v

    let promise2 = new Promise((resolve, reject) => {
        if (this.status === FULFILLED) {
            setTimeout(() => {
                try {
                    let x = onFulfilled(this.value)
                    resolvePromise(promise2, x, resolve, reject)
                } catch(e) {
                    reject(e)
                }
            }, 0)
        }

        if (this, status === REJECTED) {
            setTimeout(() => {
                try {
                    let x = onRejected(this.value)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            }, 0)
        }

        if (this.status === PENDING) {
            setTimeout(() => {
                this.onResolvedCallbacks.push(() => {
                    try {
                        let x = onRejected(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            }, 0)

            setTimeout(() => {
                this.onRejectedCallbacks.push(() => {
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            }, 0)
        }
    })

    return promise2
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject('循环引用')
    }

    let called = false

    if((typeof x === 'object' && x !== null) || typeof x === 'function') {
        try {
            let then = x.then
            if(typeof then === 'function') {
                then.call(x, (res) => {
                    if(called) return
                    called = true
                    resolvePromise(promise2, y, resolve, reject)
                }, (err) => {
                    if (called) return
                    called = true
                    reject(err)
                })
            }else {
                resolve(x)
            }
        } catch(e) {
            if(called) {
                return
            }
            called = true
            reject(e)
        }
    } else {
        resolve(x)
    }
}
Promise.prototype.resolve = function(data) {
    return new Promise((resolve, reject) => {
        resolve(data)
    })
}

Promise.prototype.reject = function (err) {
    return new Promise((resolve, reject) => {
        reject(err)
    })
}

Promise.prototype.catch = function (errCallback) {
    return this.then(null, errCallback)
}

Promise.prototype.finally = function(callback) {
    return this.then(res => {
        return Promise.resolve(callback).then(() => res)
    }, err => {
        return Promise.reject(callback).then(() => { throw err})
    })
}

Promise.prototype.all = function(promises) {
    let len = promises.length
    let count = 0
    let results = []

    return new Promise((resolve, reject) => {
        let resoveResult = function(value, i) {
            results[i] = value
            count++
            if (count === len) {
                resolve(results)
            }
        }

        for(let i=0; i<len; i++) {
            if (promises[i].then) {
                promises[i].then(value => {
                    resoveResult(value, i)
                }, err => {
                    reject(err)
                })
            } else {
                resoveResult(value, i)
            }
        }
    })
}
 
Promise.prototype.race = function(promises) {
    return new Promise((resolve, reject) => {
        for(let i=0; i<promises.length; i++) {
            if (promises[i].then && typeof promises[i].then === 'function') {
                promises[i].then(res => {
                    resolve(res)
                }, err => {
                    reject(err)
                })
            } else {
                resolve(promises[i])
            }
        }
    })
}


