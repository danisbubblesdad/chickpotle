////////////// Load screen

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("mainContent").style.display = "block";
}

// Setup promise chain so that asynchronous calls complete before the next step
// Try to geolocate user

findUserLocation.then()
  // Redirect user to manualAddress.html
  // ****HOW DOES THIS WORK WITH RESOLVE --> WE WANT TO WAIT UNTIL EITHER RESOLVE OR CATCH EXECUTES BEFORE MOVING TO NEXT STEP
  // Deal with later
  .catch(function() {
    window.location.replace("manualAddress.html");
}).then(function() {
  // Gather names and IDs for all nearby Chick-fil-A and Chipotle restaurants
  return Promise.all([
    gatherNearbyGooglePlacesFor("Chick-fil-A", googleKey, defaultRadius),
    gatherNearbyGooglePlacesFor("Chipotle Mexican Grill", googleKey, defaultRadius)
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
  chipAddress.href ='http://maps.google.com/?q='+ chickpotle.chipotle_address;
  document.getElementById('chipadd').appendChild(chipAddress);

  initMap();
  showPage();
  window.localStorage.clear();
})
