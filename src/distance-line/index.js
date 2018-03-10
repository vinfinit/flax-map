module.exports = (map) => {
  var cdPos = [ 
    {lat:54.23551080446102, lng: 31.470507812500045}
    , {lat:53.56230880620559, lng: 23.675585937500045}
  ];
  var infoWindow = new google.maps.InfoWindow();

  var cdMarkerFrom = new google.maps.Marker({
    position: cdPos[0]
    , map: map
    , draggable: true
    , label: 'From'
  });

  var cdMarkerTo = new google.maps.Marker({
    position: cdPos[1]
    , map: map
    , draggable: true
    , label: 'To'
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
    infoWindow.setContent(contentString);
    infoWindow.setPosition(new google.maps.LatLng(cdPos[1]));
    infoWindow.open(map);

    polyLine.setPath(cdPos)
  }

  return {
    draw: draw_line
  }
}