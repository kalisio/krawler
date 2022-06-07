import program from 'commander'
import { healthcheck } from './lib/index.js'

program
  .usage('[options]')
  .allowUnknownOption()
  .option('-a, --api', 'Setup as web app by exposing an API')
  .option('-ap, --api-prefix [prefix]', 'When exposed as an API change the prefix (defaults to /api)', '/api')
  .option('-po, --port [port]', 'Change the port to be used (defaults to 3030)', 3030)
  .option('-sr, --success-rate [rate]', 'Change the success rate for fault-tolerant jobs to be considered as successful (defaults to 1)', 1)
  .option('-md, --max-duration [duration]', 'Change the maximum run duration in seconds for fault-tolerant jobs to be considered as failed (defaults to unset)', -1)
  .option('-nsj, --nb-skipped-jobs [nb]', 'Change the number of skipped runs for fault-tolerant jobs to be considered as failed (defaults to 3)', 3)
  .option('-sw, --slack-webhook [url]', 'Slack webhook URL to post messages on failure', process.env.SLACK_WEBHOOK_URL)
  .option('-mt, --message-template [template]', 'Message template used on failure', 'Job <%= jobId %>: <%= error.message %>')
  .option('-lt, --link-template [template]', 'Link template used on failure', '')
  .option('-d, --debug', 'Verbose output for debugging')
  .parse(process.argv)

try {
  await healthcheck(program)
  process.exit(0)
} catch (error) {
  process.exit(1)
}
