////////// maps

function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

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

var homeIcon = {
    url: "assets/img/home_icon.png", // url
    scaledSize: new google.maps.Size(40, 40) // scaled size
};

  var userMarker = new google.maps.Marker({
    position: userLocation,
    map: map,
    icon: homeIcon
  });

// Set the chick-fil-a marker

  var chickfilaIcon = {
      url: "assets/img/chickfila_pin.png", // url
      scaledSize: new google.maps.Size(40, 40) // scaled size
  };

  var chickfilaMarker = new google.maps.Marker({
    position: chickfilaLocation,
    map: map,
    title: "Chick-fil-A",
    icon: chickfilaIcon
  });

  $("#chickfila-results-div").hover(function(){
    chickfilaMarker.setAnimation(google.maps.Animation.BOUNCE);
  }, function() {
    chickfilaMarker.setAnimation(null);
  });

  $("#chipotle-results-div").hover(function(){
    chipotleMarker.setAnimation(google.maps.Animation.BOUNCE);
  }, function() {
    chipotleMarker.setAnimation(null);
  });



  // .hover(function() {
  //
  //
  // }, function() {
  //   chickfilaMarker.setAnimation(null);
  //
  // }),


// Set the chipotle marker

var chipotleIcon = {
    url: "assets/img/chipotle_pin.png", // url
    scaledSize: new google.maps.Size(40, 40) // scaled size
};

  var chipotleMarker = new google.maps.Marker({
    position: chipotleLocation,
    map: map,
    title: "Chipotle",
    icon: chipotleIcon
  });

// Adjust zoom to all markers

  bounds.extend(userMarker.position);
  bounds.extend(chipotleMarker.position);
  bounds.extend(chickfilaMarker.position);
  map.fitBounds(bounds);


}
