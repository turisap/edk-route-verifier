var logger = require('loglevel');
var helpers = require('./helpers');
var Route = require('./Route');
var Context = require('./Context');
var Controls = require('./Controls');

function verifyRoute() {
    var context = new Context();
    var routeUrl = context.routeUrl;
    var routeParamsUrl = context.routeParamsUrl;
    var isLocal = context.isLocal;
    var controls = new Controls();

    controls.resetAll();
    controls.addLoaderToButton();

    helpers.getRoute(routeUrl, isLocal)
        .done(function (data) {
            var geoJson = helpers.getGeoJSON(data);
            var route = new Route(geoJson);

            // Path basic checks
            controls.updateSinglePath(route.isSinglePath());

            var routeLength = route.getPathLength();

            var isPathLengthValid = true;
            controls.updatePathLength(isPathLengthValid, routeLength);

            // Station checks
            controls.updateNumberOfStations(route.areAllStationsPresent());
            controls.updateStationsOrder(route.isStationOrderCorrect());
            controls.updateStationsOnPath(route.areStationsOnThePath());

            // Elevation checks
            route.fetchPathElevationData()
                .then(function() {
                    var pathElevation = route.getPathElevation();
                    pathElevation.enrichData(routeLength);

                    var isPathElevationGainValid = true;
                    controls.updateElevationGain(isPathElevationGainValid, pathElevation.gain);

                    var isNormalRoute = routeLength >= 40 || pathElevation.gain > 500 && routeLength >= 30;
                    controls.updateRouteType(isNormalRoute);

                    var isPathElevationLossValid = true;
                    controls.updateElevationLoss(isPathElevationLossValid, pathElevation.loss);

                    var isPathElevationTotalChangeValid = true;
                    controls.updateElevationTotalChange(isPathElevationTotalChangeValid, pathElevation.totalChange);

                    controls.drawElevationChart(pathElevation);

                    helpers.getRouteParameters(routeParamsUrl)
                        .then(function(parameters) {
                            var ACCEPTED_ROUTE_LENGTH_DIFF = 1; //km
                            var ACCEPTED_ELEVATION_GAIN_DIFF = 50; //m
                            var NORMAL_ROUTE_TYPE = 0;
                            var INSPIRED_ROUTE_TYPE = 1;

                            var isDataConsistent = (routeLength - ACCEPTED_ROUTE_LENGTH_DIFF <= parameters.length &&
                                                    parameters.length <= routeLength + ACCEPTED_ROUTE_LENGTH_DIFF)
                                                && (pathElevation.gain - ACCEPTED_ELEVATION_GAIN_DIFF <= parameters.ascent &&
                                                    parameters.ascent <= pathElevation.gain + ACCEPTED_ELEVATION_GAIN_DIFF)
                                                && (parameters.type === (isNormalRoute ? NORMAL_ROUTE_TYPE : INSPIRED_ROUTE_TYPE));
                            controls.updateDataConsistency(isDataConsistent);
                        })
                        .catch(function(error) {
                            logger.error('Route parameters data fetching error.', error);
                        })
                })
                .catch(function(error) {
                    logger.error('Path elevation data fetching error.', error);
                    controls.updateElevationGain(false, 0);
                    controls.updateElevationLoss(false, 0);
                    controls.updateElevationTotalChange(false, 0);
                });
        }).fail(function (xhr, status) {
            logger.error('Route fetching error. Status:', status);
        }).always(function() {
            controls.removeLoaderFromButton();
        });
}

logger.setLevel('warn');
// Uncomment to set maximum loglevel
logger.enableAll();

$("button#verifyRoute").bind("click", verifyRoute);