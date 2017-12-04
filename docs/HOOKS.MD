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

### CSV [source](https://github.com/kalisio/krawler/blob/master/src/hooks/hooks.csv.js)

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

### JSON [source](https://github.com/kalisio/krawler/blob/master/src/hooks/hooks.json.js)

#### writeJson(options)

Generate a JSON file from in-memory JSON values, hook options are the following:
* **dataPath**: property path where to read the input JSON object on the hook object, defaults to `result`
* **storePath**: property path where to read the store to be used on the hook object, defaults to `data.store`
* **outputType**: the type of output produced by this hook, defaults to `intermediate`

#### transformJson(options)

Restructure in-memory JSON values, hook options are the following:
* **dataPath**: property path where to read the input JSON object on the hook object, defaults to `result.data`
* **mapping**: a map between input key path and output key path using dot notation like this
```
mapping: {
  sourceProperty: 'targetProperty',
  'source.property': 'target.property',
  sourceProperty: 'targetArrayProperty[0]'
}
```

#### convertToGeoJson(options)

**TODO**

### Raster [source](https://github.com/kalisio/krawler/blob/master/src/hooks/hooks.raster.js)

#### readGeoTiff(options)

Read a GeoTiff from an input stream/store and convert it to in-memory JSON values, hook options are the following:
* **dataPath**: property path where to store the resulting JSON object on the hook object, defaults to `result.data`
* **fields**: set of fields to be exported for each cell, if empty values will be directly exported as a JSON array, otherwise fields among the following can be selected
  * **x**: pixel x-coordinate
  * **y**: pixel y-coordinate
  * **bbox**: pixel bounding box
  * **value**: pixel value

#### computeStatistics(options)

Computes minimum and maximum values on a GeoTiff file, hook options are the following:
* **min**: boolean indicating if minimum value should be computed
* **max**: boolean indicating if maximum value should be computed
* **statisticsPath**: property path where to write the output statistics on the hook object, defaults to `result`

### Geographic grid [source](https://github.com/kalisio/krawler/blob/master/src/hooks/hooks.grid.js)

#### generateGrid(options)

Generate geographic grid parameters from an input location (grid center), area width and resolution. Required input hook data are the following:
* **longitude**: grid center longitude (in degrees)
* **latitude**: grid center latitude (in degrees)
* **resolution**: grid cell resolution (in meters)
* **halfWidth**: grid half-width (in meter)
* **blockResolution**: grid block resolution (in meters)

Output hook data are the following:
* **origin**: grid bounding box minimum longitude and latitude (in degrees)
* **size**: number of grid cells in longitude and latitude
* **resolution**: grid cell resolution (in degrees) for longitude and latitude
* **nbBlocks**: number of grid blocks in longitude and latitude
* **blockSize**: number of grid cells in longitude and latitude within each block
* **blockResolution**: grid block resolution (in degrees) for longitude and latitude

> This hook works only for EPSG 4326

#### generateGridTasks(options)

Generate WMS/WCS request tasks to download data for each cell of a geographic grid (see previous hook for grid definition). It is intended to be used a a job hook and the required input data on the task template are the following:
* **type**: task type (either `wms`or `wcs`)
* **options.version**: WMS/WCS service version
* **options.longitudeLabel**: name of the longitude axis in WCS service
* **options.latitudeLabel**: name of the latitude axis in WCS service

> This hook works only for EPSG 4326

### Clearing

#### clearOutputs(options)

Clear output files generated by tasks and hooks, hook options are the following:
* **storePath**: property path where to read the store to be used on the hook object, defaults to `data.store`
* **type**: the type of output to be cleared by this hook, defaults to `intermediate`


