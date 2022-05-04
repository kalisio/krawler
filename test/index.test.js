import chai from 'chai'
import chailint from 'chai-lint'
import feathers from '@feathersjs/feathers'
import plugin from '../lib/index.js'

const { util, expect } = chai

describe('krawler', () => {
  let app

  before(() => {
    chailint(chai, util)
    app = feathers()
  })

  it('is CommonJS compatible', () => {
    expect(typeof plugin).to.equal('function')
    expect(typeof plugin.stores).to.equal('function')
    expect(typeof plugin.stores.Service).to.equal('function')
    expect(typeof plugin.tasks).to.equal('function')
    expect(typeof plugin.tasks.Service).to.equal('function')
    expect(typeof plugin.jobs).to.equal('function')
    expect(typeof plugin.jobs.Service).to.equal('function')
  })

  it('registers the plugin', () => {
    app.configure(plugin)
  })
})
