---
sidebar: auto
---

# Installation

## As Command-Line Interface (CLI)

```bash
npm install -g @kalisio/krawler
```

## As module

As dependency in another module/app:

```bash
npm install @kalisio/krawler --save
```

Or when developing:

```bash
git clone https://github.com/kalisio/krawler
cd krawler
npm install
```

A native command-line executable can be generated using [pkg](https://github.com/zeit/pkg) eg for windows:

```bash
pkg . --target node8-win-x86
```

> Because it relies on the GDAL native bindings you will need to deploy the *gdal.node* file (usually found in *node_modules\gdal\lib\binding*) to the same directory as the executable. Take care to generate the executable with the same architecture than your Node.js version.

## As a Docker container

When using krawler as a Docker container the arguments to the CLI have to be provided through the ARGS environment variable, along with any other required variables and the data volume to make inputs accessible within the container and get output files back:

```bash
docker pull kalisio/krawler
docker run --name krawler --rm -v /mnt/data:/opt/krawler/data -e "ARGS=/opt/krawler/data/jobfile.js" -e S3_BUCKET=krawler
```