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


