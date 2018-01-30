# edk-route-verifier
[![CircleCI](https://circleci.com/gh/cloudify-cosmo/cloudify-stage.svg?style=svg)](https://circleci.com/gh/qooban/edk-route-verifier)


### Setup
```$xslt
npm install -g browserify
npm install -g uglify-js

npm install
cd server && npm install
```

### Server
- create configuration file `config.json` file in `server` directory (take `server/config.json.template` as a template)
- start server: `npm start`
- open in browser: `http://localhost:7777/<route_id>` (NOTE: file `<route_id>.kml` must be present in resources path defined in configuration file to show the page properly)

### Test
#### Run
- start server: `npm start`
- start tests: `npm test`
#### Add
- put `<route_id>.kml` (input KML file) and `<route_id>_route_params.json` (route parameters response JSON) files in resources directory
- add new test in `test/tests` directory