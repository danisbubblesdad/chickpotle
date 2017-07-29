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
