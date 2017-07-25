
  function gatherNearbyGooglePlacesFor(searchTerm) {

      return new Promise(function(resolve, reject) {

        var places = [];
        var latitude = localStorage.getItem("latitude");
        var longitude = localStorage.getItem("longitude");
        // Replace spaces with special character for URL only
        var urlSearchTerm = searchTerm.replace(/ /g, "&nbsp;");
        var key = "?key=AIzaSyDYoGQjMzQNVUCupkIb99CiXB_Qo_CQZYY";
        var radius = "&radius=32187"; // radius is set to 20 miles

        var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

        // populate JSON url with Google key
        url += key;
        //populate JSON url with radius;
        url += radius;
        //populate JSON url with lat/longitude
        url += "&location=" + latitude + "," + longitude;

        // populate JSON url with search term/name of restaurant

        url += "&name=" + urlSearchTerm;

        // Request google place objects using custom url

        $.get(url).then(function(googlePlaceObject) {

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
  // create promises array for looped promises
  var promises = []

  // loop through each place object, create a promise
  for(i=0; i<places.length; i++) {
    var promise = new Promise(function(resolve, reject) {
      // append place ID to URL for JSON request
      let placeDetailsURL = "https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyDYoGQjMzQNVUCupkIb99CiXB_Qo_CQZYY&placeid=";
      let place = places[i];
      placeDetailsURL += place.place_id;

      // Execute JSON pull
      $.get(placeDetailsURL).then(function(placeDetails) {
        // Once pull is complete, assign address property object
        place.address = placeDetails.result.formatted_address;
        place.location = placeDetails.result.geometry.location;
        // resolve promise
        resolve(place);
      })
    })

    // add looped promise to array
    promises.push(promise);
  }

  // Run all promises as gate
  return Promise.all(promises);

}
