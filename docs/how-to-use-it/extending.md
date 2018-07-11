---
sidebar: auto
---

# Extending 

In the future we might consider others options to extend krawler like a plugin architecture but for now you can use the following ways to do so.

## Extend services

In order to keep krawler generic [all services](./services.md) are not tied to specific implementations. As a consequence, each time a create operation is run on a service it expects as input a `type` and `options` parameters used to delegate the actual instanciation to a user-registered construction function. The [base service](https://github.com/kalisio/krawler/blob/master/src/services/service.js) class is used to implement this behaviour on all our services, to register a new constructor:
```js
app.service(serviceName)
.registerGenerator(typeName, (options) => {
  ...
  return a service entity based on provided options
})
```

The type of the created entity depends on the service being extended:
* a store constructor should return an [abstract-blob-store](https://github.com/maxogden/abstract-blob-store) object,
* a task constructor should return a [stream](https://nodejs.org/api/stream.html) to extract data from that is piped to the target store,
* a job constructor should return a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) resolved or rejected when the job is finished or has failed.

If you do not use the services in your app but the CLI mode, you should extend the default services used by the CLI like this:
```js
import { StoresService, TasksService, JobsService } from 'krawler'

StoresService
.registerGenerator('custom-store', (options) => {
  ...
  return a store entity based on provided options
})
```

## Extend hooks

It is possible to add user-registered hook constructor functions like this:
```js
import { hooks } from 'krawler'
// A krawler hook constructor function
let hook = (options = {}) => {
  // Standard FeathersJS hook function
  return (hook) => {
    ...do something that depends on options
    return hook
  }
}
hooks.registerHook('custom', hook)
```

After that you can use your custom hook like the built-in ones with the [CLI](./api.md#command-line-interface).

## Complete example

A complete example of extension is available in the [samples](https://github.com/kalisio/krawler/blob/master/examples/extend/index.js).
