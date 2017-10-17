var express = require('express');
var request = require('request');
var cors = require('cors');

var app = express();
var apiServerHost = 'http://rejony.edk.org.pl';
var port = process.env.PORT || 8080;

app.get('/getRouteParameters', cors(), function(req, res) {
    var ROUTE_PARAMETERS = { length: 45, elevation: 1000, type: 0 };
    console.log('Sending route parameters to: ', ROUTE_PARAMETERS);
    res.send(ROUTE_PARAMETERS);
});

app.use('', cors(), function(req, res) {
    var url = apiServerHost + req.url;
    console.log('Proxing request to: ', url);
    req.pipe(request(url)).pipe(res);
});

console.log('Starting proxy server at: http://localhost:' + port);
app.listen(port);