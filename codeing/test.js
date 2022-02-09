Object.create(null)

function create(proto) {
    if(!Object.create !== 'function') {
        const Fn = function() {}
        Fn.prototype = proto
        return new Fn()
    }

    return Object.create(proto)
}
