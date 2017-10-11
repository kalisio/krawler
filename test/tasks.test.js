import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import feathers from 'feathers'
import path from 'path'
import store from 'fs-blob-store'
import plugin from '../src'

describe('krawler:tasks', () => {
  let app, tasksService

  before(() => {
    chailint(chai, util)
    app = feathers()
    app.configure(plugin)
  })

  it('creates the tasks service', () => {
    app.use('tasks', plugin.tasks({
      Model: store(path.join(__dirname, './data'))
    }))
    tasksService = app.service('tasks')
    expect(tasksService).toExist()
  })

})
