import program from 'commander'
import path from 'path'
import { run } from './cli'
import plugin from './plugin'

export * as hooks from './hooks'
export * as utils from './utils'
export * as services from './services'
export * as stores from './stores'
export * as jobs from './jobs'
export * as tasks from './tasks'
export * from './cli'

export default plugin

function cli () {
  program
    .version(require('../package.json').version)
    .usage('<jobfile> [options]')
    .option('-d, --debug', 'Verbose output for debugging')
    .option('-P, --proxy [proxy]', 'Proxy to be used for HTTP (and HTTPS)')
    .option('-PS, --proxy-https [proxy-https]', 'Proxy to be used for HTTPS')
    .option('-u, --user [user]', 'User name to be used for authentication')
    .option('-p, --password [password]', 'User password to be used for authentication')
    .parse(process.argv)

  run(path.join(process.cwd(), program.args[0]), program)
}

if (require.main === module) {
  cli()
}
