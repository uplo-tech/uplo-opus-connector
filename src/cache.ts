class MemCache {
  cacheData
  constructor() {
    this.cacheData = {}
  }

  get = key => {
    if (this.cacheData.hasOwnProperty(key) && this.cacheData[key].val) {
      return this.cacheData[key].val
    }
    return false
  }

  set = (key, value, expiry?: any) => {
    this.clear(key)

    let to: any = false
    if (expiry && parseInt(expiry) > 0) {
      to = setTimeout(() => {
        this.clear(key)
      }, parseInt(expiry))
    }

    this.cacheData[key] = {
      expiry,
      val: value,
      timeout: to
    }
  }

  clear = key => {
    if (this.cacheData.hasOwnProperty(key)) {
      if (this.cacheData[key].to) {
        clearTimeout(this.cacheData[key].to)
      }

      delete this.cacheData[key]
      return true
    }

    return false
  }
}

const newMemCache = new MemCache()

export default newMemCache
