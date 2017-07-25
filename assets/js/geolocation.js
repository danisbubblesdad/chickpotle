// Use HTML5 Geolocation to gather a users location (requires HTTPS) and query
// for nearby restaurant Google Place IDs


let findUserLocation = new Promise(function(resolve, reject) {


  if(!navigator.geolocation) {


    // If user declines geolocation or does not have a capable browser,
    // present manual address form
    reject(alert('Start path for when user manually inserts address'));


  } else {

    // If browser is geolocation-capable, query for user's current position
    navigator.geolocation.getCurrentPosition(success, error);
  }

  // if successful, inject coordinates into applicable variables
  function success(position) {
    // Declares global variables
    localStorage.setItem("latitude", position.coords.latitude);
    localStorage.setItem("longitude", position.coords.longitude);
    resolve();

     //For manual latlong testing:
    //latitude = 37.663502;
    //longitude = -122.137430;
  }

  function error(error) {
    reject(alert('Unable to geolocate user'));
  }


})
