# Using Krawler API

The problem with hooks is that they are configured at application setup time and usually fixed during the whole application lifecycle. It means you would have a to create an application instance for each pipeline you’d like to have, not so simple. This is the reason why krawler is mainly used as a command-line utility (CLI), where each execution setup a new application with a hooks pipeline according to the job to be done.

However, using the CLI, you can also launch it as standard wep application/API. You can then POST job or task requests to the exposed services, e.g. on `localhost:3030/api/jobs`.

# Command-Line Interface

## Internal API

 The underlying implementation is managed by the global **run(jobfile, options)** function:
* **jobfile**: a path to a local job file or a jobfile JSON object
* **options**:
  * **cron**: a [CRON pattern](https://github.com/kelektiv/node-cron) to schedule the job at regular intervals, e.g. `*/5 * * * * *` will run it every 5 seconds, if not provided it will be run only once
  * **proxy**: proxy URL to be used for HTTP requests
  * **proxy-https**: proxy URL to be used for HTTPS requests
  * **user**: user name to be used for proxy
  * **password**: user password to be used for proxy
  * **debug**: output debug messages
  * **sync**: activate [sync module](https://github.com/feathersjs-ecosystem/feathers-sync) with given connection URI so that internal events can be listened externally
  * **port**: port to be used by the krawler (defaults to `3030`)
  * **api**: launch the krawler as a web service/API
  * **api-prefix**: api prefix to be used when launching the krawler as a web service/API (defaults to `/api`)
  
This function is responsible of parsing the job definition including all the required parameters to call the underlying services with the relevant hooks configured (see below).

## External API

The jobfile is the sole mandatory argument of the CLI and options are read from the CLI arguments with the same names as in the [internal API](./using-krawler.md#internal-api]) or using shortcuts like this:

```bash
krawler --user user_name -p password -P proxy_url --cron "*/5 * * * * *" path_to_jobfile.json
```

A jobfile could be a JSON or JS file (it will be `require()`) and its structure is the following:

```js
let job = {
  // Options for job executor
  options: {
    workersLimit: 4,
    faultTolerant: true
  },
  // Store to be used for job output
  store: 'job-store',
  // Common options for all generated tasks
  taskTemplate: {
    // Store to be used for task output
    store: 'job-store',
    id: '<%= jobId %>-<%= taskId %>',
    type: 'xxx',
    options: {
      ...
    }
  },
  // Hooks setup
  hooks: {
    // Tasks service hooks
    tasks: {
      // Hooks to be run after task creation
      after: {
        // Each entry is a hook name and associated options object
        computeSomething: {
          hookOption: ...
        }
      }
    },
    // Jobs service hooks
    jobs: {
      // Hooks to be run before job creation
      before: {
        generateTasks: {
          hookOption: ...
        }
      },
      // Hooks to be run after job creation
      after: {
        generateOutput: {
          hookOption: ...
        }
      }
    }
  },
  // The list of tasks to run if not generated by hooks
  tasks: [
  ...
  ]
}
```

::: tip
When running the krawler as a web API note that only the hooks pipeline is mandatory in the job file. Indeed, job and task objects will be then sent by requesting the exposed web services.
:::

# Healthcheck

## Healthcheck endpoint

When running the krawler as a cron job note that it provides a healthcheck endpoint e.g. on `localhost:3030/api/healthcheck`. The following JSON structure is returned:
* `isRunning`: boolean indicating if the cron job is currently running
* `duration`: last run duration in seconds
* `nbSkippedJobs`: number of times the scheduled job has been skipped due to an on-going one
* `error`: returned error object whenever the cron job has erroned
* `nbFailedTasks`: number of failed tasks for last run for fault-tolerant jobs
* `nbSuccessfulTasks`: number of successful tasks for last run for fault-tolerant jobs
* `successRate`: Ratio of successful tasks / total tasks

The returned HTTP code is `500` whenever an error has occured in the last run, `200` otherwise.

::: tip
You can add your custom data in the healthcheck structure using the [`healthcheck`](../reference/hooks.md#healthcheck-options) hook.
:::

## Healthcheck command

For convenience the krawler also includes a built-in healthcheck script that could be used e.g. by [Docker](https://docs.docker.com/engine/reference/commandline/service_create/). This script uses similar options than the CLI plus some specific options:
* **debug**: output debug messages
* **port**: port used by the krawler (defaults to `3030`)
* **api**: indicates if the krawler has been launched as a web service/API
* **api-prefix**: api prefix used when launching the krawler as a web service/API (defaults to `/api`)
* **success-rate**: the success rate for fault-tolerant jobs to be considered as successful when greater or equal (defaults to 1)
* **max-duration**: the maximum run duration in seconds for fault-tolerant jobs to be considered as failed if greater than (defaults to unset)
* **nb-skipped-jobs**: the number of skipped runs for scheduled fault-tolerant jobs to be considered as failed (defaults to 3)
* **slack-webhook**: [Slack webhook URL](https://api.slack.com/incoming-webhooks) to post messages on failure (defaults to process.env.SLACK_WEBHOOK_URL)
* **message-template**: Message template used on failure for console and Slack output (defaults to `Job <%= jobId %>: <%= error.message %>`)
* **link-template**: Link template used on failure for Slack output (defaults to empty value)

::: tip
Templates are generated with healthcheck structure and environment variables as context, learn more about [templating](https://lodash.com/docs/4.17.4#template).
:::
