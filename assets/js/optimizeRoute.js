


function reportTravelTimes(candidateChickpotles) {

  var promises = []



  candidateChickpotles.forEach(function(candidateChickpotle) {
    var chickpotle = {};
    var promise = new Promise(function(resolve, reject) {

      calculateTravelTime(candidateChickpotle, false)
        .then(function(duration) {
          // Returns duration
          chickpotle = {
            "chickfila address": candidateChickpotle[0].address,
            "chickfila place_id": candidateChickpotle[0].place_id,
            "chipotle address": candidateChickpotle[1].address,
            "chipotle place_id": candidateChickpotle[1].place_id,
            duration: duration
          }
          resolve(chickpotle);
        })

    })
    promises.push(promise);
  })

  return Promise.all(promises)

}


function calculateTravelTime(candidateChickpotle, stopoverBoolean) {

    return new Promise(function(resolve, reject) {
      var travelTime;
      let leg1 = candidateChickpotle[0].address;
      let leg2 = candidateChickpotle[1].address;
      let latitude = parseInt(localStorage.getItem("latitude"));
      let longitude = parseInt(localStorage.getItem("longitude"));


      // Instantiate a directions service.
      directionsService = new google.maps.DirectionsService();

      directionsService.route({
        origin: {lat: latitude, lng: longitude},
        destination: {lat: latitude, lng: longitude},
        waypoints: [{
          location: leg1,
          stopover: stopoverBoolean
        }, {
          location: leg2,
          stopover: stopoverBoolean
        }],
        optimizeWaypoints: true,
        travelMode: 'DRIVING'
      }, function(response, status) {
        if (status === 'OK') {
          var route = response.routes[0];
          travelTime = route.legs[0].duration.value;
        }
      }
    ).then(function() {
      resolve(travelTime);
    });

    })


/**
var travelTime;

// Instantiate a directions service.
directionsService = new google.maps.DirectionsService();

directionsService.route({
  origin: {lat: latitude, lng: longitude},
  destination: {lat: latitude, lng: longitude},
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
  if (status === 'OK') {
    var route = response.routes[0];

    if (route.legs[0].duration.value !== undefined) {
        clearInterval(_asyncCheck);
        travelTime = route.legs[0].duration.value;
        travelTimes.push([[travelTime],[leg1],[leg2]]);
        selectOptimalPair(travelTimes);
    }

    }
  }
);
**/


}

function selectOptimalPair(travelTimes) {
  while (travelTimes.length > 1) {
    if (travelTimes[0][0] > travelTimes[1][0]) {
      travelTimes.splice(0, 1);
    } else {
      travelTimes.splice(1, 1);
    }

  }
  console.log("Chickpotle calculated");
  chickpotle = {
    Chickfila: travelTimes[0][1],
    Chipotle: travelTimes[0][2],
    Duration: Math.round(travelTimes[0][0]/60)
  }
}
