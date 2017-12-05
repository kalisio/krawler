The krawler can be viewed as a minimalist **Extract, Transform, Load (ETL)** system. It allows to:
* extract data from heterogeneous data sources (e.g. storages or web services);
* transform data in a target format or structure (e.g. JSON or CSV);
* load data into a target store (e.g. a file system or a database).

# Installation

## As Command-Line Interface (CLI)

```
npm install -g @kalisio/krawler
```

## As module

As dependency in another module/app:
```
npm install @kalisio/krawler --save
```

Or when developing:
```
git clone https://github.com/kalisio/krawler
cd krawler
npm install
```

A native command-line executable can be generated using [pkg](https://github.com/zeit/pkg) eg for windows:
```
pkg . --target node8-win-x86
```

> Because it relies on the GDAL native bindings you will need to deploy the *gdal.node* file (usually found in *node_modules\gdal\lib\binding*) to the same directory as the executable. Take care to generate the executable with the same architecture than your Node.js version. 

# Samples

Samples are not intended to work out-of-the-box because they rely on data sources that might not be available or relevant for you. However they can be easily adapted to a working use case.

You can run a sample from the *examples* directory of the module like this:
```
cd examples
// If local installation
node .. ./dem2csv/jobfile.js
// If global/executable installation
krawler ./dem2csv/jobfile.js
```

Intermediate and product outputs will be generated in the *ouput* folder. The available samples are detailed below.

## csv2pg

Grab a CSV file from AWS S3, convert it to GeoJson and push it into a PostGIS database table (it will be dropped if it already exists). The [hooks](./HOOKS.MD) used are the following:

![Hooks Blocks](https://cdn.rawgit.com/kalisio/krawler/c85a9a96f08e090ff8b60b9df4adfa108f70bd7a/examples/csv2pg/Hooks%20Diagram.svg)

Some parameters like the input file name of the PostGIS host can be directly edited in the jobfile. However, for security concerns, some secrets are not hard-written in the jobfile, as a consequence you must define the following environment variables to make this sample work:
* **S3_ACCESS_KEY** : AWS S3 Access Key ID
* **S3_SECRET_ACCESS_KEY** : AWS S3 Secret Access Key
* **S3_BUCKET** : the name of the S3 bucket to read the CSV file from
* **PG_USER** : the name of the PostgreSQL user to be used to connect
* **PG_PASSWORD** : the password of the PostgreSQL user to be used to connect

## dem2csv

Extract Digital Elevation Model [DEM](https://en.wikipedia.org/wiki/Digital_elevation_model) data from a WCS server and produces a CSV file. The output consists in a geographic grid of a given *width* (in meter) and *resolution* (in meter), centered around a location defined by [*longitude*, *latitude*] (in WGS84 degrees). Each row of the CSV contains the bounding box of a cell and the corresponding elevation value.

> The original purpose was to ease ingestion of this data in a Hadoop system to perform some analysis

The sample folder contains a job configuration stored in [`jobfile.js`](https://github.com/kalisio/krawler/blob/master/examples/dem2csv/jobfile.js) to perform the process around a given location, which includes the hooks configuration in [`hooks-blocks.js`](https://github.com/kalisio/krawler/blob/master/examples/dem2csv/hooks-blocks.js).

The process can handle large datasets because the grid is split in a matrix of NxN blocks of *blockResolution* (in meter) to perform the data download and the merging of all block data relies on streams. The [hooks](./HOOKS.MD) used are the following:

![Hooks Blocks](https://cdn.rawgit.com/kalisio/krawler/b46277bd9ef6b866e1a4d634766882345b9fd198/examples/dem2csv/Hooks%20Diagram%20Blocks.svg)

Here is what look like the (intermediate) outputs generated: grid blocks in [CSV](https://github.com/kalisio/krawler/raw/master/test/data/RJTT-30-18000-2-1.csv) and images

![Grid Blocks](https://github.com/kalisio/krawler/raw/master/examples/dem2csv/dem2csv-blocks.png)

For illustration purpose we kept the original ["naïve" implementation](https://github.com/kalisio/krawler/blob/master/examples/dem2csv/hooks.js) that performed data download of each grid cell independently.
However, processing time was too long on high resolution grids, the [hooks](./API.MD#hooks) used were the following:

![Hooks](https://cdn.rawgit.com/kalisio/krawler/b46277bd9ef6b866e1a4d634766882345b9fd198/examples/dem2csv/Hooks%20Diagram.svg)

