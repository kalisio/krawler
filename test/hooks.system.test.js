import chai from 'chai'
import chailint from 'chai-lint'
import path, { dirname } from 'path'
import fsStore from 'fs-blob-store'
import fs from 'fs'
import { hooks as pluginHooks } from '../lib/index.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { util, expect } = chai

describe('krawler:hooks:system', () => {
  const inputStore = fsStore({ path: path.join(__dirname, 'data') })
  const outputStore = fsStore({ path: path.join(__dirname, 'output') })

  before(async () => {
    chailint(chai, util)
  })

  const commandHook = {
    type: 'before',
    data: {
      id: 'command'
    },
    params: { store: outputStore }
  }

  it('run a command', async () => {
    let hook = await pluginHooks.runCommand({
      command: 'echo <%= id %>',
      stdout: true
    })(commandHook)
    expect(hook.data.stdout).toExist()
    expect(hook.data.stdout).to.include('command')
    hook = await pluginHooks.runCommand({
      command: ['echo', '<%= id %>'],
      spawn: true, // Use spawn instead of exec
      options: {
        stdio: 'inherit'
      }
    })(commandHook)
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

  it('run multiple commands', async () => {
    let hook = await pluginHooks.runCommand({
      command: ['echo hello', 'echo <%= id %>'],
      stdout: true
    })(commandHook)
    expect(hook.data.stdout).toExist()
    expect(hook.data.stdout).to.include('hello')
    expect(hook.data.stdout).to.include('command')
    hook = await pluginHooks.runCommand({
      command: [['echo', 'hello'], ['echo', '<%= id %>']],
      spawn: true, // Use spawn instead of exec
      options: {
        stdio: 'inherit'
      }
    })(commandHook)
  })
  // Let enough time to proceed
    .timeout(5000)

  it('tar a file', () => {
    commandHook.data.id = 'krawler-icon'
    return pluginHooks.tar({
      cwd: inputStore.path,
      file: path.join(outputStore.path, '<%= id %>.tar'),
      files: ['<%= id %>.png']
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

  it('substitute env variables in text file', () => {
    try {
      fs.mkdirSync(path.join(outputStore.path, 'envsubst'))
    } catch (error) {
      // If already exist
    }
    return pluginHooks.envsubst({
      templateFile: path.join(inputStore.path, 'message.txt.tpl'),
      outputFile: path.join(outputStore.path, 'envsubst', 'message.txt'),
      envs: [
        { name: 'HELLO', value: 'hello' },
        { name: 'WORLD', value: 'world' }
      ]
    })(commandHook)
      .then(hook => {
        const filename = path.join(outputStore.path, 'envsubst', 'message.txt')
        expect(fs.existsSync(filename)).beTrue()
        const content = fs.readFileSync(filename, 'utf8')
        expect(content).to.equal('hello world')
      })
  })
  // Let enough time to proceed
    .timeout(5000)
})
