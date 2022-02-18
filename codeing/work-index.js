function EventWork(url) {
    this.woker = new Worker(url)
}

EventWork.prototype.emit = function(name, data) {
    this.woker.postMessage({ name, data })
}

EventWork.prototype.onmessage = function() {
    return new Promise((resolve, reject) => {
        this.woker.onmessage = function (e) {
            resolve(e.data)
        }
    })
}

const woker = new EventWork('./work.js')

woker.emit('calculate', 2000)

woker.onmessage().then(res => {
    console.log(res)
})






