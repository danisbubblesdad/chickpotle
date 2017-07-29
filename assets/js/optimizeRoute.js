


function reportTravelTimes(candidateChickpotles) {

// Create array to store x promises from forEach loop

  var promises = []

  candidateChickpotles.forEach(function(candidateChickpotle) {
    //instaniate chickpotle object

    var chickpotle = {};

    //create promise
    var promise = new Promise(function(resolve, reject) {

    // send the individual candidateChickpotle object to the calculateTravelTime
    // method with the false boolean
    calculateTravelTime(candidateChickpotle, false)
      .then(function(duration) {
        // Once the JSON pull has processed, create chickpotle object
        // using data from candidateChickpotle object and trip duration
        // gathered from API pull
        chickpotle = {
          chickfila_address: candidateChickpotle[0].address,
          chickfila_place_id: candidateChickpotle[0].place_id,
          chickfila_location: candidateChickpotle[0].location,
          chipotle_address: candidateChickpotle[1].address,
          chipotle_place_id: candidateChickpotle[1].place_id,
          chipotle_location: candidateChickpotle[1].location,
          duration: duration
        }

        // Send resolve back to promise
        resolve(chickpotle);
      })

    })

    // Send promise to promises array
    promises.push(promise);
  })

  // Promise all promises as a gate
  return Promise.all(promises)

}


function calculateTravelTime(candidateChickpotle, stopoverBoolean) {



  return new Promise(function(resolve, reject) {

    var duration;
    let leg1 = candidateChickpotle[0].location;
    let leg2 = candidateChickpotle[1].location;

    let userLatitude = parseFloat(localStorage.getItem("latitude"));
    let userLongitude = parseFloat(localStorage.getItem("longitude"));


    // Instantiate a directions service.
    directionsService = new google.maps.DirectionsService();

    // Provide lat/long data from localStorage as well as information from
    // candidateChickpotle

    directionsService.route({
      origin: {lat: userLatitude, lng: userLongitude},
      destination: {lat: userLatitude, lng: userLongitude},
      waypoints: [{
        location: leg1,
        stopover: stopoverBoolean
      },{
        location: leg2,
        stopover: stopoverBoolean
      }],
      optimizeWaypoints: true,
      travelMode: 'DRIVING'
    }, function(response, status) {
      // This is the "OK" callback from the Google API
      if (status === 'OK') {


        var route = response.routes[0];
        // Trip duration is grabbed from the response
        duration = route.legs[0].duration.value;
        // Fulfill promise with travelTime (AKA trip duration)
        resolve(duration);
      } else {
        // If "OK" callback not received, try again
        setTimeout(function() {
          resolve(calculateTravelTime(candidateChickpotle, stopoverBoolean));
        }, 5)
      }
    }
    );
  })
}

function selectOptimalChickpotle(candidateChickpotles) {

  return new Promise(function(resolve, reject) {

    // Execute loop if candidate array is longer than 1 object

    while (candidateChickpotles.length > 1) {

      // Find the highest duration value between the 0 index and the 1 index
      if (candidateChickpotles[0].duration > candidateChickpotles[1].duration) {
        // If 0 index is higher, remove the corresponding object from the array
        candidateChickpotles.splice(0,1);
      } else {
        // Otherwise, remove the 1 index object from the array
        candidateChickpotles.splice(1,1);
      }
    }

    // fulfill promise

    resolve(candidateChickpotles);
  })


}
