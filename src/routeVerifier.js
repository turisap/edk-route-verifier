var logger = require('loglevel');
var helpers = require('./helpers');
var Route = require('./Route');
var Context = require('./Context');
var Controls = require('./Controls');

function verifyRoute() {
    var context = new Context();
    var controls = new Controls();

    controls.resetAll();
    controls.addLoaderToButton();

    helpers.getRoute(context.routeUrl)
        .done(function (data) {
            var geoJson = helpers.getGeoJSON(data);
            var route = new Route(geoJson);

            // Path basic checks
            var isSinglePath = route.isSinglePath();
            controls.updateSinglePath(isSinglePath);

            var routeLength = route.getPathLength();

            var isPathLengthValid = true;
            controls.updatePathLength(isPathLengthValid, routeLength);

            // Station checks
            var areAllStationsPresent = route.areAllStationsPresent();
            controls.updateNumberOfStations(areAllStationsPresent);
            var isStationOrderCorrect = route.isStationOrderCorrect();
            controls.updateStationsOrder(isStationOrderCorrect);
            var areStationsOnThePath = route.areStationsOnThePath();
            controls.updateStationsOnPath(areStationsOnThePath);

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

                    helpers.getRouteParameters(context.routeParamsUrl)
                        .then(function(parameters) {
                            var ACCEPTED_ROUTE_LENGTH_DIFF = 1; //km
                            var ACCEPTED_ELEVATION_GAIN_DIFF = 50; //m
                            var NORMAL_ROUTE_TYPE = 0;
                            var INSPIRED_ROUTE_TYPE = 1;
                            
                            var isLengthConsistent = (routeLength - ACCEPTED_ROUTE_LENGTH_DIFF <= parameters.length &&
                                                      parameters.length <= routeLength + ACCEPTED_ROUTE_LENGTH_DIFF);
                            var isElevationGainConsistent = (pathElevation.gain - ACCEPTED_ELEVATION_GAIN_DIFF <= parameters.ascent &&
                                                             parameters.ascent <= pathElevation.gain + ACCEPTED_ELEVATION_GAIN_DIFF);
                            var isRouteTypeConsistent = parameters.type === (isNormalRoute ? NORMAL_ROUTE_TYPE : INSPIRED_ROUTE_TYPE);
                            var isDataConsistent = isLengthConsistent && isElevationGainConsistent && isRouteTypeConsistent;
                            
                            logger.debug('isLengthConsistent:', isLengthConsistent,
                                         ', isElevationGainConsistent:', isElevationGainConsistent, 
                                         ', isRouteTypeConsistent:', isRouteTypeConsistent); 
                            controls.updateDataConsistency(isDataConsistent);

                            var canRouteBeAutomaticallyApproved = 
                                isPathLengthValid && isPathLengthValid && 
                                areAllStationsPresent && isStationOrderCorrect && areStationsOnThePath && 
                                isPathElevationGainValid && isPathElevationLossValid && isPathElevationTotalChangeValid &&
                                isDataConsistent;
                            
                            if (canRouteBeAutomaticallyApproved) {
                                logger.info('Route verification success. Approving...');
                                helpers.approveRoute(context.routeApproveUrl)
                                    .then(function() {
                                        logger.info('Route approved.');
                                    })
                                    .catch(function(error) {
                                        logger.error('Route approval error.', error);
                                    })
                            } else {
                                logger.info('Route verification failed. Cannot be approved.');
                            }
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
                    controls.updateDataConsistency(false);
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