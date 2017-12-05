# Extending krawler

## Extend services

In order to keep krawler generic [all services](./SERVICES.MD) are not tied to specific implementations. As a consequence, each time a create operation is run on a service it expects as input a `type` and `options` parameters used to delegate the actual instanciation to a user-registered construction function. The [base service](https://github.com/kalisio/krawler/blob/master/src/services/service.js) class is used to implement this behaviour on all our services, to register a new constructor:
```
app.service(serviceName)
.registerGenerator(typeName, (options) => {
  ...
  return a service entity based on provided options
})
```

The type of the created entity depends on the service being extended:
* a store constructor should return an abstract-blob-store object,
* a task constructor should return a stream to extract data from that is piped to the target store,
* a job constructor should return a promise resolved or rejected when the job is finished or has failed.

## Extend hooks

**TODO**
