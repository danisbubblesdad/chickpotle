// This displays an address field, using the autocomplete feature
// of the Google Places API to help users fill in the information.

  var placeSearch, autocomplete;

  function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {types: ['geocode']});

    // When the user selects an address from the dropdown, populate the address
    // field in the form and pass the address to getCoordinates function.
    autocomplete.addListener('place_changed', getCoordinates);
  }

// This gets the address from the autocomplete field and converts it to
// latitude/longitude coordinates
  function getCoordinates() {
    var place = autocomplete.getPlace();
    var latitude = place.geometry.location.lat();
    var longitude = place.geometry.location.lng();
    var coords = latitude + ", " + longitude;
    console.log(coords);
    
// Store the coordinates so they can be used by the functions called in main.html
    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);
  }
