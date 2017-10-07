var converters = require('./js/converters');
var helpers = require('./js/helpers');

// TODO: Remove it after getting route ID from context implemented
var testRouteId = '9d13a0acad3ef4da05da04efba7a779e8d91f592';

function verifyRoute() {
    // TODO: Get route ID from context
    helpers.getRoute(testRouteId)
        .then(function (data) {
            // TODO: Add XML validation
            var geoJson = converters.getGeoJSON(data);
            console.log(geoJson);

            // TODO: Implement route verification
            converters.getPathElevations(geoJson)
            .then(function(elevations) {
                console.log(elevations);
            })
            .catch(function(error) {
                console.log('dupa')
            });
        }).catch(
        function (data, error) {
            // TODO: Handle error
            alert(error);
        });
}

$("button#verifyRoute").bind("click", verifyRoute);