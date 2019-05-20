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
    .option('-nsj, --nb-skipped-jobs [nb]', 'Change the number of skipped runs for fault-tolerant jobs to be considered as failed (defaults to 3)', 3)
    .option('-sw, --slack-webhook [url]', 'Slack webhook URL to post messages on failure', process.env.SLACK_WEBHOOK_URL)
    .option('-mt, --message-template [template]', 'Message template used on failure', 'Job <%= jobId %>: <%= error.message %>')
    .option('-lt, --link-template [template]', 'Link template used on failure', '')
    .option('-d, --debug', 'Verbose output for debugging')
    .parse(process.argv)

function publishToConsole (message) {
	if (!program.debug) return
	console.log(message)
}

async function publishToSlack (message, link) {
	if (!program.slackWebhook) return
	try {
		let attachment = {
			title: message,
			color: 'danger'
		}
		if (link) {
			attachment.title_link = link
		}
		await utils.promisify(request.post)({
			url: program.slackWebhook,
			body: JSON.stringify({
				text: 'Healthcheck failed',
				attachments: [attachment]
			})
		})
	} catch (error) {
		console.error(error)
	}
}

async function healthcheck () {
	const endpoint = `http://localhost:${program.port}${program.api ? program.apiPrefix : ''}/healthcheck`
	const messageCompiler = _.template(program.messageTemplate)
	const linkCompiler = _.template(program.linkTemplate)
	try {
		const response = await utils.promisify(request.get)(endpoint)
		let data = JSON.parse(response.body)
		if (program.debug) console.log('Healthcheck output', data)
		Object.assign(data, process.env)
		if (response.statusCode == 200) {
			// Fault-tolerant jobs always return 200, we use more criteria to check for health status
			if (_.has(data, 'successRate') && (data.successRate < program.successRate)) {
				data.error = new Error(`Insufficient success rate (${data.successRate.toFixed(2)})`)
			}
			if (data.nbSkippedJobs >= program.nbSkippedJobs) {
				data.error = new Error(`Too much skipped jobs (${data.nbSkippedJobs})`)
			}
    }
    if (data.error) {
    	publishToConsole(messageCompiler(data))
    	await publishToSlack(messageCompiler(data), linkCompiler(data))
    	process.exit(1)
    } else {
    	process.exit(0)
    }
	} catch (error) {
		let data = Object.assign({ jobId: '' }, process.env)
		data.error = error
		publishToConsole(messageCompiler(data))
    await publishToSlack(messageCompiler(data), linkCompiler(data))
		process.exit(1)
	}
}

healthcheck()
