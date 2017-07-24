


function reportTravelTimes(latitude, longitude, routingScenarios) {


  // hash with pair and travel time

  var key;
  var value;
  // var travelTimes = {};
  var travelTimes=[];

  // iterate over each routingScenario sub-array

  for (i=0;i<routingScenarios.length;i++) {
    calculateTravelTime(latitude, longitude, routingScenarios[i][0],
                        routingScenarios[i][1], travelTimes);
  }
}


function calculateTravelTime(latitude, longitude, leg1, leg2, travelTimes) {


  var travelTime;

  // Instantiate a directions service.
  directionsService = new google.maps.DirectionsService();

  directionsService.route({
    origin: {lat: latitude, lng: longitude},
    destination: {lat: latitude, lng: longitude},
    waypoints: [{
      location: leg1,
      stopover: false
    },{
      location: leg2,
      stopover: false
    }],
    optimizeWaypoints: true,
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status === 'OK') {
      var route = response.routes[0];

      var _asyncCheck = setInterval(function() {
          if (route.legs[0].duration.value !== undefined) {
              clearInterval(_asyncCheck);
              travelTime = route.legs[0].duration.value;
              travelTimes.push([[travelTime],[leg1],[leg2]]);
              selectOptimalPair(travelTimes);
          }
      }, 3000); // interval set at 3000 milliseconds
      }
    }
  );
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
