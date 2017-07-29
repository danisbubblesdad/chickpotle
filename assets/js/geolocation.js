//////////// Geolocation

var chickfilas;
var chipotles;
var candidateChickpotles;
var chickpotle;
var manualAddressEntered;
var googleKey = "AIzaSyDYoGQjMzQNVUCupkIb99CiXB_Qo_CQZYY";
var defaultRadius = 30000;

if (localStorage.getItem("manualAddressEntered") === "true") {
  manualAddressEntered = true;
} else {
  manualAddressEntered = false;
}

// Use HTML5 Geolocation to gather a users location (requires HTTPS) and query
// for nearby restaurant Google Place IDs


var findUserLocation = new Promise(function(resolve, reject) {

  // If user came from manual entry flow, do not ask for geolocation again
  if (manualAddressEntered) {
    success();

  // Otherwise, ask for geolocation
  } else {

    if(!navigator.geolocation) {
      // If user declines geolocation or does not have a capable browser,
      // present manual address form
      reject();

    } else {
      // If browser is geolocation-capable, query for user's current position
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }


  // if successful, inject coordinates into applicable variables
  function success(position) {
    //For manual latlong testing:
   // localStorage.setItem("latitude", 33.960948);
   // localStorage.setItem("longitude", -83.3779358);


    // Declares global variables
    if(!manualAddressEntered) {

      localStorage.setItem("latitude", position.coords.latitude);
      localStorage.setItem("longitude", position.coords.longitude);

    }

    resolve();


  }

  function error(error) {
    reject(error);
  }


})
