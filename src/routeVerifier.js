var logger = require('loglevel');
var helpers = require('./helpers');
var Route = require('./Route');
var Context = require('./Context');
var Controls = require('./Controls');

function verifyRoute() {
    var context = new Context();
    var routeUrl = context.routeUrl;
    var isLocal = context.isLocal;
    var controls = new Controls();

    controls.addLoaderToButton();

    helpers.getRoute(routeUrl, isLocal)
        .done(function (data) {
            var geoJson = helpers.getGeoJSON(data);
            var route = new Route(geoJson);

            // Path checks
            controls.updateSinglePath(route.isSinglePath());
            controls.updatePathStartEndMarked(route.isPathStartMarked(), route.isPathEndMarked());

            var routeLength = route.getPathLength();

            var isNormalRoute = routeLength >= 30;
            controls.updateRouteType(isNormalRoute);

            var isPathLengthValid = true;
            controls.updatePathLength(isPathLengthValid, routeLength);

            route.fetchPathElevationData()
                .then(function() {
                    var pathElevation = route.getPathElevation();
                    pathElevation.enrichData(routeLength);

                    var isPathElevationGainValid = isNormalRoute ? true : pathElevation.gain > 500;
                    controls.updateElevationGain(isPathElevationGainValid, pathElevation.gain);

                    var isPathElevationLossValid = true;
                    controls.updateElevationLoss(isPathElevationLossValid, pathElevation.loss);

                    var isPathElevationTotalChangeValid = true;
                    controls.updateElevationTotalChange(isPathElevationTotalChangeValid, pathElevation.totalChange);

                    controls.drawElevationChart(pathElevation);
                });

            // Station checks
            route.areStationsOnThePath();
            controls.updateNumberOfStations(route.areAllStationsPresent());
            controls.updateStationsOrderAndNaming(route.isStationOrderCorrect(), route.isStationNamingCorrect());
            controls.removeLoaderFromButton();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            logger.error('Route fetching error. Error:', textStatus, errorThrown);
            controls.removeLoaderFromButton();
        });
}

// Uncomment to set maximum loglevel
// logger.enableAll();

$("button#verifyRoute").bind("click", verifyRoute);