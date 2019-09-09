import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import path from 'path'
import fsStore from 'fs-blob-store'
import fs from 'fs'
import { hooks as pluginHooks } from '../src'

describe('krawler:hooks:docker', () => {
  let inputStore = fsStore({ path: path.join(__dirname, 'data') })
  let outputStore = fsStore({ path: path.join(__dirname, 'output') })

  before(async () => {
    chailint(chai, util)
  })

  let dockerHook = {
    type: 'before',
    data: {
      id: 'krawler-icon'
    },
    params: { store: outputStore }
  }

  it('tar input file', () => {
    return pluginHooks.tar({
      cwd: inputStore.path,
      file: path.join(outputStore.path, '<%= id %>-in.tar'),
      files: [ '<%= id %>.png' ]
    })(dockerHook)
    .then(hook => {
      expect(fs.existsSync(path.join(outputStore.path, 'krawler-icon-in.tar'))).beTrue()
    })
  })
  // Let enough time to proceed
  .timeout(5000)

  it('connect to docker', () => {
    return pluginHooks.connectDocker({
      host: process.env.DOCKER_HOST || 'localhost',
      port: process.env.DOCKER_PORT || 2375
    })(dockerHook)
    .then(hook => {
      expect(hook.data.client).toExist()
    })
  })
  // Let enough time to proceed, pull image on first run
  .timeout(5000)

  it('create a container', () => {
    return pluginHooks.createDockerContainer({
      Image: 'v4tech/imagemagick',
      Cmd: ['/bin/sh'],
      AttachStdout: true,
      AttachStderr: true,
      Tty: true
    })(dockerHook)
    .then(hook => {
      expect(hook.data.container).toExist()
    })
  })
  // Let enough time to proceed, pull image on first run
  .timeout(5000)

  it('start a container', () => {
    return pluginHooks.runDockerContainerCommand({
      command: 'start'
    })(dockerHook)
    .then(hook => {
      expect(hook.data.container).toExist()
    })
  })
  // Let enough time to proceed
  .timeout(5000)

  it('copy to a container', () => {
    return pluginHooks.runDockerContainerCommand({
      command: 'putArchive',
      arguments: [ path.join(outputStore.path, '<%= id %>-in.tar'), { path: '/tmp' } ]
    })(dockerHook)
    .then(hook => {
      expect(hook.data.container).toExist()
    })
  })
  // Let enough time to proceed
  .timeout(5000)

  it('exec in a container', () => {
    return pluginHooks.runDockerContainerCommand({
      command: 'exec',
      arguments: {
        Cmd: [ 'convert', '/tmp/<%= id %>.png', '/tmp/<%= id %>.jpg' ],
        AttachStdout: true,
        AttachStderr: true,
        Tty: true
      }
    })(dockerHook)
    .then(hook => {
      expect(hook.data.container).toExist()
    })
  })
  // Let enough time to proceed
  .timeout(10000)

  it('copy from a container', () => {
    return pluginHooks.runDockerContainerCommand({
      command: 'getArchive',
      arguments: { path: '/tmp/.' }
    })(dockerHook)
    .then(hook => {
      expect(hook.data.container).toExist()
    })
  })
  // Let enough time to proceed
  .timeout(5000)

  it('stop a container', () => {
    return pluginHooks.runDockerContainerCommand({
      command: 'stop'
    })(dockerHook)
    .then(hook => {
      expect(hook.data.container).toExist()
    })
  })
  // Let enough time to proceed
  .timeout(20000)

  it('destroy a container', () => {
    return pluginHooks.runDockerContainerCommand({
      command: 'remove'
    })(dockerHook)
    .then(hook => {
      expect(hook.data.container).beUndefined()
    })
  })
  // Let enough time to proceed
  .timeout(5000)

  it('disconnect from docker', () => {
    dockerHook.type = 'after'
    dockerHook.result = dockerHook.data
    return pluginHooks.disconnectDocker()(dockerHook)
    .then(hook => {
      expect(hook.data.client).beUndefined()
    })
  })
  // Let enough time to proceed, pull image on first run
  .timeout(5000)

  it('untar output file', () => {
    return pluginHooks.untar({
      cwd: outputStore.path,
      file: path.join(outputStore.path, '<%= id %>.tar')
    })(dockerHook)
    .then(hook => {
      expect(fs.existsSync(path.join(outputStore.path, 'krawler-icon.jpg'))).beTrue()
    })
  })
  // Let enough time to proceed
  .timeout(5000)
})
