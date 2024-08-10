const NodeHelper = require("node_helper");
const request = require('request');

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node helper for: " + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "FETCH_GEOLOCATION") {
            this.getGeoLocation(payload.apiKey);
        }
    },

    getGeoLocation: function(apiKey) {
        var url = `https://api.ip2location.io/?key=${apiKey}&format=json`;

        request(url, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                this.sendSocketNotification("GEOLOCATION_RESULT", data);
            } else {
                console.error("Failed to fetch geolocation: ", error);
            }
        });
    }
});