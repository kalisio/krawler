# Known issues

## Use the same hook multiple times

By default hook names are used as JSON object keys so you cannot have the same hook appearing twice in your pipeline using this notation. However, you can also use the *named hook syntax* if you want to use the same hook multiple times in your pipeline. In this case the key used in the configuration file can be whatever you want but the associated object value must have a `hook` property containing the name of the hook to be run like this:

```js
tasks: {
  after: {
    readXML: {
    },
    writeTemplateYaml: {
      hook: 'writeTemplate',
      templateFile: 'mapproxy-template.yaml'
    },
    writeTemplateHtml: {
      hook: 'writeTemplate',
      templateFile: 'leaflet-template.html'
    }
  }
}
```

## Use parallelism

By default all hooks are run in sequence, if at given step of your pipeline you want a parallel execution of some you can use the reserved hook name `parallel` and give the hooks to be run in parallel as an array of items each containing the hook name as a `hook` property and its options as other properties:

```js
tasks: {
  after: {
    readXML: {
    },
    parallel: [
      {
        hook: 'writeTemplate',
        templateFile: 'mapproxy-template.yaml'
      },
      {
        hook: 'writeTemplate',
        templateFile: 'leaflet-template.html'
      }
    ]
  }
}
```

## Handling error

You can use the **faultTolerant** option to catch any error raised in a hook so that the hook chain will continue anyway. However, it is sometimes hard to ensure the pipeline will run fine until the end once an error occurred In this case, you'd better let the chain stop (the default behavior) and register specific hooks to be run whenever an error occurs, such as one used to clear intermediate outputs:

```js
tasks: {
  after: {
    ...
  },
  error: {
    clearOutputs: {}
  }
}
```
