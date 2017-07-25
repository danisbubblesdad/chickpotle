
  function gatherNearbyGooglePlacesFor(searchTerm) {

      return new Promise(function(resolve, reject) {

        var places = [];
        var latitude = localStorage.getItem("latitude");
        var longitude = localStorage.getItem("longitude");
        // Replace spaces with special character for URL only
        var urlSearchTerm = searchTerm.replace(/ /g, "&nbsp;");
        var nearbySearchURL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyDYoGQjMzQNVUCupkIb99CiXB_Qo_CQZYY&radius=50000';

        //populate JSON url with lat/longitude
        nearbySearchURL += "&location=" + latitude + "," + longitude;

        // populate JSON url with search term/name of restaurant

        nearbySearchURL += "&name=" + urlSearchTerm;

        // Request google place objects using custom nearbySearchURL

        $.get(nearbySearchURL).then(function(googlePlaceObject) {

          // Iterate through each object to extract place_id and
          for(i=0; i<googlePlaceObject.results.length; i++) {
            let result = googlePlaceObject.results[i];
            if (searchTerm == result.name) {
              // create new object
              let place = {name: result.name, place_id: result.place_id}
              // assign object to array
              places.push(place);
            }
          }
        }).then(function() {
          // return the array to the promise
          resolve(places);
        })


      });

  }


function getAddressesFor(places) {

  var promises = []

  for(i=0; i<places.length; i++) {
    var promise = new Promise(function(resolve, reject) {
      let placeDetailsURL = "https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyDYoGQjMzQNVUCupkIb99CiXB_Qo_CQZYY&placeid=";
      let place = places[i];
      placeDetailsURL += place.place_id;
      $.get(placeDetailsURL).then(function(placeDetails) {
        place.address = placeDetails.result.formatted_address;
        resolve(place);
      })
    })
    promises.push(promise);
  }



  return Promise.all(promises);

}




  // function getAddressesFor(places) {
  //   return new Promise(function(resolve, reject) {
  //
  //     var promises = [];
  //
  //     // iterate through each place object and grab ID
  //     for(i=0; i<places.length; i++) {
  //       // setup custom URL
  //       let placeDetailsURL = "https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyDYoGQjMzQNVUCupkIb99CiXB_Qo_CQZYY&placeid=";
  //       // isolate place object from array
  //       let place = places[i];
  //       // pull place_ID from place object and append to custom URL for JSON call
  //       placeDetailsURL += place.place_id;
  //       // Perform JSON call
  //       $.get(placeDetailsURL).then(function(placeDetails) {
  //         // Once JSON call completes, add new address property to object
  //         // assign Google's formatted address to that property
  //         place.address = placeDetails.result.formatted_address;
  //         console.log("Got address for " + place.place_id);
  //       })
  //
  //       resolve(places);
  //     }
  //     // Return the updated array to the promise
  //
  //   })
  // }
