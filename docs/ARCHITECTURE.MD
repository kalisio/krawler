# Architecture

krawler is powered by [Feathers](https://feathersjs.com/) and rely on two of its main abstractions: [services](https://docs.feathersjs.com/api/services.html) and [hooks](https://docs.feathersjs.com/api/hooks.html). We assume you are familiar with this technology.

## Main concepts

krawler manipulates three kind of entities:
* a **store** define where the extracted/processed data will reside,
* a **task** define what data to be extracted and how to query it,
* a **job** define what tasks to be run to fulfill a request (i.e. sequencing).

On top of this [hooks](https://docs.feathersjs.com/api/hooks.html) provide a set of functions that can be typically run before/after a task/job such as a conversion after a download or task generation before a job run. More or less, this allows to create a [processing pipeline](https://en.wikipedia.org/wiki/Pipeline_(computing)).

Regarding the store management we rely on [abstract-blob-store](https://github.com/maxogden/abstract-blob-store), which abstracts a lot of different storage backends (local file system, AWS S3, Google Drive, etc.), and is already used by [feathers-blob](https://github.com/feathersjs-ecosystem/feathers-blob).

## Global architecture

The following figure depicts the global architecture and all concepts at play:

![Architecture](https://github.com/kalisio/krawler/blob/master/images/global-architecture.png)
