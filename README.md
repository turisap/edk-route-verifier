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
- build edk-route-verifier bundle: `npm run bundle`
- start server: `cd server && npm start`
- open in browser: `http://localhost:8080`

### Test
- put `<route_id>.kml` (input KML file) and `<route_id>_route_params.json` (route parameters response JSON) files in test/resources directory
- open in browser: `http://localhost:8080/<route_id>`