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
            .assertElevationGain(240, 20)
            .assertElevationLoss(280, 20)
            .assertElevationTotalChange(520, 20)
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
