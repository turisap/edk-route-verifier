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

    'Positive test - long path': function (client) {
    },

    'Positive test - circular route': function (client) {
    },

    after: function(client) {
        client.end();
    }
};
