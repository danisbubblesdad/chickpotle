
  // Setup google places URL to access JSON data **placeholder location and name information*****

  function gatherNearbyOptions(userLocation, searchTerm) {

    return new Promise(function(resolve, reject) {

      var addresses = [];
      var latitude = userLocation[0];
      var longitude = userLocation[1];
      var urlSearchTerm = searchTerm.replace(/ /g, "&nbsp;");
      var nearbySearchURL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyDYoGQjMzQNVUCupkIb99CiXB_Qo_CQZYY&radius=20000';


      // Question: Should I be using a prepared statement here?

      //populate JSON url with lat/longitude
      nearbySearchURL += "&location=" + latitude + "," + longitude;

      // populate JSON url with search term/name of restaurant

      nearbySearchURL += "&name=" + urlSearchTerm;

      $.get(nearbySearchURL).then(function(googlePlaceObject) {
        for(i=0; i<googlePlaceObject.results.length; i++) {
          var placeDetailsURL = "https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyDYoGQjMzQNVUCupkIb99CiXB_Qo_CQZYY&placeid=";
          if (searchTerm == googlePlaceObject.results[i].name) {
            placeDetailsURL += googlePlaceObject.results[i].place_id;
            $.get(placeDetailsURL).then(function (placeDetailsObject) {
              addresses.push(placeDetailsObject.result.formatted_address);
            })
          }
        }
      })

      // List of place addresses that met the criteria

      resolve(addresses);
    });

  }

  function searchChickpotle(userLocation) {
    Promise.all([
      gatherNearbyOptions(userLocation, "Chick-fil-A"),
      gatherNearbyOptions(userLocation, "Chipotle Mexican Grill")
    ]).then( function(addresses) {
      return addresses;
    })
  }
