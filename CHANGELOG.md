# Changelog

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

## [v1.0.1](https://github.com/kalisio/krawler/tree/v1.0.1) (2020-01-02)

[Full Changelog](https://github.com/kalisio/krawler/compare/v1.0.0...v1.0.1)

**Fixed bugs:**

- Dates contained in MongoDB queries are lost [\#103](https://github.com/kalisio/krawler/issues/103)

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

**Fixed bugs:**

- NWP tests fail on GFS [\#79](https://github.com/kalisio/krawler/issues/79)
- Fault-tolerant hooks do not catch errors [\#78](https://github.com/kalisio/krawler/issues/78)
- Unexpected error  "Cannot read property 'type' of undefined" [\#77](https://github.com/kalisio/krawler/issues/77)
- Error messages should be redirected to stderr [\#75](https://github.com/kalisio/krawler/issues/75)
- Healthcheck script fails if an error is raised by a hook [\#74](https://github.com/kalisio/krawler/issues/74)
- Healthcheck script should manage alert opening/closing [\#73](https://github.com/kalisio/krawler/issues/73)
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
- Create a apply hook to run a custom function on items [\#36](https://github.com/kalisio/krawler/issues/36)
- Add a retry capability for tasks in async job [\#35](https://github.com/kalisio/krawler/issues/35)
- Migrate to Feathers V3 [\#28](https://github.com/kalisio/krawler/issues/28)
- Enhance docker hooks [\#27](https://github.com/kalisio/krawler/issues/27)
- Make krawler able to communicate with external systems [\#24](https://github.com/kalisio/krawler/issues/24)
- Refactor using only hooks [\#4](https://github.com/kalisio/krawler/issues/4)

**Fixed bugs:**

- Unzip hook returns before file has been written [\#52](https://github.com/kalisio/krawler/issues/52)
- Unauthorize API requests in non-API mode [\#51](https://github.com/kalisio/krawler/issues/51)
- Job hangs after mongo connection failure [\#47](https://github.com/kalisio/krawler/issues/47)
- readJson hook fails silently on perse error [\#45](https://github.com/kalisio/krawler/issues/45)
- Creating multiple single indices does not work [\#40](https://github.com/kalisio/krawler/issues/40)
- Concurrent tasks skipped when a task fails [\#33](https://github.com/kalisio/krawler/issues/33)
- CRON jobs are launched immediately [\#32](https://github.com/kalisio/krawler/issues/32)
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



\* *This Changelog was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*