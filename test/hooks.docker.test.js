import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import path from 'path'
import fsStore from 'fs-blob-store'
import fs from 'fs'
import os from 'os'
import { hooks as pluginHooks } from '../src'

describe('krawler:hooks:docker', () => {
  const inputStore = fsStore({ path: path.join(__dirname, 'data') })
  const outputStore = fsStore({ path: path.join(__dirname, 'output') })

  before(async () => {
    chailint(chai, util)
  })

  const dockerOptions = {
    // Windows socket path: //./pipe/docker_engine ( Windows 10 )
    // Linux & Darwin socket path: /var/run/docker.sock
    socketPath: (os.type() === 'Windows_NT' ? '//./pipe/docker_engine' : '/var/run/docker.sock')
    // host: 'localhost',
    // port: 2375
  }

  const dockerHook = {
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
      files: ['<%= id %>.png']
    })(dockerHook)
      .then(hook => {
        expect(fs.existsSync(path.join(outputStore.path, 'krawler-icon-in.tar'))).beTrue()
      })
  })
  // Let enough time to proceed
    .timeout(5000)

  it('connect to docker', () => {
    return pluginHooks.connectDocker(dockerOptions)(dockerHook)
      .then(hook => {
        expect(hook.data.client).toExist()
      })
  })
  // Let enough time to proceed, pull image on first run
    .timeout(5000)

  it('connect to docker again', async () => {
    const result = await pluginHooks.connectDocker(dockerOptions)(dockerHook).then(ok => ok, no => no)
    expect(result).to.be.equal(dockerHook)
  })

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
      arguments: [path.join(outputStore.path, '<%= id %>-in.tar'), { path: '/tmp' }]
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
        Cmd: ['convert', '/tmp/<%= id %>.png', '/tmp/<%= id %>.jpg'],
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
    .timeout(20000)

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

  it('disconnect from docker again', async () => {
    const result = await pluginHooks.disconnectDocker()(dockerHook).then(ok => ok, no => no)
    expect(result).to.be.equal(dockerHook)
  })

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
