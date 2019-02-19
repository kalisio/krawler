import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import path from 'path'
import fsStore from 'fs-blob-store'
import fs from 'fs'
import { hooks as pluginHooks } from '../src'

describe('krawler:hooks:system', () => {
  let inputStore = fsStore({ path: path.join(__dirname, 'data') })
  let outputStore = fsStore({ path: path.join(__dirname, 'output') })

  before(async () => {
    chailint(chai, util)
  })

  let commandHook = {
    type: 'before',
    data: {
      id: 'command'
    },
    params: { store: outputStore }
  }

  it('run a command', () => {
    return pluginHooks.runCommand({
      command: 'echo <%= id %>',
      stdout: true
    })(commandHook)
    .then(hook => {
      expect(hook.data.stdout).toExist()
      expect(hook.data.stdout).to.include('command')
    })
  })
  // Let enough time to proceed
  .timeout(5000)

  it('raise error on command timeout', (done) => {
    pluginHooks.runCommand({
      command: 'pause',
      options: {
        timeout: 3000
      }
    })(commandHook)
    .catch(error => {
      expect(error).toExist()
      done()
    })
  })
  // Let enough time to proceed
  .timeout(5000)

  it('tar a file', () => {
    commandHook.data.id = 'krawler-icon'
    return pluginHooks.tar({
      cwd: inputStore.path,
      file: path.join(outputStore.path, '<%= id %>.tar'),
      files: [ '<%= id %>.png' ]
    })(commandHook)
    .then(hook => {
      expect(fs.existsSync(path.join(outputStore.path, 'krawler-icon.tar'))).beTrue()
    })
  })
  // Let enough time to proceed
  .timeout(5000)

  it('untar a file', () => {
    try {
      fs.mkdirSync(path.join(outputStore.path, 'untar'))
    } catch (error) {
      // If already exist
    }
    return pluginHooks.untar({
      cwd: path.join(outputStore.path, 'untar'),
      file: path.join(outputStore.path, '<%= id %>.tar')
    })(commandHook)
    .then(hook => {
      expect(fs.existsSync(path.join(outputStore.path, 'untar', 'krawler-icon.png'))).beTrue()
    })
  })
  // Let enough time to proceed
  .timeout(5000)
})
