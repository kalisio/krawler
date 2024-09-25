import program from 'commander'
import { healthcheck } from './lib/index.js'

program
  .usage('[options]')
  .allowUnknownOption()
  .option('-a, --api', 'Setup as web app by exposing an API')
  .option('-ap, --api-prefix [prefix]', 'When exposed as an API change the prefix (defaults to /api)', '/api')
  .option('-po, --port [port]', 'Change the port to be used (defaults to 3030)', process.env.PORT ? Number(process.env.PORT) : 3030)
  .option('-sr, --success-rate [rate]', 'Change the success rate for fault-tolerant jobs to be considered as successful (defaults to 1)', process.env.SUCCESS_RATE ? Number(process.env.SUCCESS_RATE) : 1)
  .option('-md, --max-duration [duration]', 'Change the maximum run duration in seconds for fault-tolerant jobs to be considered as failed (defaults to unset)', process.env.MAX_DURATION ? Number(process.env.MAX_DURATION) : -1)
  .option('-nsj, --nb-skipped-jobs [nb]', 'Change the number of skipped runs for fault-tolerant jobs to be considered as failed (defaults to 3)', process.env.NB_SKIPPED_JOBS ? Number(process.env.NB_SKIPPED_JOBS) : 3)
  .option('-sw, --slack-webhook [url]', 'Slack webhook URL to post messages on failure', process.env.SLACK_WEBHOOK_URL)
  .option('-mt, --message-template [template]', 'Message template used on failure', process.env.MESSAGE_TEMPLATE || 'Job <%= jobId %>: <%= error.message %>')
  .option('-lt, --link-template [template]', 'Link template used on failure', process.env.LINK_TEMPLATE || '')
  .option('-d, --debug', 'Verbose output for debugging')
  .parse(process.argv)

try {
  await healthcheck(program)
  process.exit(0)
} catch (error) {
  // Healthcheck is already writing to stderr
  // console.error(error)
  process.exit(1)
}
