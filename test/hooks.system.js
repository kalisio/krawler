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

  it('tar a file', () => {
    commandHook.data.id = 'krawler-icon'
    return pluginHooks.tar({
      cwd: inputStore.path,
      file: path.join(outputStore.path, '<%= id %>-in.tar'),
      files: [ '<%= id %>.png' ]
    })(commandHook)
    .then(hook => {
      expect(hook.data.stdout).toExist()
      expect(hook.data.stdout).to.include('command')
    })
  })
  // Let enough time to proceed
  .timeout(5000)

  it('create a container', () => {
    return pluginHooks.createContainer({
      host: 'localhost',
      port: process.env.DOCKER_PORT || 2375,
      Image: 'v4tech/imagemagick',
      Cmd: ['/bin/sh'],
      AttachStdout: true,
      AttachStderr: true,
      Tty: true
    })(commandHook)
    .then(hook => {
      expect(hook.data.container).toExist()
    })
  })
  // Let enough time to proceed, pull image on first run
  .timeout(50000)

  it('start a container', () => {
    return pluginHooks.runContainerCommand({
      command: 'start'
    })(commandHook)
    .then(hook => {
      expect(hook.data.container).toExist()
    })
  })
  // Let enough time to proceed
  .timeout(5000)

  it('copy to a container', () => {
    return pluginHooks.runContainerCommand({
      command: 'putArchive',
      arguments: [ path.join(outputStore.path, '<%= id %>-in.tar'), { path: '/tmp' } ]
    })(commandHook)
    .then(hook => {
      expect(hook.data.container).toExist()
    })
  })
  // Let enough time to proceed
  .timeout(5000)

  it('exec in a container', () => {
    return pluginHooks.runContainerCommand({
      command: 'exec',
      arguments: {
        Cmd: [ 'convert', '/tmp/<%= id %>.png', '/tmp/<%= id %>.jpg' ],
        AttachStdout: true,
        AttachStderr: true,
        Tty: true
      }
    })(commandHook)
    .then(hook => {
      expect(hook.data.container).toExist()
    })
  })
  // Let enough time to proceed
  .timeout(10000)

  it('copy from a container', () => {
    return pluginHooks.runContainerCommand({
      command: 'getArchive',
      arguments: { path: '/tmp/.' }
    })(commandHook)
    .then(hook => {
      expect(hook.data.container).toExist()
    })
  })
  // Let enough time to proceed
  .timeout(5000)

  it('stop a container', () => {
    return pluginHooks.runContainerCommand({
      command: 'stop'
    })(commandHook)
    .then(hook => {
      expect(hook.data.container).toExist()
    })
  })
  // Let enough time to proceed
  .timeout(20000)

  it('destroy a container', () => {
    return pluginHooks.runContainerCommand({
      command: 'remove'
    })(commandHook)
    .then(hook => {
      expect(hook.data.container).beUndefined()
    })
  })
  // Let enough time to proceed
  .timeout(5000)

  it('untar a file', () => {
    return pluginHooks.untar({
      cwd: outputStore.path,
      file: path.join(outputStore.path, '<%= id %>.tar')
    })(commandHook)
    .then(hook => {
      expect(fs.existsSync(path.join(outputStore.path, 'krawler-icon.jpg'))).beTrue()
    })
  })
  // Let enough time to proceed
  .timeout(5000)
})
