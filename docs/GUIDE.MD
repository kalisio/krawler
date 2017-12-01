The krawler can be viewed as a minimalist **Extract, Transform, Load (ETL)** system. It allows to:
* extract data from heterogeneous data sources (e.g. storages or web services);
* transform data in a target format or structure (e.g. JSON or CSV);
* load data into a target store (e.g. a file system or a database).

# Installation

```
npm install @kalisio/krawler --save
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
