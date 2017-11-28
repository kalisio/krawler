import _ from 'lodash'

class Service {
  constructor (generators = {}) {
    this.generators = {}
    _.forOwn(generators, (value, key) => {
      this.registerGenerator(key, value)
    })
  }

  registerGenerator (type, generator) {
    this.generators[type] = generator
  }

  unregisterGenerator (type) {
    delete this.generators[type]
  }

  async generate (type, ...options) {
    let generator = this.generators[type]
    if (!generator) return null
    else return generator.apply(this, options)
  }
}

export default Service
