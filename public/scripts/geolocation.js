function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/location");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }));
            window.location.href = '/shops/nearby';
        });
    } else {
        // Couldn't get location
    }
}
