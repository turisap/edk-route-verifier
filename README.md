# edk-route-verifier

### Setup
```$xslt
npm install -g browserify
npm install -g uglify-js

npm install
cd server && npm install
```

### Server
- create `config.json` file in `server` directory (see `server/config.json.template`)
- start server: `npm start`
- open in browser: `http://localhost:7777`

### Test
#### Run
- start server: `npm start`
- start tests: `npm test`
#### Add
- put `<route_id>.kml` (input KML file) and `<route_id>_route_params.json` (route parameters response JSON) files in test/resources directory
- open in browser: `http://localhost:7777/<route_id>`