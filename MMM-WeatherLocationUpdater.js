Module.register("MMM-WeatherLocationUpdater", {
    defaults: {
        updateInterval: 10 * 60 * 1000, // 10 minutes
        weatherModuleName: "weather", // Name of the weather module to update
        apiKey: "",
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.scheduleGeoUpdate();
    },

    scheduleGeoUpdate: function() {
        this.updateGeoLocation();
        setInterval(() => {
            this.updateGeoLocation();
        }, this.config.updateInterval);
    },

    updateGeoLocation: function() {
        var url = `https://api.ip2location.io/?key=${this.config.apiKey}&format=json`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.latitude && data.longitude) {
                    this.sendNotification("GEOLOCATION_UPDATED", {
                        latitude: data.latitude,
                        longitude: data.longitude
                    });
                } else {
                    Log.error("Failed to retrieve geolocation from IP");
                }
            })
            .catch(error => {
                Log.error("Error fetching geolocation: " + error.message);
            });
    },

    notificationReceived: function(notification, payload, sender) {
        if (notification === "GEOLOCATION_UPDATED") {
            this.updateWeatherModule(payload.latitude, payload.longitude);
        }
    },

    updateWeatherModule: function(latitude, longitude) {
        var weatherModule = MM.getModules().withClass(this.config.weatherModuleName);
        if (weatherModule.length > 0) {
            weatherModule[0].updateConfig({
                lat: latitude,
                lon: longitude
            });
            weatherModule[0].start(); // Restart the weather module to apply new coordinates
        } else {
            Log.error("Weather module not found");
        }
    }
});
