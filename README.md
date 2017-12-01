# krawler

![Kalisio logo](https://github.com/kalisio/kDocs/raw/master/images/kalisio-banner-250x96.png)

[![Build Status](https://travis-ci.org/kalisio/krawler.png?branch=master)](https://travis-ci.org/kalisio/krawler)
[![Code Climate](https://codeclimate.com/github/kalisio/krawler/badges/gpa.svg)](https://codeclimate.com/github/kalisio/krawler)
[![Test Coverage](https://codeclimate.com/github/kalisio/krawler/badges/coverage.svg)](https://codeclimate.com/github/kalisio/krawler/coverage)
[![Dependency Status](https://img.shields.io/david/kalisio/krawler.svg?style=flat-square)](https://david-dm.org/kalisio/krawler)
[![Download Status](https://img.shields.io/npm/dm/krawler.svg?style=flat-square)](https://www.npmjs.com/package/krawler)

> Make automated process of extracting data from (geographic) web services easy

## Installation

```
npm install krawler --save
```

Add `-g` option if you'd like to globally install the command-line version.  

You can run a sample from the example directory like this
```
// If local installation
node . ./example/RJTT.js
// If global/executable installation
krawler ./example/RJTT.js
```

A native command-line executable can be generated using [pkg](https://github.com/zeit/pkg) eg for windows:
```
pkg . --target node8-win-x86
```

> Because it relies on the GDAL native bindings you will need to deploy the *gdal.node* file (usually found in *node_modules\gdal\lib\binding*) to the same directory as the executable. Take care to generate the executable with the same architecture than your Node.js version. 

## Documentation

**TODO**

A set of introduction articles is currently written to detail:
* [the underlying concepts](https://medium.com/@luc.claustres/a-minimalist-etl-using-feathersjs-part-1-1d56972d6500)
* the practical use case of geographical data processing

## Complete Example

Here's an example of a Feathers server that uses `krawler`. 

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
```

## License

Copyright (c) 2016

Licensed under the [MIT license](LICENSE).
