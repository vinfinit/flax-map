const geometryutil = require('../../util/geometryutil');
const mathutil = require('../../util/mathutil');

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
    const center = geometryutil.center.rectangle(rectangle);
    const area = geometryutil.area.rectangle(rectangle);
    const convertArea = mathutil.precisionRound(area/1000000, 3);
    let contentString = `Area: ${convertArea} km^2`;
    infoWindow.setContent(contentString);
    infoWindow.setPosition(center);
    infoWindow.open(map);
  }

  return {
    draw: bounds_changed_handler
  }
}