var str = '(){}'

const SignMap =  {
    '(' : -1,
    ')' : 1,
    '[': -2,
    ']': 2,
    '{': -3,
    '}': 3
}

function check(str) {
    const arr = str.split('')
    let stack = []

    for(let i=0; i<arr.length; i++) {
        if(SignMap[arr[i]] < 0) {
            stack.push(arr[i])
        }else {
            const last = stack.pop()
            if(SignMap[last] + SignMap[arr[i]] !== 0) {
                return false
            }
        }
    }

    if(stack.length) {
        return false
    }

    return true
}


const Map1 = {
    '(': ')',
    '[': ']',
    '{': '}',
}

function check1(str) {
    const arr = str.split('')
    let stack = []

    for (let i = 0; i < arr.length; i++) {
        if (!Map1.has[arr[i]]) {
            stack.push(arr[i])
        } else {
            const last = stack.pop()
            if (Map1[last] === Map1[arr[i]]) {
                return false
            }
        }
    }

    if (stack.length) {
        return false
    }

    return true
}