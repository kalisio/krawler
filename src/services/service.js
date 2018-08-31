import _ from 'lodash'

class Service {
  constructor (generators = {}) {
    this.events = ['krawler']
    this.generators = {}
    _.forOwn(generators, (value, key) => {
      this.registerGenerator(key, value)
    })
  }

  setup (app, path) {
    this.on('krawler', (event) => app.emit('krawler', event))
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
