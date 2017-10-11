var helpers = require('./js/helpers');
var Route = require('./js/Route');
var Context = require('./js/Context')
var Controls = require('./js/Controls')

function verifyRoute() {
    var context = new Context();
    var routeId = context.routeId;

    helpers.getRoute(routeId, true)
        .then(function (data) {
            var geoJson = helpers.getGeoJSON(data);
            var route = new Route(geoJson);
            var controls = new Controls();

            // Path checks
            controls.updateSinglePath(route.isSinglePath());
            controls.updatePathStartEndMarked(route.isPathStartMarked(), route.isPathEndMarked());
            route.getPathLength(true);
            route.getPathLength(false);
            route.fetchPathElevationData()
                .then(function() {
                    route.getPathElevation();
                });

            // Station checks
            route.areStationsOnThePath();
            controls.updateNumberOfStations(route.areAllStationsPresent());
            controls.updateStationsOrderAndNaming(route.isStationOrderCorrect(), route.isStationNamingCorrect());

        }).catch(function (data, error) {
            console.error('Route fetching error. Error:', error);
        });
}

$("button#verifyRoute").bind("click", verifyRoute);