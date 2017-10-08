var converters = require('./js/converters');
var geometry = require('./js/geometry');
var helpers = require('./js/helpers');

// TODO: Remove it after getting route ID from context implemented
var testRouteId = '9d13a0acad3ef4da05da04efba7a779e8d91f592';
testRouteId = '167fb6420c15fa6f155c091bf9dde192bd7e5309';
testRouteId = '56adb3f60f82870e833daaaab2301f49ab6e032b';

function verifyRoute() {
    // TODO: Get route ID from context
    helpers.getRoute(testRouteId)
        .then(function (data) {
            // TODO: Add XML validation
            var geoJson = converters.getGeoJSON(data);
            console.log('GeoJSON: ', geoJson);

            var pathLengthTurf = geometry.getPathLength(geoJson, true);
            console.log('Path length:', pathLengthTurf.toFixed(2), 'kilometers');
            var pathLengthGM = geometry.getPathLength(geoJson, false);
            console.log('Path length:', pathLengthGM.toFixed(2), 'meters');

            // TODO: Implement route verification
            converters.getPathElevations(geoJson)
            .then(function(elevations) {
                console.log(elevations);
                var elevationGain = geometry.getElevationGain(elevations);
                console.log('Elevation gain:', elevationGain.toFixed(2), 'meters');
                var elevationLoss = geometry.getElevationLoss(elevations);
                console.log('Elevation loss:', elevationLoss.toFixed(2), 'meters');
                console.log('Elevation total change:', geometry.getTotalElevationChange(elevationGain, elevationLoss).toFixed(2), 'meters');
            })
            .catch(function(error) {

            });
        }).catch(
        function (data, error) {
            // TODO: Handle error
            alert(error);
        });
}

$("button#verifyRoute").bind("click", verifyRoute);