var helpers = require('./js/helpers');
var Route = require('./js/Route');
var Context = require('./js/Context')

function verifyRoute() {
    var context = new Context();
    var routeId = context.routeId;

    helpers.getRoute(routeId, true)
        .then(function (data) {
            var geoJson = helpers.getGeoJSON(data);
            var route = new Route(geoJson);

            // Path checks
            route.isSinglePath();
            route.isPathStartMarked();
            route.isPathEndMarked();
            route.getPathLength(true);
            route.getPathLength(false);
            route.fetchPathElevationData()
                .then(function() {
                    route.getPathElevation();
                });

            // Station checks
            route.areAllStationsPresent();
            route.areStationsOnThePath();
            route.isStationNamingCorrect();
            route.isStationOrderCorrect();

        }).catch(function (data, error) {
            console.error('Route fetching error. Error:', error);
        });
}

$("button#verifyRoute").bind("click", verifyRoute);