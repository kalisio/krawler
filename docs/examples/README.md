---
sidebar: auto
---

# Examples

Examples are not intended to work out-of-the-box because they rely on data sources that might not be available or relevant for you. However they can be easily adapted to a working use case.

You can run a sample from the *examples* directory of the module like this:

```bash
cd examples
# If local installation
node . ./dem2csv/jobfile.js
# If global/executable installation
krawler ./dem2csv/jobfile.js
```

Intermediate and product outputs will be generated in the *ouput* folder. The main available samples are detailed below.

## ADS-B

Grab [ADS-B](https://en.wikipedia.org/wiki/Automatic_dependent_surveillance_%E2%80%93_broadcast) data from two different providers using REST Web Services, convert it to a standardised JSON format, transform it to GeoJson and push it into AWS S3 and the local file system. To avoid "holes" the data from both providers are merged into a single file based on their unique identifier (a.k.a. [ICAO](https://en.wikipedia.org/wiki/Aviation_transponder_interrogation_modes#ICAO_24-bit_address)). Once the file has been produced simply drag'n'drop them at [geojson.io](http://geojson.io) to see the live position of the Air Maroc fleet !

![ADS-B](https://cdn.rawgit.com/kalisio/krawler/c4c7c00e3bd97390d6a9dd91c063d526f9c262e3/images/ADS-B.png)

The [hooks](../how-to-use-it/HOOKS.MD) used are the following:

![Hooks ADS-B](https://cdn.rawgit.com/kalisio/krawler/fd6d4f356fb61824b6cd57d544040dc99d6c3a79/examples/adsb/Hooks%20Diagram.svg)

Most parameters can be directly edited in the jobfile. However, for security concerns, some secrets are not hard-written in the jobfile, as a consequence you must define the following environment variables to make this sample work:
* **S3_ACCESS_KEY** : AWS S3 Access Key ID
* **S3_SECRET_ACCESS_KEY** : AWS S3 Secret Access Key
* **S3_BUCKET** : the name of the S3 bucket to write the GeoJson file to

The web services used according to the providers are the following:
* [ADS-B Exchange](https://www.adsbexchange.com/data/)
* [OpenSky Network](https://opensky-network.org/apidoc/rest.html)

This sample demonstrates the flexibility of the krawler by using:
* different output [stores](../how-to-use-it/SERVICES.html#stores) and an intermediate [in-memory store](../how-to-use-it/SERVICES.html#stores) to avoid writing temporary files,
* a [match filter](../how-to-use-it/HOOKS.html#common-options) to apply a given hook to a subset of the tasks (e.g. perform a JSON transformation adapted to the output of each provider)
* a [JSON transformation](../how-to-use-it/HOOKS.html#transformjsonoptions) to generate an unified format and filter data
* the [same hook multiple times](../how-to-use-it/CLI.html#external-api) (e.g. `writeJson`) with different options (e.g. to write to different output stores)
* the same hook at the task or job level to manage unitary as well as merged data

## Vigicrues

Grab data from the French flood warning system [Vigicrues](https://www.vigicrues.gouv.fr/) as GeoJson using REST Web Services, reproject it, style it according to alert level and push it into AWS S3 and the local file system. Once the file has been produced simply drag'n'drop it at [geojson.io](http://geojson.io) to see the live flood warnings !

![Vigicrues](https://cdn.rawgit.com/kalisio/krawler/3632a68a7daa1bfd7df04bccc2a3c7817542e1f5/images/Vigicrue.png)

This sample is pretty similar to the ADS-B one plus:
* a [reprojection](../how-to-use-it/HOOKS.html#reprojectgeojson-options) to transform data from the Lambert 93 projection system to the WGS 84 projection system
* a [JSON transformation](../how-to-use-it/HOOKS.html#transformjsonoptions) with value mapping to generate styling information

## csv2db

Grab a CSV file from AWS S3, convert it to GeoJson and push it into a PostGIS database table or MongoDB database collection (it will be dropped if it already exists). The [hooks](../how-to-use-it/HOOKS.MD) used are the following for PG (MongoDB is similar):

![Hooks Blocks](https://cdn.rawgit.com/kalisio/krawler/c85a9a96f08e090ff8b60b9df4adfa108f70bd7a/examples/csv2pg/Hooks%20Diagram.svg)

Some parameters like the input file name of the PostGIS host can be directly edited in the jobfile. However, for security concerns, some secrets are not hard-written in the jobfile, as a consequence you must define the following environment variables to make this sample work:
* **S3_ACCESS_KEY** : AWS S3 Access Key ID
* **S3_SECRET_ACCESS_KEY** : AWS S3 Secret Access Key
* **S3_BUCKET** : the name of the S3 bucket to read the CSV file from
* **PG_USER** : the name of the PostgreSQL user to be used to connect
* **PG_PASSWORD** : the password of the PostgreSQL user to be used to connect

## dem2csv

Extract Digital Elevation Model [DEM](https://en.wikipedia.org/wiki/Digital_elevation_model) data from a WCS server and produces a CSV file. The output consists in a geographic grid of a given *width* (in meter) and *resolution* (in meter), centered around a location defined by [*longitude*, *latitude*] (in WGS84 degrees). Each row of the CSV contains the bounding box of a cell and the corresponding elevation value.

This sample is detailed in this [article](https://blog.feathersjs.com/a-minimalist-etl-using-feathersjs-part-2-6aa89bd73d66).

> The original purpose was to ease ingestion of this data in a Hadoop system to perform some analysis

The sample folder contains a job configuration stored in [`jobfile.js`](https://github.com/kalisio/krawler/blob/master/examples/dem2csv/jobfile.js) to perform the process around a given location, which includes the hooks configuration in [`hooks-blocks.js`](https://github.com/kalisio/krawler/blob/master/examples/dem2csv/hooks-blocks.js).

The process can handle large datasets because the grid is split in a matrix of NxN blocks of *blockResolution* (in meter) to perform the data download and the merging of all block data relies on streams. The [hooks](../how-to-use-it/HOOKS.MD) used are the following:

![Hooks Blocks](https://cdn.rawgit.com/kalisio/krawler/b46277bd9ef6b866e1a4d634766882345b9fd198/examples/dem2csv/Hooks%20Diagram%20Blocks.svg)

Here is what look like the (intermediate) outputs generated: grid blocks in [CSV](https://github.com/kalisio/krawler/raw/master/test/data/RJTT-30-18000-2-1.csv) and images

![Grid Blocks](https://github.com/kalisio/krawler/raw/master/examples/dem2csv/dem2csv-blocks.png)

For illustration purpose we kept the original ["naïve" implementation](https://github.com/kalisio/krawler/blob/master/examples/dem2csv/hooks.js) that performed data download of each grid cell independently.
However, processing time was too long on high resolution grids, the [hooks](../how-to-use-it/HOOKS.MD) used were the following:

![Hooks](https://cdn.rawgit.com/kalisio/krawler/b46277bd9ef6b866e1a4d634766882345b9fd198/examples/dem2csv/Hooks%20Diagram.svg)

## Docker

Provide web services with underlying pipeline functions managed using containers. This ensure you don't have to pollute your own operating system by installing anything except [Docker](https://www.docker.com/) and allow to make the processing scale on-demand, e.g. with an underlying [swarm cluster](https://docs.docker.com/engine/swarm/).

### Image conversion service

Convert an image file from PNG to JPG using [ImageMagick](http://imagemagick.org) running in a temporary dedicated container. 

> Before using this sample you will need to download the Image Magick image: `docker pull v4tech/imagemagick`.

Launch the krawler as a web API with the job `krawler jobfile-convert.js --api` then POST the following request to `http://localhost:3030/api/jobs`:
```json
{
	"tasks": [{ "id": "krawler-icon" }]
}
```

You should see a *krawler-icon.jpg* file in the output folder once the job has been executed.

### Map print service

Take a screenshot of a map using [TestCafé](https://github.com/DevExpress/testcafe) running a [Leaflet-based](https://leafletjs.com/) [web mapping client](http://kargo-www.s3-website.eu-central-1.amazonaws.com/) in a temporary dedicated container and output the resulting image on S3. 

This sample is detailed in this [article](https://hackernoon.com/how-to-build-a-map-print-service-in-minutes-c5a24b1f0f41).

> Before using this sample you will need to build the required image from the sample directory: `docker build -t kalisio/leaflet-print .`.

Launch the krawler as a web API with the job `krawler jobfile-print.js --api` then POST the following request containing the GeoJson data and print parameters to `http://localhost:3030/api/jobs`:
```json
{
	"tasks": [{
		"format": "A4 Landscape",
		"baseLayer": "PlanetSat",
		"data": {
    		"type": "Feature",
			"geometry": {
				"type": "LineString",
				"coordinates": [[102.0,0.0],[103.0,1.0],[104.0,0.0],[105.0,1.0]]
			}
    	}
    }]
}
```

Once the job has been executed the response contains the link to download the printed image on S3 for each task:
```json
[
    {
        "id": "bc185cb0-7983-11e8-883f-a333a7402f4a",
        ...
        "link": "https://s3.eu-central-1.amazonaws.com/krawler/bc185cb0-7983-11e8-883f-a333a7402f4a.png"
    }
]
```
