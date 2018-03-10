module.exports = (map) => {
  let bounds = {
    north: 49.52,
    south: 47.22,
    east: 26.35,
    west: 23.25
  };

  let rectangle = new google.maps.Rectangle({
    bounds: bounds
    , editable: true
    , map: map
    , draggable: true
    , zIndex: 1
  });

  let infoWindow = new google.maps.InfoWindow();

  google.maps.event.addListener(rectangle, 'dragstart', () => {
    google.maps.event.clearListeners(rectangle, 'bounds_changed');
  });

  google.maps.event.addListener(rectangle, 'dragend', () => {
    google.maps.event.addListener(rectangle, 'bounds_changed', bounds_changed_handler);
    bounds_changed_handler();
  });

  google.maps.event.addListener(rectangle, 'bounds_changed', bounds_changed_handler);

  function bounds_changed_handler() {
    let ne = rectangle.getBounds().getNorthEast();
    let sw = rectangle.getBounds().getSouthWest();
    let southWest = new google.maps.LatLng(sw.lat(), sw.lng());
    let northEast = new google.maps.LatLng(ne.lat(), ne.lng());
    let southEast = new google.maps.LatLng(sw.lat(), ne.lng());
    let northWest = new google.maps.LatLng(ne.lat(), sw.lng());

    let contentString =
      'Area: ' + google.maps.geometry.spherical.computeArea([northEast, northWest, southWest, southEast])/1000000 + ' km^2';
    // Set the info window's content and position.
    infoWindow.setContent(contentString);
    infoWindow.setPosition(ne);

    infoWindow.open(map);
  }

  return {
    draw: bounds_changed_handler
  }
}