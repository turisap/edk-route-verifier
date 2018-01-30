module.exports = {

    before : function(client) {

    },

    'Positive test - short path': function (client) {
        client.page.page()
            .navigate(1)
            .verifyRoute()
            .assertSinglePath(true)
            .assertPathLength(52, 1)
            .assertRouteType('Trasa EDK')
            .assertNumberOfStations(true)
            .assertStationsOrder(true)
            .assertStationsOnPath(true)
            .assertElevationGain(300, 20)
            .assertElevationLoss(340, 20)
            .assertElevationTotalChange(650, 20)
            .assertDataConsistency(true);
    },

    'Positive test - circular route': function (client) {
        client.page.page()
            .navigate('2-circular')
            .verifyRoute()
            .assertSinglePath(true)
            .assertPathLength(37, 1)
            .assertRouteType('Trasa EDK')
            .assertNumberOfStations(true)
            .assertStationsOrder(true)
            .assertStationsOnPath(true)
            .assertElevationGain(1580, 20)
            .assertElevationLoss(1580, 20)
            .assertElevationTotalChange(3160, 20)
            .assertDataConsistency(true);
    },

    'Positive test - long path': function (client) {
    },

    after: function(client) {
        client.end();
    }
};
