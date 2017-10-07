function getRouteUrl(routeId) {
    return 'api/edk/route-files/' + routeId + '/download/gps';
}

module.exports.getRoute = function(routeId) {
    // TODO: Parametrize for browserify (local/production)
    var serverUrl = 'http://localhost:3000/';
    var url = serverUrl + getRouteUrl(routeId);
    return $.ajax(url);
}