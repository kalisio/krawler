# API

These sections detail the external (i.e. REST/Websocket) as well as the internal (ie Classes/Functions) [API](https://en.wikipedia.org/wiki/Application_programming_interface) of krawler.

A set of introduction articles have been written to detail:
* [the underlying concepts](https://medium.com/@luc.claustres/a-minimalist-etl-using-feathersjs-part-1-1d56972d6500)
* the practical use case of geographical data processing

## Services

### Complete Example

Here's an example of a Feathers server that uses the krawler services: 

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

## Hooks

