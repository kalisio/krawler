# krawler

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

A native command-line executable can also be generated using [pkg](https://github.com/zeit/pkg) eg for windows:
```
pkg . --target node8-win-x86
```

## Documentation

**TODO**

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
