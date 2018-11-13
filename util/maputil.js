const mathutil = require('./mathutil');

function areaPopup(area, position, infoWindow = null) {
  if (!infoWindow) {
    infoWindow = new google.maps.InfoWindow();
  }
  let convertArea = mathutil.precisionRound(area/1000000, 3);
  let contentString = `Area: ${convertArea} km^2`;
  infoWindow.setContent(contentString);
  infoWindow.setPosition(position);
  return infoWindow
}

module.exports = {
  areaPopup
}
