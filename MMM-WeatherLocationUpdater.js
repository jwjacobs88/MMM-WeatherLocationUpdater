Module.register("MMM-WeatherLocationUpdater", {
    defaults: {
        updateInterval: 10 * 60 * 1000, // 10 minutes
        weatherModuleName: "weather", // Name of the weather module to update
        ip2location_api_key: "",
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
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.sendNotification("GEOLOCATION_UPDATED", {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                error => {
                    Log.error("Geolocation error: " + error.message);
                }
            );
        } else {
            Log.error("Geolocation is not available");
        }
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
