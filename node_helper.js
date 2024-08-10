const NodeHelper = require("node_helper");
const https = require('https');

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
        const url = `https://api.ip2location.io/?key=${apiKey}&format=json`;

        https.get(url, (res) => {
            let data = '';

            // A chunk of data has been received.
            res.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received.
            res.on('end', () => {
                try {
                    const geoData = JSON.parse(data);
                    this.sendSocketNotification("GEOLOCATION_RESULT", geoData);
                } catch (error) {
                    console.error("Failed to parse geolocation data:", error);
                }
            });

        }).on("error", (error) => {
            console.error("Error fetching geolocation:", error);
        });
    }
});