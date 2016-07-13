chrome.runtime.onMessage.addListener (
    function (request, sender, sendResponse) {

        if (request.command == "getGeo") {

            navigator.geolocation.getCurrentPosition (function (position) {
                sendResponse ( {
                    geoLocation: ({
                          "lat" : position.coords.latitude,
                          "lon": position.coords.longitude
                    })
                } );
            } );
            return true; // Needed because the response is asynchronous
        }
    }
);
