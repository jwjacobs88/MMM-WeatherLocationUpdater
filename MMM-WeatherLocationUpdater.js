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
        this.sendSocketNotification("FETCH_GEOLOCATION", {
            apiKey: this.config.apiKey
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GEOLOCATION_RESULT") {
            this.updateWeatherModule(payload.latitude, payload.longitude);
        }
    },

    updateWeatherModule: function(latitude, longitude) {
        var weatherModule = MM.getModules().withClass(this.config.weatherModuleName);
        if (weatherModule.length > 0) {
            weatherModule[0].config.lat = latitude;
            weatherModule[0].config.lon = longitude;
            weatherModule[0].updateDom(); // This will refresh the display with the new data
        } else {
            Log.error("Weather module not found");
        }
    }
});
