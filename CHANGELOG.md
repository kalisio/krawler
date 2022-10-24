# Changelog

## [v2.1.0](https://github.com/kalisio/krawler/tree/v2.1.0) (2022-10-24)

[Full Changelog](https://github.com/kalisio/krawler/compare/v2.0.0...v2.1.0)

**Implemented enhancements:**

- Add a hook to specify outputs of a task [\#218](https://github.com/kalisio/krawler/issues/218)
- Feathers hooks should be able to use distributed services [\#217](https://github.com/kalisio/krawler/issues/217)
- Hook to call a Feathers API should allow to transform data before sending [\#213](https://github.com/kalisio/krawler/issues/213)
- Add params option to Feathers service method hook [\#212](https://github.com/kalisio/krawler/issues/212)

**Fixed bugs:**

- Krawler API mode does not work anymore [\#215](https://github.com/kalisio/krawler/issues/215)
- Job without tasks exit as failing [\#214](https://github.com/kalisio/krawler/issues/214)

**Merged pull requests:**

- build\(deps\): bump moment-timezone from 0.5.17 to 0.5.37 [\#211](https://github.com/kalisio/krawler/pull/211) ([dependabot[bot]](https://github.com/apps/dependabot))

## [v2.0.0](https://github.com/kalisio/krawler/tree/v2.0.0) (2022-08-30)

[Full Changelog](https://github.com/kalisio/krawler/compare/v1.2.0...v2.0.0)

**Implemented enhancements:**

- Allow to read TXT files [\#209](https://github.com/kalisio/krawler/issues/209)
- Add hooks to use a Feathers API [\#207](https://github.com/kalisio/krawler/issues/207)
- Allow to read KML files [\#204](https://github.com/kalisio/krawler/issues/204)
- Tasks order in job result array [\#203](https://github.com/kalisio/krawler/issues/203)
- Ensure the store path exists when creating a store of type of FS [\#202](https://github.com/kalisio/krawler/issues/202)
- Provide a envsubst hook [\#201](https://github.com/kalisio/krawler/issues/201)
- Provide a globFTP hook [\#200](https://github.com/kalisio/krawler/issues/200)
- Allow to specify Xml2js parsing options [\#199](https://github.com/kalisio/krawler/issues/199)
- Refactor FTP hooks using lftp [\#198](https://github.com/kalisio/krawler/issues/198)
- Reflect healthcheck status in exit code [\#196](https://github.com/kalisio/krawler/issues/196)
- Add a hook to check for existing key in store [\#179](https://github.com/kalisio/krawler/issues/179)
- Upgrade NodeJS to v16 [\#177](https://github.com/kalisio/krawler/issues/177)
- runCommand hook should allow to pipe stdout/stderr [\#154](https://github.com/kalisio/krawler/issues/154)
- Async job should manage tasks in a queue [\#151](https://github.com/kalisio/krawler/issues/151)
- Make callOnHookItems more configurable [\#150](https://github.com/kalisio/krawler/issues/150)
- Add a progress bar during job execution [\#98](https://github.com/kalisio/krawler/issues/98)
- Upgrade Feathers to v5 [\#82](https://github.com/kalisio/krawler/issues/82)
- Integrate a logger like winston [\#37](https://github.com/kalisio/krawler/issues/37)
- Make krawler able to react to external systems [\#34](https://github.com/kalisio/krawler/issues/34)

**Fixed bugs:**

- writeCSV hook produces empty files [\#169](https://github.com/kalisio/krawler/issues/169)

**Merged pull requests:**

- build\(deps\): bump terser from 4.8.0 to 4.8.1 in /docs [\#210](https://github.com/kalisio/krawler/pull/210) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump moment from 2.29.2 to 2.29.4 in /docs [\#208](https://github.com/kalisio/krawler/pull/208) ([dependabot[bot]](https://github.com/apps/dependabot))
- Migrate to ES modules and Feathers 4 [\#197](https://github.com/kalisio/krawler/pull/197) ([daffl](https://github.com/daffl))
- Upgrade to Feathers 5 [\#195](https://github.com/kalisio/krawler/pull/195) ([daffl](https://github.com/daffl))
- build\(deps\): bump eventsource from 1.0.7 to 1.1.1 in /docs [\#194](https://github.com/kalisio/krawler/pull/194) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump async from 2.6.3 to 2.6.4 in /docs [\#192](https://github.com/kalisio/krawler/pull/192) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump moment from 2.29.1 to 2.29.2 in /docs [\#191](https://github.com/kalisio/krawler/pull/191) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump minimist from 1.2.5 to 1.2.6 in /docs [\#189](https://github.com/kalisio/krawler/pull/189) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump url-parse from 1.5.7 to 1.5.10 in /docs [\#188](https://github.com/kalisio/krawler/pull/188) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump prismjs from 1.25.0 to 1.27.0 in /docs [\#187](https://github.com/kalisio/krawler/pull/187) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump url-parse from 1.5.3 to 1.5.7 in /docs [\#186](https://github.com/kalisio/krawler/pull/186) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump follow-redirects from 1.14.7 to 1.14.8 in /docs [\#185](https://github.com/kalisio/krawler/pull/185) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump ajv from 6.11.0 to 6.12.6 in /docs [\#184](https://github.com/kalisio/krawler/pull/184) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump pathval from 1.1.0 to 1.1.1 [\#183](https://github.com/kalisio/krawler/pull/183) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump shelljs from 0.8.3 to 0.8.5 [\#182](https://github.com/kalisio/krawler/pull/182) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump follow-redirects from 1.13.1 to 1.14.7 in /docs [\#181](https://github.com/kalisio/krawler/pull/181) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump mermaid from 8.13.5 to 8.13.8 in /docs [\#180](https://github.com/kalisio/krawler/pull/180) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump mermaid from 8.8.4 to 8.13.5 in /docs [\#178](https://github.com/kalisio/krawler/pull/178) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump prismjs from 1.24.0 to 1.25.0 in /docs [\#175](https://github.com/kalisio/krawler/pull/175) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump url-parse from 1.5.1 to 1.5.3 in /docs [\#174](https://github.com/kalisio/krawler/pull/174) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump tar from 4.4.15 to 4.4.18 [\#173](https://github.com/kalisio/krawler/pull/173) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump path-parse from 1.0.6 to 1.0.7 in /docs [\#172](https://github.com/kalisio/krawler/pull/172) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump path-parse from 1.0.5 to 1.0.7 [\#171](https://github.com/kalisio/krawler/pull/171) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump tar from 4.4.4 to 4.4.15 [\#170](https://github.com/kalisio/krawler/pull/170) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump color-string from 1.5.4 to 1.5.5 in /docs [\#168](https://github.com/kalisio/krawler/pull/168) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump prismjs from 1.23.0 to 1.24.0 in /docs [\#167](https://github.com/kalisio/krawler/pull/167) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump bl from 1.2.2 to 1.2.3 [\#166](https://github.com/kalisio/krawler/pull/166) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump postcss from 7.0.35 to 7.0.36 in /docs [\#165](https://github.com/kalisio/krawler/pull/165) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump minimist from 1.2.0 to 1.2.5 in /docs [\#164](https://github.com/kalisio/krawler/pull/164) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump lodash from 4.17.19 to 4.17.21 [\#163](https://github.com/kalisio/krawler/pull/163) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump ws from 6.2.1 to 6.2.2 in /docs [\#162](https://github.com/kalisio/krawler/pull/162) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump dns-packet from 1.3.1 to 1.3.4 in /docs [\#161](https://github.com/kalisio/krawler/pull/161) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump browserslist from 4.16.0 to 4.16.6 in /docs [\#160](https://github.com/kalisio/krawler/pull/160) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump hosted-git-info from 2.6.0 to 2.8.9 [\#158](https://github.com/kalisio/krawler/pull/158) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump lodash from 4.17.19 to 4.17.21 in /docs [\#157](https://github.com/kalisio/krawler/pull/157) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump url-parse from 1.4.7 to 1.5.1 in /docs [\#156](https://github.com/kalisio/krawler/pull/156) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump underscore from 1.9.0 to 1.13.1 [\#155](https://github.com/kalisio/krawler/pull/155) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump ssri from 6.0.1 to 6.0.2 in /docs [\#153](https://github.com/kalisio/krawler/pull/153) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump y18n from 3.2.1 to 3.2.2 [\#152](https://github.com/kalisio/krawler/pull/152) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump elliptic from 6.5.3 to 6.5.4 in /docs [\#149](https://github.com/kalisio/krawler/pull/149) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump pug-code-gen from 2.0.1 to 2.0.3 [\#148](https://github.com/kalisio/krawler/pull/148) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump prismjs from 1.22.0 to 1.23.0 in /docs [\#147](https://github.com/kalisio/krawler/pull/147) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump ini from 1.3.5 to 1.3.7 [\#142](https://github.com/kalisio/krawler/pull/142) ([dependabot[bot]](https://github.com/apps/dependabot))

## [v1.2.0](https://github.com/kalisio/krawler/tree/v1.2.0) (2020-12-22)

[Full Changelog](https://github.com/kalisio/krawler/compare/v1.1.1...v1.2.0)

**Implemented enhancements:**

- Add an option to avoid transforming Json objects in place [\#144](https://github.com/kalisio/krawler/issues/144)
- Allow NWP hook to generate tasks for past runs [\#140](https://github.com/kalisio/krawler/issues/140)
- Healthcheck should not fail when given unknown options [\#139](https://github.com/kalisio/krawler/issues/139)
- Improve healthcheck messages posted on Slack [\#137](https://github.com/kalisio/krawler/issues/137)
- Enhance mergeJson hook to deep merge objects [\#132](https://github.com/kalisio/krawler/issues/132)
- Match predicate not applied when items are an array [\#130](https://github.com/kalisio/krawler/issues/130)

**Fixed bugs:**

- GeoJson features not transformed on write/updateMongoCollection hooks [\#145](https://github.com/kalisio/krawler/issues/145)
- Upper limit exceeded in NWP tasks with a oldest run interval [\#138](https://github.com/kalisio/krawler/issues/138)
- Boolean values in match filter are lost after templating [\#136](https://github.com/kalisio/krawler/issues/136)
- When a job timeout, krawler hangs with the following error: Cannot read property 'type' of undefined [\#135](https://github.com/kalisio/krawler/issues/135)
- Permission denied to run krawler command in container [\#134](https://github.com/kalisio/krawler/issues/134)

**Merged pull requests:**

- build\(deps\): bump fstream from 1.0.11 to 1.0.12 [\#129](https://github.com/kalisio/krawler/pull/129) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump stringstream from 0.0.5 to 0.0.6 [\#126](https://github.com/kalisio/krawler/pull/126) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump prismjs from 1.20.0 to 1.21.0 in /docs [\#125](https://github.com/kalisio/krawler/pull/125) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump elliptic from 6.5.2 to 6.5.3 in /docs [\#124](https://github.com/kalisio/krawler/pull/124) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump lodash from 4.17.15 to 4.17.19 in /docs [\#123](https://github.com/kalisio/krawler/pull/123) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump lodash from 4.17.15 to 4.17.19 [\#122](https://github.com/kalisio/krawler/pull/122) ([dependabot[bot]](https://github.com/apps/dependabot))
- build\(deps\): bump websocket-extensions from 0.1.3 to 0.1.4 in /docs [\#121](https://github.com/kalisio/krawler/pull/121) ([dependabot[bot]](https://github.com/apps/dependabot))

## [v1.1.1](https://github.com/kalisio/krawler/tree/v1.1.1) (2020-05-13)

[Full Changelog](https://github.com/kalisio/krawler/compare/v1.1.0...v1.1.1)

**Implemented enhancements:**

- Upgrade to latest Node.js LTS [\#91](https://github.com/kalisio/krawler/issues/91)

**Fixed bugs:**

- Build not working anymore [\#115](https://github.com/kalisio/krawler/issues/115)
- Tile size is wrongly computed in grid [\#114](https://github.com/kalisio/krawler/issues/114)

## [v1.1.0](https://github.com/kalisio/krawler/tree/v1.1.0) (2020-04-28)

[Full Changelog](https://github.com/kalisio/krawler/compare/v1.0.1...v1.1.0)

**Implemented enhancements:**

- User-defined functions could be async [\#113](https://github.com/kalisio/krawler/issues/113)
- Add an option to keep past forecast data in NWP hook [\#106](https://github.com/kalisio/krawler/issues/106)
- Alllow to apply a tranform in the CSV hooks [\#105](https://github.com/kalisio/krawler/issues/105)

**Fixed bugs:**

- transformJson hook mapping on undefined properties [\#112](https://github.com/kalisio/krawler/issues/112)
- A job with an error hook will make krawler exit with 'tasks.forEach is not a function' when a task throws an error [\#110](https://github.com/kalisio/krawler/issues/110)
- Healthcheck fails when behind a proxy [\#109](https://github.com/kalisio/krawler/issues/109)
- FTP connection fails when behind a proxy [\#108](https://github.com/kalisio/krawler/issues/108)
- Healthcheck fail if the healthcheck endpoint does not respond [\#107](https://github.com/kalisio/krawler/issues/107)
- templateQueryObject cast a property of type of number to a date [\#104](https://github.com/kalisio/krawler/issues/104)
- Dates contained in MongoDB queries are lost [\#103](https://github.com/kalisio/krawler/issues/103)

## [v1.0.1](https://github.com/kalisio/krawler/tree/v1.0.1) (2020-01-02)

[Full Changelog](https://github.com/kalisio/krawler/compare/v1.0.0...v1.0.1)

## [v1.0.0](https://github.com/kalisio/krawler/tree/v1.0.0) (2019-12-11)

[Full Changelog](https://github.com/kalisio/krawler/compare/v0.9.2...v1.0.0)

**Implemented enhancements:**

- Convert number type on templated queries [\#102](https://github.com/kalisio/krawler/issues/102)
- Create an update Mongo DB collection hook [\#101](https://github.com/kalisio/krawler/issues/101)
- Allow to provide bulkWrite options in writeMongoCollection hook [\#100](https://github.com/kalisio/krawler/issues/100)
- Simplify CI scripts [\#97](https://github.com/kalisio/krawler/issues/97)
- Improve runCommand hook to manage multiple commands [\#96](https://github.com/kalisio/krawler/issues/96)
- Enhance travis pipeline [\#94](https://github.com/kalisio/krawler/issues/94)
- Allow to create a MongoDB Aggregation [\#93](https://github.com/kalisio/krawler/issues/93)
- Update dockerfile base image  [\#90](https://github.com/kalisio/krawler/issues/90)
- Enable Greenkeeper to ease dependency upgrades [\#83](https://github.com/kalisio/krawler/issues/83)

**Fixed bugs:**

- faultTolerant hook raises an exception and stops the job [\#99](https://github.com/kalisio/krawler/issues/99)
- Node hangs when a job with a timeout is finished [\#92](https://github.com/kalisio/krawler/issues/92)
- getFTP hook may incorrectly register the output file [\#87](https://github.com/kalisio/krawler/issues/87)

## [v0.9.2](https://github.com/kalisio/krawler/tree/v0.9.2) (2019-09-22)

[Full Changelog](https://github.com/kalisio/krawler/compare/v0.9.1...v0.9.2)

**Implemented enhancements:**

- Update dependencies [\#81](https://github.com/kalisio/krawler/issues/81)

**Fixed bugs:**

- User/Password not defined in authentication hook when stored as environment variable in jobfile [\#86](https://github.com/kalisio/krawler/issues/86)
- Docker tests do not work anymore on Travis [\#85](https://github.com/kalisio/krawler/issues/85)
- Generated grid is not a square depending on latitude [\#84](https://github.com/kalisio/krawler/issues/84)
- WCS query with resample options is invalid with MapServer [\#80](https://github.com/kalisio/krawler/issues/80)

## [v0.9.1](https://github.com/kalisio/krawler/tree/v0.9.1) (2019-06-19)

[Full Changelog](https://github.com/kalisio/krawler/compare/v0.9.0...v0.9.1)

**Implemented enhancements:**

- Improve healthcheck with job run time [\#76](https://github.com/kalisio/krawler/issues/76)
- Healthcheck script should manage alert opening/closing [\#73](https://github.com/kalisio/krawler/issues/73)

**Fixed bugs:**

- NWP tests fail on GFS [\#79](https://github.com/kalisio/krawler/issues/79)
- Fault-tolerant hooks do not catch errors [\#78](https://github.com/kalisio/krawler/issues/78)
- Unexpected error  "Cannot read property 'type' of undefined" [\#77](https://github.com/kalisio/krawler/issues/77)
- Error messages should be redirected to stderr [\#75](https://github.com/kalisio/krawler/issues/75)
- Healthcheck script fails if an error is raised by a hook [\#74](https://github.com/kalisio/krawler/issues/74)
- Healthcheck script slack notification does not have hyperlink [\#72](https://github.com/kalisio/krawler/issues/72)
- Healthcheck script failure in unknown circumstances [\#71](https://github.com/kalisio/krawler/issues/71)

## [v0.9.0](https://github.com/kalisio/krawler/tree/v0.9.0) (2019-05-15)

[Full Changelog](https://github.com/kalisio/krawler/compare/v0.8.1...v0.9.0)

**Implemented enhancements:**

- Add healthcheck script [\#70](https://github.com/kalisio/krawler/issues/70)
- Improve healthcheck and error management for fault-tolerant jobs [\#69](https://github.com/kalisio/krawler/issues/69)
- Update MongoDB driver version to enable connection to MongoDB Atlas [\#66](https://github.com/kalisio/krawler/issues/66)
- The krawler container should ship GDAL [\#63](https://github.com/kalisio/krawler/issues/63)
- Allow to list an FTP remoteDir [\#61](https://github.com/kalisio/krawler/issues/61)
- Enhance MongoDB vocabulary [\#31](https://github.com/kalisio/krawler/issues/31)

**Fixed bugs:**

- Incorrect value of MongoDb database name [\#65](https://github.com/kalisio/krawler/issues/65)
- disconnectFTP hook should execute the quit command [\#60](https://github.com/kalisio/krawler/issues/60)

## [v0.8.1](https://github.com/kalisio/krawler/tree/v0.8.1) (2019-02-19)

[Full Changelog](https://github.com/kalisio/krawler/compare/v0.8.0...v0.8.1)

**Implemented enhancements:**

- Allow to convert numbers to string on JSON transformation [\#59](https://github.com/kalisio/krawler/issues/59)
- Add a hook that could transform OSM data to GeoJSON [\#56](https://github.com/kalisio/krawler/issues/56)
- Add a task which can handle an Overpass API query [\#55](https://github.com/kalisio/krawler/issues/55)

**Fixed bugs:**

- The default url to perform overpass task seems to be deprecated [\#58](https://github.com/kalisio/krawler/issues/58)
- runCommand hook might prevent job to finish [\#38](https://github.com/kalisio/krawler/issues/38)

## [v0.8.0](https://github.com/kalisio/krawler/tree/v0.8.0) (2019-01-15)

[Full Changelog](https://github.com/kalisio/krawler/compare/v0.7.0...v0.8.0)

**Implemented enhancements:**

- Add ability to unzip files [\#50](https://github.com/kalisio/krawler/issues/50)
- Add a healthcheck entry point [\#49](https://github.com/kalisio/krawler/issues/49)
- Add some capabilities to handle FTP [\#48](https://github.com/kalisio/krawler/issues/48)
- Add a WFS task type [\#46](https://github.com/kalisio/krawler/issues/46)
- Stop job after a given number of failed tasks [\#44](https://github.com/kalisio/krawler/issues/44)
- Allow the template function to tackle properties of type of array of objects [\#42](https://github.com/kalisio/krawler/issues/42)
- Allow to create swarm service  [\#41](https://github.com/kalisio/krawler/issues/41)
- Creating multiple single indices does not work [\#40](https://github.com/kalisio/krawler/issues/40)
- Create a apply hook to run a custom function on items [\#36](https://github.com/kalisio/krawler/issues/36)
- Add a retry capability for tasks in async job [\#35](https://github.com/kalisio/krawler/issues/35)
- CRON jobs are launched immediately [\#32](https://github.com/kalisio/krawler/issues/32)
- Migrate to Feathers V3 [\#28](https://github.com/kalisio/krawler/issues/28)
- Enhance docker hooks [\#27](https://github.com/kalisio/krawler/issues/27)
- Make krawler able to communicate with external systems [\#24](https://github.com/kalisio/krawler/issues/24)
- Refactor using only hooks [\#4](https://github.com/kalisio/krawler/issues/4)

**Fixed bugs:**

- Unzip hook returns before file has been written [\#52](https://github.com/kalisio/krawler/issues/52)
- Unauthorize API requests in non-API mode [\#51](https://github.com/kalisio/krawler/issues/51)
- Job hangs after mongo connection failure [\#47](https://github.com/kalisio/krawler/issues/47)
- readJson hook fails silently on perse error [\#45](https://github.com/kalisio/krawler/issues/45)
- Concurrent tasks skipped when a task fails [\#33](https://github.com/kalisio/krawler/issues/33)
- Possible memory leak [\#30](https://github.com/kalisio/krawler/issues/30)
- Mongo client not correctly cleared [\#29](https://github.com/kalisio/krawler/issues/29)

**Merged pull requests:**

- \[Snyk\] Fix for 1 vulnerable dependencies [\#17](https://github.com/kalisio/krawler/pull/17) ([snyk-bot](https://github.com/snyk-bot))

## [v0.7.0](https://github.com/kalisio/krawler/tree/v0.7.0) (2018-07-17)

[Full Changelog](https://github.com/kalisio/krawler/compare/v0.6.0...v0.7.0)

**Fixed bugs:**

- MongoDB job never completes [\#26](https://github.com/kalisio/krawler/issues/26)

## [v0.6.0](https://github.com/kalisio/krawler/tree/v0.6.0) (2018-07-10)

[Full Changelog](https://github.com/kalisio/krawler/compare/v0.5.2...v0.6.0)

**Implemented enhancements:**

- Added numerical weather prediction models management [\#22](https://github.com/kalisio/krawler/issues/22)

## [v0.5.2](https://github.com/kalisio/krawler/tree/v0.5.2) (2018-06-28)

[Full Changelog](https://github.com/kalisio/krawler/compare/v0.5.1...v0.5.2)

**Fixed bugs:**

- krawler command not available [\#21](https://github.com/kalisio/krawler/issues/21)

## [v0.5.1](https://github.com/kalisio/krawler/tree/v0.5.1) (2018-06-27)

[Full Changelog](https://github.com/kalisio/krawler/compare/v0.5.0...v0.5.1)

**Fixed bugs:**

- CLI mode broken since v0.5 [\#20](https://github.com/kalisio/krawler/issues/20)

## [v0.5.0](https://github.com/kalisio/krawler/tree/v0.5.0) (2018-06-27)

[Full Changelog](https://github.com/kalisio/krawler/compare/v0.4.0...v0.5.0)

**Implemented enhancements:**

- Tag which hooks to be run in case of errors [\#19](https://github.com/kalisio/krawler/issues/19)
- Generate web app from job description [\#18](https://github.com/kalisio/krawler/issues/18)
- Support MongoDB like PG [\#16](https://github.com/kalisio/krawler/issues/16)

## [v0.4.0](https://github.com/kalisio/krawler/tree/v0.4.0) (2018-06-04)

[Full Changelog](https://github.com/kalisio/krawler/compare/v0.3.1...v0.4.0)

**Implemented enhancements:**

- Fault-tolerant jobs/tasks [\#15](https://github.com/kalisio/krawler/issues/15)

## [v0.3.1](https://github.com/kalisio/krawler/tree/v0.3.1) (2018-05-31)

[Full Changelog](https://github.com/kalisio/krawler/compare/v0.3.0...v0.3.1)

**Implemented enhancements:**

- Date/time format conversion [\#14](https://github.com/kalisio/krawler/issues/14)

## [v0.3.0](https://github.com/kalisio/krawler/tree/v0.3.0) (2018-05-23)

[Full Changelog](https://github.com/kalisio/krawler/compare/v0.2.3...v0.3.0)

**Implemented enhancements:**

- Support CRON jobs [\#12](https://github.com/kalisio/krawler/issues/12)

## [v0.2.3](https://github.com/kalisio/krawler/tree/v0.2.3) (2018-05-07)

[Full Changelog](https://github.com/kalisio/krawler/compare/v0.2.2...v0.2.3)

**Fixed bugs:**

- Recurring jobs stop on error [\#11](https://github.com/kalisio/krawler/issues/11)

**Merged pull requests:**

- Add license scan report and status [\#10](https://github.com/kalisio/krawler/pull/10) ([fossabot](https://github.com/fossabot))

## [v0.2.2](https://github.com/kalisio/krawler/tree/v0.2.2) (2018-05-02)

[Full Changelog](https://github.com/kalisio/krawler/compare/v0.2.1...v0.2.2)

## [v0.2.1](https://github.com/kalisio/krawler/tree/v0.2.1) (2018-05-02)

[Full Changelog](https://github.com/kalisio/krawler/compare/v0.2.0...v0.2.1)

## [v0.2.0](https://github.com/kalisio/krawler/tree/v0.2.0) (2018-05-02)

[Full Changelog](https://github.com/kalisio/krawler/compare/285f442ab28459a214e8095bec199d7ace8f1119...v0.2.0)

**Implemented enhancements:**

- Improve transformJson [\#9](https://github.com/kalisio/krawler/issues/9)
- Add a filter to select which tasks are processed by a given hook [\#8](https://github.com/kalisio/krawler/issues/8)
- Add a in-memory store [\#6](https://github.com/kalisio/krawler/issues/6)

**Fixed bugs:**

- Subsequent tasks overwrite first produced file when writing to S3 [\#7](https://github.com/kalisio/krawler/issues/7)
- HTTP error codes not correctly handled [\#2](https://github.com/kalisio/krawler/issues/2)



\* *This Changelog was automatically generated by [github_changelog_generator](https://github.com/github-changelog-generator/github-changelog-generator)*
