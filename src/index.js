const data = require('../data/location.json');

window.initMap = initMap;

function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: {lat: 47.18, lng: 2.21}
  });

  // Create an array of alphabetical characters used to label the markers.
  const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let markers = [];
  data.forEach(group => {
    group.forEach(location => {
      markers.push(new google.maps.Marker({
        position: location.location
        , label: location.label
      }))
    })
  });

  // Add a marker clusterer to manage the markers.
  const markerCluster = new MarkerClusterer(map, markers,
    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}

