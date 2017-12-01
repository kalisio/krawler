# API

These sections detail the external (i.e. REST/Websocket) as well as the internal (ie Classes/Functions) [API](https://en.wikipedia.org/wiki/Application_programming_interface) of krawler.

## Services

### Stores

The `stores` [service](https://docs.feathersjs.com/api/services.html) allow to manage in-memory data stores with the following operations:
* **create(data)**: create a store based on provided data object properties
  * **id**: unique store ID
  * **type**: store type (e.g. `fs`)
  * **options**: specific store implementation options
* **remove(id)**: remove the store with given ID
* **get(id)**: retrieve the store with givnen ID

The returned store objects comply the [abstract-blob-store](https://github.com/maxogden/abstract-blob-store) interface. Available store types are the following:
* [`fs`](https://github.com/mafintosh/fs-blob-store) for local file system
* [`s3`](https://github.com/jb55/s3-blob-store) for AWS S3

### Tasks

The `tasks` [service](https://docs.feathersjs.com/api/services.html) allow to manage individual task execution with the following operations:
* **create(data)**: create a task based on provided data object properties
  * **id**: unique task ID
  * **type**: task type (e.g. `http`)
  * **options**: specific task implementation options plus
    * **outputType**: the type of output produced by this task, defaults to `intermediate`
* **remove(id)**: remove the task with given ID, this will actually remove the produced output from the store given as a (query) parameters

The returned task objects will contain an additional property for each output types holding an array of produced output files. This is used by the [clearOutputs](./API.MD##clearoutputsoptions) hook to perform cleanup.

By default a task implementation return a [stream](https://nodejs.org/api/stream.html) to extract data from that is piped to the target store. Available task types are the following:
* [`http`](https://github.com/request/request) for HTTP requests, available options
* [`wms`](https://en.wikipedia.org/wiki/Web_Map_Service) for HTTP requests targeting WMS services
* [`wcs`](https://en.wikipedia.org/wiki/Web_Coverage_Service) for HTTP requests targeting WCS services
* [`store`](https://github.com/maxogden/abstract-blob-store) to read input data from a store

If the task type is writtent `type-stream` then the stream is not piped directly to the store but returned in a `stream` property for further usage by hooks.

### Jobs

The `jobs` [service](https://docs.feathersjs.com/api/services.html) allow to manage job execution with the following operations:
* **create(data)**: create a job based on provided data object properties
  * **id**: unique job ID
  * **type**: job type (e.g. `async`)
  * **options**: specific job implementation options
* **remove(id)**: remove the job with given ID, this will actually remove the produced output from the store given as a (query) parameters

The returned job object is a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) resolved or rejected when the job is finished or has failed.

Available job types are the following:
* `asyn` to run tasks in parallel by batch, available options are
  * **workersLimit**: the maximum number of tasks to be run in parallel by the job

### Complete Example

Here's an example of a Feathers server that uses the complete set of krawler services: 

```js
const feathers = require('feathers');
const rest = require('feathers-rest');
const hooks = require('feathers-hooks');
const bodyParser = require('body-parser');
const errorHandler = require('feathers-errors/handler');
const plugin = require('krawler');

// Initialize the application
const app = feathers()
  .configure(rest())
  .configure(hooks())
  .configure(plugins())
  // Initialize your feathers plugin services
  .use('/stores', plugin.stores());
  .use('/tasks', plugin.tasks());
  .use('/jobs', plugin.jobs());
  .use(errorHandler());

app.listen(3030);

console.log('Feathers app started on 127.0.0.1:3030');

// You can now call services in REST or programmatically
app.service('jobs').create({ ... })
.then(tasks => {
  console.log('Job terminated, ' + tasks.length + ' tasks ran')
})
.catch(error => {
  console.log(error.message)
})
```

## Hooks

### Authentication [source](https://github.com/kalisio/krawler/blob/master/src/hooks/hooks.auth.js)

#### basicAuth(options)

Add headers to HTTP requests for basic authorization, hook options are the following:
* **type**: type of authorization used as the key in the header, defaults to `Authorization` but could be changed to `Proxy-Authorization` for instance
* **optionsPath**: the property path to the request options that contains the authorization options, defaults to `options`

The authorization options have to be structured like this, e.g. on a task (or similarly on a task template in a job):
```
httpTask: {
  type: 'http',
  options: {
    url: 'xxx',
    auth: {
      user: 'xxx',
      password: 'xxx'
    }
  }
}
```

### CSV

#### readCSV(options)

Read a CSV from an input stream/store and convert it to in-memory JSON values, hook options are the following:
* **dataPath**: property path where to store the resulting JSON object on the hook object, defaults to `result.data`
* **storePath**: property path where to read the store to be used on the hook object, defaults to `data.store`
* any option supported by [fast-csv](https://github.com/C2FO/fast-csv#parsing)

#### writeCSV(options)

Generate a CSV file from in-memory JSON values, hook options are the following:
* **dataPath**: property path where to read the input JSON object on the hook object, defaults to `result`
* **storePath**: property path where to read the store to be used on the hook object, defaults to `data.store`
* **outputType**: the type of output produced by this hook, defaults to `intermediate`
* any option supported by [fast-csv](https://github.com/C2FO/fast-csv#parsing)

#### mergeCSV(options)

Generate a CSV file from a set of input CSV files, hook options are the following:
* **storePath**: property path where to read the store to be used on the hook object, defaults to `data.store`
* **outputType**: the type of output produced by this hook, defaults to `intermediate`
* any option supported by [fast-csv](https://github.com/C2FO/fast-csv#parsing)

The input hook result is expected to be an array of tasks which output will be read back from the store.

### JSON

#### writeJson(options)

Generate a JSON file from in-memory JSON values, hook options are the following:
* **dataPath**: property path where to read the input JSON object on the hook object, defaults to `result`
* **storePath**: property path where to read the store to be used on the hook object, defaults to `data.store`
* **outputType**: the type of output produced by this hook, defaults to `intermediate`

#### transformJson(options)


#### convertToGeoJson(options)


### Raster

#### readGeoTiff(options)


#### computeStatistics(options)


### Clearing

#### clearOutputs(options)


