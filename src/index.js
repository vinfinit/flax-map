const HashMap = require('hashmap');

const data = require('../data/location.json');

window.initMap = initMap;

function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: {lat: 49, lng: 26}
  });

  let marker_circle_map = new HashMap();
  let markers = [];
  data.forEach(group => {
    group.forEach(data => {
      let marker = new google.maps.Marker({
        position: data.location
        , label: data.label
      });
      marker.addListener('dblclick', () => {
        let circles = marker_circle_map.get(marker);
        if (!circles) {
          let pos = marker.getPosition();
          circles = draw_circle(pos);
          marker_circle_map.set(marker, circles);
        } else {
          circles.forEach(circle => circle.setMap(null));
          marker_circle_map.delete(marker)
        }
      })
      markers.push(marker)
    })
  });

  // Add a marker clusterer to manage the markers.
  const markerCluster = new MarkerClusterer(map, markers,
    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

  var bounds = {
    north: 49.52,
    south: 47.22,
    east: 26.35,
    west: 23.25
  };

// Define a rectangle and set its editable property to true.
  var rectangle = new google.maps.Rectangle({
    bounds: bounds
    , editable: true
    , map: map
    , draggable: true
    , zIndex: 1
  });

  var infoWindow = new google.maps.InfoWindow();

  google.maps.event.addListener(rectangle, 'dragstart', () => {
    google.maps.event.clearListeners(rectangle, 'bounds_changed');
  });

  google.maps.event.addListener(rectangle, 'dragend', () => {
    google.maps.event.addListener(rectangle, 'bounds_changed', bounds_changed_handler);
    bounds_changed_handler();
  });

  google.maps.event.addListener(rectangle, 'bounds_changed', bounds_changed_handler);

  function bounds_changed_handler(event) {
    console.log('bounds_changed');
    var ne = rectangle.getBounds().getNorthEast();
    var sw = rectangle.getBounds().getSouthWest();
    var southWest = new google.maps.LatLng(sw.lat(), sw.lng());
    var northEast = new google.maps.LatLng(ne.lat(), ne.lng());
    var southEast = new google.maps.LatLng(sw.lat(), ne.lng());
    var northWest = new google.maps.LatLng(ne.lat(), sw.lng());

    var contentString =
      'Area: ' + google.maps.geometry.spherical.computeArea([northEast, northWest, southWest, southEast])/1000000 + ' km^2';
    // Set the info window's content and position.
    infoWindow.setContent(contentString);
    infoWindow.setPosition(ne);

    infoWindow.open(map);
  }

  // calculate distance marker
  var cdPos = [ {lat:54.23551080446102, lng: 31.470507812500045}, {lat:53.56230880620559, lng: 23.675585937500045}];

  var lenInfoWindow = new google.maps.InfoWindow();

  var cdMarkerFrom = new google.maps.Marker({
    position: cdPos[0],
    map: map,
    draggable:true,
    label: 'From'
  });

  var cdMarkerTo = new google.maps.Marker({
    position: cdPos[1],
    map: map,
    draggable:true,
    label: 'To'
  });

  var polyLine = new google.maps.Polyline({
    path: cdPos
    , geodesic: true
    , map: map
  });

  google.maps.event.addListener(cdMarkerFrom, 'dragend', () => {
    cdPos[0] = {lat: cdMarkerFrom.position.lat(), lng: cdMarkerFrom.position.lng()};
    draw_line()
  });

  google.maps.event.addListener(cdMarkerTo, 'dragend', () => {
    cdPos[1] = {lat: cdMarkerTo.position.lat(), lng: cdMarkerTo.position.lng()};
    draw_line()
  });
  
  function draw_line() {
    console.log(cdPos[1], cdPos[0])
    var contentString =
      'Distance: ' + google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(cdPos[1])
        , new google.maps.LatLng(cdPos[0]))/1000 + ' km';
    // Set the info window's content and position.
    lenInfoWindow.setContent(contentString);
    lenInfoWindow.setPosition(new google.maps.LatLng(cdPos[1]));
    lenInfoWindow.open(map);

    polyLine.setPath(cdPos)
  }

  const radius = [1, 2, 3, 5, 8, 13, 21, 34];
  function draw_circle(center) {
    let circles = [];
    radius.forEach(r => {
      circles.push(new google.maps.Circle({
        center: center
        , radius: r * 1000
        , map: map
        , strokeColor: '#FF0000'
        , strokeOpacity: 0.8
        , strokeWeight: 2
        , fillOpacity: 0
        , zIndex: 0
      }))
    });
    return circles
  }

  setTimeout(() => {
    bounds_changed_handler()
    draw_line()
  }, 3000)

}