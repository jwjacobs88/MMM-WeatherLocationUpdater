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
        console.log(latitude, longitude);
        var weatherModule = MM.getModules().withClass(this.config.weatherModuleName);
        if (weatherModule.length > 0) {
            console.log("Found weather module");
            weatherModule[0].config.lat = latitude;
            weatherModule[0].config.lon = longitude;
            
        // Force the weather module to fetch new data with the updated location
            if (typeof weatherModule[0].updateWeather === "function") {
                weatherModule[0].updateWeather();
            } else if (typeof weatherModule[0].updateAvailable === "function") {
                weatherModule[0].updateAvailable();
            } else {
                Log.error("Weather module does not have an update method.");
                weatherModule[0].updateDom(0);
            }
        } else {
            Log.error("Weather module not found");
        }
    }
});
