////////////// Load screen

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("mainContent").style.display = "block";
}


////////// maps

function initMap() {

  var userLatitude = parseFloat(localStorage.getItem("latitude"));
  var userLongitude  = parseFloat(localStorage.getItem("longitude"));
  var userLocation = {lat: userLatitude, lng: userLongitude};
  var chickfilaLocation = chickpotle.chickfila_location;
  var chipotleLocation = chickpotle.chipotle_location;

  var bounds = new google.maps.LatLngBounds();

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: userLocation
  });

// Set the marker for the user position

  var userMarker = new google.maps.Marker({
    position: userLocation,
    map: map,
    title: "Your location"
  });

// Set the chick-fil-a marker

  var chickfilaMarker = new google.maps.Marker({
    position: chickfilaLocation,
    map: map,
    title: "Chick-fil-A"
  });

// Set the chipotle marker

  var chipotleMarker = new google.maps.Marker({
    position: chipotleLocation,
    map: map,
    title: "Chipotle"
  });

// Adjust zoom to all markers

  bounds.extend(userMarker.position);
  bounds.extend(chipotleMarker.position);
  bounds.extend(chickfilaMarker.position);
  map.fitBounds(bounds);


}

//////////// Geolocation

var latitude;
var longitude;

var chickfilas;
var chipotles;
var candidateChickpotles;
var chickpotle;
var test;
var manualAddressEntered;

if (localStorage.getItem("manualAddressEntered") === "true") {
  manualAddressEntered = true;
} else {
  manualAddressEntered = false;
}

// From geolocation.js
// Use HTML5 Geolocation to gather a users location (requires HTTPS) and query
// for nearby restaurant Google Place IDs


var findUserLocation = new Promise(function(resolve, reject) {

  if (manualAddressEntered) {
    latitude = parseFloat(localStorage.getItem("latitude"));
    longitude = parseFloat(localStorage.getItem("longitude"));
    resolve();


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
   localStorage.setItem("latitude", 33.960948);
   localStorage.setItem("longitude", -83.3779358);


    // Declares global variables
    // localStorage.setItem("latitude", position.coords.latitude);
    // localStorage.setItem("longitude", position.coords.longitude);
    resolve();


  }

  function error(error) {
    reject(error);
  }


})

// Setup promise chain so that asynchronous calls complete before the next step
// Try to geolocate user

findUserLocation.then()
  // Redirect user to manualAddress.html
  // ****HOW DOES THIS WORK WITH RESOLVE --> WE WANT TO WAIT UNTIL EITHER RESOLVE OR CATCH EXECUTES BEFORE MOVING TO NEXT STEP
  // Deal with later
  .catch(function() {
    window.location.replace("manualAddress.html");
}).then(function(results) {
  // Gather names and IDs for all nearby Chick-fil-A and Chipotle restaurants
  return Promise.all([
    gatherNearbyGooglePlacesFor("Chick-fil-A"),
    gatherNearbyGooglePlacesFor("Chipotle Mexican Grill")
  ])
}).then(function(results) {
  // Wait until both promises are fulfilled and then assign the place IDs
  // to the appropriate variables
  chickfilas = results[0];
  chipotles = results[1];
}).then(function() {
  // Use the place IDs to query on the addresses; update chickfilas and
  // chipotles objects with appropriate properties
  // Create gate on both JSON requests
  return Promise.all([
    getAddressesFor(chickfilas),
    getAddressesFor(chipotles)
  ])
}).then(function(results) {
  // After gate opens, update chickfilas and chipotles with the latest array
  chickfilas = results[0];
  chipotles = results[1];
}).then(function(results) {
  // Combine chickfilas and chipotles objects into every possible unique
  // combination, where order does not matter
  // Assign results to new candidateChickpotles object and place in array
  candidateChickpotles = cartesianProductOf(chickfilas,chipotles);
}).then(function() {
  // Pass candidateChickpotles objects back to google for directionsService
  // API query
  return reportTravelTimes(candidateChickpotles);
}).then(function(results) {
  // Update candidatesChickpotles objects with duration (of trip) property
  // in seconds
  console.log("Results are in");
  candidateChickpotles = results;
}).then(function() {
  // Send candidatesChickpotle object array (with duration property) to
  // method that analyzes each object and selects the object with the lowest
  // duration
  return selectOptimalChickpotle(candidateChickpotles);
}).then(function(results) {
  // Assigns the winning object to the chickpotle variable
  //available properties are: addresses, IDs, and trip duration (in seconds)

  chickpotle = results[0];

  //document.getElementById("chickadd").innerHTML = chickpotle.chickfila_address;
  //document.getElementById("chipadd").innerHTML = chickpotle.chipotle_address;
  document.getElementById("duration").innerHTML = Math.floor(chickpotle.duration / 60);

  var chickAddress = document.createElement('a');
  chickAddress.textContent = chickpotle.chickfila_address;
  chickAddress.href ='http://maps.google.com/?q='+ chickpotle.chickfila_address;
  document.getElementById('chickadd').appendChild(chickAddress);

  var chipAddress = document.createElement('a');
  chipAddress.textContent = chickpotle.chickfila_address;
  chipAddress.href ='http://maps.google.com/?q='+ chickpotle.chickfila_address;
  document.getElementById('chipadd').appendChild(chipAddress);

  initMap();
  showPage();
  window.localStorage.clear();
})
 console.log(chickpotle)
