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
    // fields in the form.
    autocomplete.addListener('place_changed', getCoordinates);
  }

  function getCoordinates() {
    var place = autocomplete.getPlace();
    var latitude = place.geometry.location.lat();
    var longitude = place.geometry.location.lng();

    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);
  }