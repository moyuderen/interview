---
title: 'vue3.x'
navbar: true
description: 'vue3.x'
tags: ['框架', 'vue', 'vue3.x']
---

## function-api

```js

setup(props, context) {
    const count = value(0)
    
    count.value ++

    onMounted(() => {

    })

    onBeforeDestroy(() => {

    })

    watch(() => {
        count.value
    }, () => {
        // todo
    }, {
        deep: true
    })
    return {
        count
    }
}
```

## vue3

### 优势

**架构优势**

1. vue3 使用了 ts，更好的类型推断
2. vue3 使用了 tree-shaking, 使用到的代码才打包，减少打包体积

> monorepo 管理项目

**原理优势**

1. proxy 代理了对象，并不是递归所有属性监听收集，代理对象是懒递归（获取的时候才能递归）；而 vue2 使用的 defineProortty 递归，性能问题
2. 对数组更好的支持，不需要重写数组的方法了
3. 标记静态标记；编译时生成了 block tree,对子节点的动态节点进行收集，可以减少比较，使用 Pachflage 标记动态节点
4. 组合式（hooks 抽离），避免功能代码书写的上下反复横跳
5. 代码的高度抽离，代码的复用性大大提高，可以替代 mxin（存在命名属性点的冲突，数据来源不清楚）
6. fragment(多个根节点), teleport, suspense 组件

### 响应式原理

主要的方法 `reactive`,`ref` `effect`

#### reactive

```js
// reactive
export const reactiveMap = new WeakMap<Target, any>()

export function reactive(target: object) {
  // if trying to observe a readonly proxy, return the readonly version.
  // NOTE: readonly 暂时不看
  if (target && (target as Target)[ReactiveFlags.IS_READONLY]) {
    return target
  }
  // 创建一个响应式对象，
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  )
}

// NOTE: reactive, readonly, shallowReactive, shallowReadonly,公用方法； 这里只看reactives
function createReactiveObject(
  target: Target, // 原来的对象
  isReadonly: boolean, // 是否可读
  baseHandlers: ProxyHandler<any>, // object, array 类型的配置项
  collectionHandlers: ProxyHandler<any>, // Map, WeakMap, Set, WeakSet的配置项
  proxyMap: WeakMap<Target, any> // 一个weakmap实例
) {
    // 不是对象就直接返回
  if (!isObject(target)) {
    if (__DEV__) {
      console.warn(`value cannot be made reactive: ${String(target)}`)
    }
    return target
  }
  // target is already a Proxy, return it.
  // exception: calling readonly() on a reactive object
  // 如果是要代理的原对象是已经代理的对象，直接返回
  // 解决： const proxy = reactive({name: 'moyuderen'})
  // const proxy1 = reactive(proxy)
  if (
    target[ReactiveFlags.RAW] &&
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
  ) {
    return target
  }

  // target already has corresponding Proxy
  // 已经代理过的对象，直接返回代理过的对象
  // 解决：多次创建的问题 
  // const proxy = reactive({name: 'moyuderen'})
  // const proxy1 = reactive({name: 'moyuderen'}) // 返回的其实是同一个代理对象
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }
  // only a whitelist of value types can be observed.
  // 做的一些特殊处理，暂时不关注
  const targetType = getTargetType(target)
  if (targetType === TargetType.INVALID) {
    return target
  
  // 核心代码，代理一个proxy对象
    //   const enum TargetType {
    //     INVALID = 0,
    //     COMMON = 1,
    //     COLLECTION = 2
    //     }
  // function targetTypeMap(rawType: string) {
  //   switch (rawType) {
  //     case 'Object':
  //     case 'Array':
  //       return TargetType.COMMON
  //     case 'Map':
  //     case 'Set':
  //     case 'WeakMap':
  //     case 'WeakSet':
  //       return TargetType.COLLECTION
  //     default:
  //       return TargetType.INVALID
  //   }
  // }
  const proxy = new Proxy(
    target,
    // baseHandlers 针对的是Object, Array类型; collectionHandlers针对的是Map, Set, WeakMap, WeakSet
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
  )
  proxyMap.set(target, proxy)
  return proxy
}

```

```js
// baseHandlers
const get = /*#__PURE__*/ createGetter()
const set = /*#__PURE__*/ createSetter()

function createGetter(isReadonly = false, shallow = false) {
  return function get(target: Target, key: string | symbol, receiver: object) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (
      key === ReactiveFlags.RAW &&
      receiver ===
        (isReadonly
          ? shallow
            ? shallowReadonlyMap
            : readonlyMap
          : shallow
            ? shallowReactiveMap
            : reactiveMap
        ).get(target)
    ) {
      return target
    }

    const targetIsArray = isArray(target)

    if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver)
    }

    const res = Reflect.get(target, key, receiver)

    if (
      isSymbol(key)
        ? builtInSymbols.has(key as symbol)
        : isNonTrackableKeys(key)
    ) {
      return res
    }

    if (!isReadonly) {
        // 依赖收集
      track(target, TrackOpTypes.GET, key)
    }

    if (shallow) {
      return res
    }

    if (isRef(res)) {
      // ref unwrapping - does not apply for Array + integer key.
      const shouldUnwrap = !targetIsArray || !isIntegerKey(key)
      return shouldUnwrap ? res.value : res
    }

    if (isObject(res)) {
      // Convert returned value into a proxy as well. we do the isObject check
      // here to avoid invalid value warning. Also need to lazy access readonly
      // and reactive here to avoid circular dependency.
      // 递归，懒递归获取到的属性是对象是才是做代理，与vue2不同的是，vue2是一上来就遍历了所有属性递归
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}

function createSetter(shallow = false) {
  return function set(
    target: object,
    key: string | symbol,
    value: unknown,
    receiver: object
  ): boolean {
    let oldValue = (target as any)[key]
    if (!shallow) {
      value = toRaw(value)
      oldValue = toRaw(oldValue)
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value
        return true
      }
    } else {
      // in shallow mode, objects are set as-is regardless of reactive or not
    }

    // 判断是新增还是修改
    const hadKey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwn(target, key)

    const result = Reflect.set(target, key, value, receiver)
    // don't trigger if target is something up in the prototype chain of original
    // 数组新增值，index,和length都改变，会触发两次，区分是新增还是修改来避免触发多次
    if (target === toRaw(receiver)) {
      if (!hadKey) {
          // 新增，出发更新
        trigger(target, TriggerOpTypes.ADD, key, value)
      } else if (hasChanged(value, oldValue)) {
          // 修改，触发更新
        trigger(target, TriggerOpTypes.SET, key, value, oldValue)
      }
    }
    return result
  }
}

// reactive 配置项 mutableHandlers
export const mutableHandlers: ProxyHandler<object> = {
  get,
  set,
  deleteProperty, // 暂时不关注
  has, // 暂时不关注
  ownKeys // 暂时不关注
}

```

#### effect

```js
// effect
// const proxy = reactive({ name: 'moyuderen' })
// effect(() => { console.log(proxy.name) })
// setTimeout(() => {
//     proxy.name = 'wo bu shi mo yu deren'
// })

export function effect<T = any>(
  fn: () => T, // 入参是个函数
  options: ReactiveEffectOptions = EMPTY_OBJ
): ReactiveEffect<T> {
  if (isEffect(fn)) { // 是个effect函数
    fn = fn.raw
  }
  const effect = createReactiveEffect(fn, options)
  if (!options.lazy) { // 是否已开始就去触发effect函数
    effect()
  }
  return effect
}

const effectStack: ReactiveEffect[] = []
let activeEffect: ReactiveEffect | undefined
let uid = 0

// 创建响应式的effect函数
function createReactiveEffect<T = any>(
  fn: () => T,
  options: ReactiveEffectOptions
): ReactiveEffect<T> {
  const effect = function reactiveEffect(): unknown {
    if (!effect.active) { // 暂时不关注
      return options.scheduler ? undefined : fn()
    }
    // effectStack
    // effect(() => { // effect1, effectStack.push(effect1), [effect1]
    //     console.log(proxy.name)
    //     effect(() => { // effect2, effectStack.push(effect2), [effect1,effect2]
    //         console.log(proxy.age) // 函数执行完毕  effectStack.pop(),  [effect1]
    //     })
    //     console.log(proxy.sex) // [effect1]
    // }) // 函数执行完毕  effectStack.pop(),  []
    if (!effectStack.includes(effect)) {
      cleanup(effect)
      try {
        enableTracking()
        effectStack.push(effect)
        activeEffect = effect
        return fn()
      } finally {
        effectStack.pop()
        resetTracking()
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  } as ReactiveEffect
  effect.id = uid++
  effect.allowRecurse = !!options.allowRecurse
  effect._isEffect = true
  effect.active = true
  effect.raw = fn // 原函数参数
  effect.deps = [] // 依赖的属性; 是包含多个Set实例数组
  effect.options = options
  return effect
}

type Dep = Set<ReactiveEffect>
type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

// 收集依赖 在触发代理的get方法是进行依赖收集
export function track(
    target: object, // 原对象
    type: TrackOpTypes, // 类型 比如get
    key: unknown) // 属性
{
  if (!shouldTrack || activeEffect === undefined) {
    return
  }

    // targetMap 数据结构
    // {
    //     {name: 'moyuderen'}: {
    //         name: Set(...),
    //         age: Set(...)
    //     }
    // }

  let depsMap = targetMap.get(target)
  if (!depsMap) { // 第一次获取必然没有，添加
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key) // dep: new Set()
  if (!dep) { // 属性上没有收集到effect
    // 用Set的原因, 通过已属性多次收集去重
    // effect(() => { 
    //     console.log(proxy.name)
    //     console.log(proxy.name)
    //     console.log(proxy.name)
    // })
    depsMap.set(key, (dep = new Set())) 
  }

  // 关联对象，属性和effect
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
    if (__DEV__ && activeEffect.options.onTrack) {
      activeEffect.options.onTrack({
        effect: activeEffect,
        target,
        type,
        key
      })
    }
  }
}

// 触发更新
export function trigger(
  target: object, // 原对象
  type: TriggerOpTypes,// set修改，add新增
  key?: unknown, // 对象的key
  newValue?: unknown, // 新的值
  oldValue?: unknown, // 旧的值
  oldTarget?: Map<unknown, unknown> | Set<unknown>
) {
  const depsMap = targetMap.get(target)

  if (!depsMap) { // 如果在该对象上没获取的属性对应的effect说明没有进行依赖收集，则不执行
    // never been tracked
    return
  }

    // setTimeout(() => {
    //     // 多次设置一样的值，去重effect
    //     proxy.name = 'hah'
    //     proxy.name = 'hah'
    //     proxy.name = 'hah'
    // })
  const effects = new Set<ReactiveEffect>() // 去重
  const add = (effectsToAdd: Set<ReactiveEffect> | undefined) => {
    if (effectsToAdd) {
      effectsToAdd.forEach(effect => {
        if (effect !== activeEffect || effect.allowRecurse) {
          effects.add(effect)
        }
      })
    }
  }

  if (type === TriggerOpTypes.CLEAR) { // 暂时不关注删除操作
    // collection being cleared
    // trigger all effects for target
    depsMap.forEach(add)
  } else if (key === 'length' && isArray(target)) { // 操作的数组 length属性，数组的修改操作

    // const proxy = reactive({ address: [1,2,3]})
    // effect(() => {
    //     proxy.address.push(100) // 触发依赖收集, 并且是新增key 3, 为100, 然后length改变为4; 走的是set中的新增操作 // new index added to array -> length changes
    // })
    // proxy.length = 1 // 

    // depsMap的结构
    // {
    //      0：[effect1],
    //      1：[effect3],
    //      2: [effect4]
    //      length: [effect2]
    // }

    // dep [effect3, effect4]
    depsMap.forEach((dep, key) => {  
        // newValue是新数组的长度
        // key === 'length' 直接操作了length
        // key数组的key, 如果是数组的length直接变小了，key >= (newValue as number)；删除的key需要触发effect
      if (key === 'length' || key >= (newValue as number)) { 
        //1. 直接修改了Length,但是并没有对length进行收集,需要去主动把dep添加到effects中等待执行
        // effect(() => {
        //     proxy.address
        // })
        // proxy.length = 1 

        // 2. 直接修改了

        add(dep) // 主动添加
      }
    })
  } else {
    // schedule runs for SET | ADD | DELETE
    if (key !== void 0) {
      add(depsMap.get(key))
    }

    // also run for iteration key on ADD | DELETE | Map.SET
    switch (type) {
      case TriggerOpTypes.ADD:
        if (!isArray(target)) {
          add(depsMap.get(ITERATE_KEY))
          if (isMap(target)) {
            add(depsMap.get(MAP_KEY_ITERATE_KEY))
          }
        } else if (isIntegerKey(key)) {
          // new index added to array -> length changes
          add(depsMap.get('length'))
        }
        break
      case TriggerOpTypes.DELETE:
        if (!isArray(target)) {
          add(depsMap.get(ITERATE_KEY))
          if (isMap(target)) {
            add(depsMap.get(MAP_KEY_ITERATE_KEY))
          }
        }
        break
      case TriggerOpTypes.SET:
        if (isMap(target)) {
          add(depsMap.get(ITERATE_KEY))
        }
        break
    }
  }

  const run = (effect: ReactiveEffect) => {
    if (__DEV__ && effect.options.onTrigger) {
      effect.options.onTrigger({
        effect,
        target,
        key,
        type,
        newValue,
        oldValue,
        oldTarget
      })
    }
    if (effect.options.scheduler) {
      effect.options.scheduler(effect)
    } else {
      effect()
    }
  }

  effects.forEach(run)
}

```

#### ref

```js
// ref.js

export function ref(value?: unknown) {
  return createRef(value)
}

function createRef(rawValue: unknown, shallow = false) {
    // 是ref过的值直接返回
    if (isRef(rawValue)) {
        return rawValue
    }
    // 否则创建一个实现来生成ref对象，来做响应式
    return new RefImpl(rawValue, shallow)
}

const convert = <T extends unknown>(val: T): T =>
  isObject(val) ? reactive(val) : val

class RefImpl<T> {
    private _value: T

    public readonly __v_isRef = true

    constructor(private _rawValue: T, public readonly _shallow = false) {
        this._value = _shallow ? _rawValue : convert(_rawValue) // 默认都是深的
    }

    // get方法，就是为啥使用ref的时候，要用ref1.value = 1
    get value() {
        // 依赖收集
        track(toRaw(this), TrackOpTypes.GET, 'value')
        return this._value
    }

    // set方法，就是为啥使用ref的时候，要用ref1.value = 1
    set value(newVal) {
        if (hasChanged(toRaw(newVal), this._rawValue)) { // 值更新时才触发
            this._rawValue = newVal
            this._value = this._shallow ? newVal : convert(newVal)
            // 触发更新
            trigger(toRaw(this), TriggerOpTypes.SET, 'value', newVal)
        }
    }
}
```

## monorepo

lerna 管理多个包的版本
