var obj = {
    a: 1,
    b: {
        m: 1,
        n: 2,
        q: [3, 4],
    },
    c: [6, 7],
    d: new Date(),
    e: new RegExp(),
    f: new Map(),
    g: new Set(),
    h: undefined,
    i: null,
    j: Symbol('j'),
    k: function () {}
}


function isObject(val) {
    return typeof val === 'object' && val !== null
}

const targetMap = new Map()

function deepClone(target, targetMap) {
    if (!isObject(target)) {
        return target
    }
    // 解决特殊类型
    const Constructor = target.constructor
    if (target instanceof Constructor) {
        return new Constructor(target)
    }

    if(targetMap.get(target)) {
        return targetMap.get(target)
    }

    let result = Array.isArray(target) ? [] : {}

    targetMap.set(target, result)

    Reflect.ownKeys(target).forEach(key => {
        result[key] = deepClone(target[key], targetMap)
    })
    return result
}

console.log(deepClone(obj))
