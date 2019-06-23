const mathutil = require('./mathutil');

function popup(content, position, infoWindow = null, extraContent = '') {
  if (!infoWindow) {
    infoWindow = new google.maps.InfoWindow();
  }
  infoWindow.setContent(content + extraContent);
  infoWindow.setPosition(position);
  return infoWindow
}

function areaPopup(area, position, infoWindow = null, extraContent = '') {
  let roundArea = mathutil.precisionRound(area/10000, 3);
  let contentString = `<p><i>Area</i>: ${roundArea} ha</p>`;

  return popup(contentString, position, infoWindow, extraContent);
}

function distancePopup(distance, position, infoWindow = null, extraContent = '') {
  let roundDistance = mathutil.precisionRound(distance/1000, 3);
  let contentString = `<p><i>Distance</i>: ${roundDistance} km</p>`;

  return popup(contentString, position, infoWindow, extraContent);
}

module.exports = {
  popup,
  areaPopup,
  distancePopup
}
