
  function gatherNearbyGooglePlacesFor(searchTerm, key, radius) {
      //return new Promise(function(resolve, reject) {





        // Request google place objects using custom url


        let promises = []

        while(radius > 3000) {

          let url = createGooglePlaceUrl(searchTerm, key, radius);
          radius /= 2;


          let promise = new Promise(function(resolve, reject) {


            resolve(getJsonQuery(url, searchTerm));

          })

          promises.push(promise);

        }


        console.log(promises)

        return Promise.all(promises);

      //});

  }

  function getJsonQuery(url, searchTerm){


    return new Promise(function(resolve, reject) {

      let places = [];
      $.get(url).then(function(googlePlaceObject) {

        // Iterate through each object to extract place_id
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
        resolve(places);
      })


    })

  }


function createGooglePlaceUrl(searchTerm, key, radius) {

  const latitude = localStorage.getItem("latitude");
  const longitude = localStorage.getItem("longitude");

  // Replace spaces with special character for URL only
  let urlSearchTerm = searchTerm.replace(/ /g, "+");
  const keyText = "?key="
  const radiusText = "&radius="; //24140 = 15 miles

  let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

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

  let promises = []

  places.forEach(function(place) {

    //create promise
    let promise = new Promise(function(resolve, reject) {

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

    let geocoder = new google.maps.Geocoder;
    let placeId = place.place_id;
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
