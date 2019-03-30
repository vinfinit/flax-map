const mathutil = require('./mathutil');

function popup(content, position, infoWindow = null) {
  if (!infoWindow) {
    infoWindow = new google.maps.InfoWindow();
  }
  infoWindow.setContent(content);
  infoWindow.setPosition(position);
  return infoWindow
}

function areaPopup(area, position, infoWindow = null) {
  let roundArea = mathutil.precisionRound(area/1000000, 3);
  let contentString = `Area: ${roundArea} km^2`;

  return popup(contentString, position, infoWindow);
}

function distancePopup(distance, position, infoWindow = null) {
  let roundDistance = mathutil.precisionRound(distance/1000, 3);
  let contentString = `Distance: ${roundDistance} km`;

  return popup(contentString, position, infoWindow);
}

module.exports = {
  popup,
  areaPopup,
  distancePopup
}
