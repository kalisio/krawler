class Service {
  constructor (options = {}) {
    this.generators = {}
  }

  registerGenerator (type, generator) {
    this.generators[type] = generator
  }

  unregisterGenerator (type) {
    delete this.generators[type]
  }

  generate (type, options) {
    let generator = this.generators[type]
    if (!generator) return null
    else return generator(options)
  }
}

export default Service
