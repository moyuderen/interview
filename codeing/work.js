
let result = 0

onmessage = function(e) {
    const { data: eventData } = e
    const { name, data } = eventData
    const event = Event[name] 
    
    if(event) {
       event(data)
    }else {
        console.warn('未找到该方法')
    }
}

class Event {
    static calculate(data) {
        const ret = data * 3
        postMessage(ret)
    }   
}
