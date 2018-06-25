# Contributing to Feathers

Thank you for contributing to Krawler! :heart: :tada:

## Report a bug

Before creating an issue please make sure you have checked out the docs, you might want to also try searching Github. It's pretty likely someone has already asked a similar question.

If you haven't found your answer please feel free to join our [slack channel](https://kalisio.slack.com/), create an issue on Github, or post on [Stackoverflow](http://stackoverflow.com) using the `krawler` tag. We try our best to monitor Stackoverflow but you're likely to get more immediate responses in Slack and Github.

Issues can be reported in the [issue tracker](https://github.com/kalisio/krawler/issues).  Since krawler combines many features/modules it can be hard for us to assess the root cause without knowing which features/modules are being used and what your configuration looks like, so **it helps us immensely if you can link to a simple example that reproduces your issue**.

## Pull Requests

We :heart: pull requests and we're continually working to make it as easy as possible for people to contribute.

We prefer small pull requests with minimal code changes. The smaller they are the easier they are to review and merge. A core team member will pick up your PR and review it as soon as they can. They may ask for changes or reject your pull request. This is not a reflection of you as an engineer or a person. Please accept feedback graciously as we will also try to be sensitive when providing it.

Although we generally accept many PRs they can be rejected for many reasons. We will be as transparent as possible but it may simply be that you do not have the same context or information regarding the roadmap that the core team members have. We value the time you take to put together any contributions so we pledge to always be respectful of that time and will try to be as open as possible so that you don't waste it. :smile:

**All PRs (except documentation) should be accompanied with tests and pass the linting rules.**

### Code style

Before running the tests from the `test/` folder `npm test` will run ESlint. You can check your code changes individually by running `npm run lint`.

### ES6 compilation

Krawler uses [Babel](https://babeljs.io/) to leverage the latest developments of the JavaScript language. All code and samples are currently written in ES2015. To transpile the code in this repository run

> npm run compile

__Note:__ `npm test` will run the compilation automatically before the tests.

### Tests

[Mocha](http://mochajs.org/) tests are located in the `test/` folder and can be run using the `npm run mocha` or `npm test` (with ESLint and code coverage) command.

### Documentation

Krawler documentation is contained in Markdown files in the [*docs*](https://github.com/kalisio/krawler/tree/master/docs) folder and generated using [VuePress](https://vuepress.vuejs.org/). To change the documentation submit a pull request to that repo, referencing any other PR if applicable, and the docs will be updated with the next release.

## External Modules

If you're written something awesome for Krawler, please add it to the [examples](https://github.com/kalisio/krawler/blob/master/docs/how-to-use-it/examples.md) section.

If you think it would be a good core module then please contact one of the Feathers core team members in [Slack](http://slack.feathersjs.com) and we can discuss whether it belongs in core and how to get it there. :beers:

## Contributor Code of Conduct

As contributors and maintainers of this project, we pledge to respect all people who contribute through reporting issues, posting feature requests, updating documentation, submitting pull requests or patches, and other activities.

We are committed to making participation in this project a harassment-free experience for everyone, regardless of level of experience, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, or religion.

Examples of unacceptable behavior by participants include the use of sexual language or imagery, derogatory comments or personal attacks, trolling, public or private harassment, insults, or other unprofessional conduct.

Project maintainers have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned to this Code of Conduct. Project maintainers who do not follow the Code of Conduct may be removed from the project team.

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by opening an issue or contacting one or more of the project maintainers.

This Code of Conduct is adapted from the [Contributor Covenant](http://contributor-covenant.org), version 1.0.0, available at [http://contributor-covenant.org/version/1/0/0/](http://contributor-covenant.org/version/1/0/0/)
