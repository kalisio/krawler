const request = require('request')
const program = require('commander')
const utils = require('util')
const _ = require('lodash')

program
    .usage('[options]')
    .option('-a, --api', 'Setup as web app by exposing an API')
    .option('-ap, --api-prefix [prefix]', 'When exposed as an API change the prefix (defaults to /api)', '/api')
    .option('-po, --port [port]', 'Change the port to be used (defaults to 3030)', 3030)
    .option('-sr, --success-rate [rate]', 'Change the success rate for fault-tolerant jobs to be considered as successful (defaults to 1)', 1)
    .option('-sj, --nb-skipped-jobs [nb]', 'Change the number of skipped runs for fault-tolerant jobs to be considered as failed (defaults to 3)', 3)
    .option('-sw, --slack-webhook [url]', 'Slack webhook URL to post messages on failure', process.env.SLACK_WEBHOOK_URL)
    .option('-t, --template [template]', 'Message template used on failure', 'Healthcheck failed for job <%= jobId %>: <%= error.message %>')
    .option('-d, --debug', 'Verbose output for debugging')
    .parse(process.argv)

function publishToConsole (message) {
	if (!program.debug) return
	console.log(message)
}

async function publishToSlack (message) {
	if (!program.slackWebhook) return
	await utils.promisify(request.post)({
		url: program.slackWebhook,
		body: JSON.stringify({ text: message })
	})
}

async function healthcheck () {
	const endpoint = `http://localhost:${program.port}${program.api ? program.apiPrefix : ''}/healthcheck`
	try {
		const compiler = _.template(program.template)
		const response = await utils.promisify(request.get)(endpoint)
		let data = JSON.parse(response.body)
		if (program.debug) console.log('Healthcheck output', data)
		Object.assign(data, process.env)
		if (response.statusCode == 200) {
			// Fault-tolerant jobs always return 200, we use more criteria to check for health status
			if (_.has(data, 'successRate') && (data.successRate < program.successRate)) {
				data.error = new Error(`Insufficient success rate (${data.successRate})`)
			}
			if (data.nbSkippedJobs >= program.nbSkippedJobs) {
				data.error = new Error(`Too much skipped jobs (${data.nbSkippedJobs})`)
			}
    }
    if (data.error) {
    	publishToConsole(compiler(data))
    	await publishToSlack(compiler(data))
    	process.exit(1)
    } else {
    	process.exit(0)
    }
	} catch (error) {
		data.error = error
		publishToConsole(compiler(data))
    await publishToSlack(compiler(data))
		process.exit(1)
	}
}

healthcheck()
