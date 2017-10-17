# edk-route-verifier

### Setup
```$xslt
npm install -g browserify
npm install -g uglify-js
```

### Dependencies
#### External (have to be provided in HTML file)
- ChartJS
- GoogleMaps JS API (+ geometry library)
- JQuery
#### Internal (already provided in JS file)
- lodash (only selected functions)
- togeojson
- turf/point-on-line


### Proxy
```$xslt
cd proxy;
npm start
```

### Test
- create bundle: `npm run bundle`
- open in browser: `test/trasa.html`