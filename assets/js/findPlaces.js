
  function gatherNearbyGooglePlacesFor(searchTerm, key, radius) {



      return new Promise(function(resolve, reject) {

        var places = [];

        url = createGooglePlaceUrl(searchTerm, key, radius);

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


function createGooglePlaceUrl(searchTerm, key, radius) {

  var latitude = localStorage.getItem("latitude");
  var longitude = localStorage.getItem("longitude");

  // Replace spaces with special character for URL only
  var urlSearchTerm = searchTerm.replace(/ /g, "+");
  var keyText = "?key="
  var radiusText = "&radius="; //24140 = 15 miles

  var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

  // populate JSON url with Google key
  url += keyText + key;
  //populate JSON url with radius;
  url += radiusText + radius;
  //populate JSON url with lat/longitude
  url += "&location=" + latitude + "," + longitude;

  // populate JSON url with search term/name of restaurant

  url += "&name=" + urlSearchTerm;

  return url;

}


function getAddressesFor(places) {

// Create array to store x promises from forEach loop

  var promises = []

  places.forEach(function(place) {

    //create promise
    var promise = new Promise(function(resolve, reject) {

        geocodePlaceID(place).then(function(results) {

          let placeLatitude = results[0].geometry.location.lat(function() {
            return a
          });
          let placeLongitude = results[0].geometry.location.lng(function() {
            return a
          });
          place.location = {lat: placeLatitude, lng: placeLongitude};
          place.address = results[0].formatted_address;
          resolve(place);
        })

    })

    // Send promise to promises array
    promises.push(promise);
  })

  // Promise all promises as a gate
  return Promise.all(promises)

}


// Convert a place ID into geocode information
function geocodePlaceID(place) {

  return new Promise(function(resolve, reject) {

    var geocoder = new google.maps.Geocoder;
    var placeId = place.place_id;
    geocoder.geocode({'placeId': placeId}, function(results, status) {
      if (status === 'OK') {
        resolve(results);
      } else {
          setTimeout(function() {
            resolve(geocodePlaceID(place));
          }, 1000)

      }
    });

  })

}
