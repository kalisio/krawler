const request = require('request')
const program = require('commander')
const utils = require('util')

program
    .usage('[options]')
    .option('-a, --api', 'Setup as web app by exposing an API')
    .option('-ap, --api-prefix [prefix]', 'When exposed as an API change the prefix (defaults to /api)', '/api')
    .option('-po, --port [port]', 'Change the port to be used (defaults to 3030)', 3030)
    .option('-sr, --success-rate [rate]', 'Change the success rate for fault-tolerant jobs to be considered as successful (defaults to 1)', 1)
    .option('-sj, --nb-skipped-jobs [nb]', 'Change the number of skipped runs for fault-tolerant jobs to be considered as failed (defaults to 3)', 3)
    .option('-sw, --slack-webhook [url]', 'Slack webhook URL to post messages on failure', process.env.SLACK_WEBHOOK_URL)
    .option('-d, --debug', 'Verbose output for debugging')
    .parse(process.argv)

async function healthcheck () {
	const endpoint = `http://localhost:${program.port}${program.api ? program.apiPrefix : ''}/healthcheck`
	try {
		const response = await utils.promisify(request.get)(endpoint)
		const data = JSON.parse(response.body)
    if (program.debug) console.log('Healthcheck output', data)
    if (program.slackWebhook) {
    	await utils.promisify(request.post)({
    		url: program.slackWebhook,
    		body: JSON.stringify({
    			text: 'Job healthcheck'
    		})
    	})
    }
		if (response.statusCode == 200) {
			// Fault-tolerant jobs always return 200, we use more criteria to check for health status
			if (data.successRate < program.successRate) process.exit(1)
			if (data.nbSkippedJobs >= program.nbSkippedJobs) process.exit(1)
    }
    process.exit(0)
	} catch (error) {
		if (program.debug) console.error('Healthcheck failed', error)
		process.exit(1)
	}
}

healthcheck()
