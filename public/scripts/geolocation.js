const getLocation = () => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/location');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }));
            // Wait a second to make sure the shops are sorted (you better eat the spaghetti I made for you e_e)
            setTimeout(() => window.location.href = '/shops/nearby', 1000);
        }, () => alert('Please allow us to use your location'));
    } else {
        alert('Your browser does not support geolocation');
    }
}
