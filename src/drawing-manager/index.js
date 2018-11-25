const geometryutil = require('../../util/geometryutil');
const mathutil = require('../../util/mathutil');
const maputil = require('../../util/maputil');

module.exports = (map) => {
  let drawingManager = new google.maps.drawing.DrawingManager({
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER
      , drawingModes: ['polygon', 'circle', 'rectangle']
    }
    , circleOptions: overlay_options()
    , polygonOptions: overlay_options()
    , rectangleOptions: overlay_options()
  });
  drawingManager.setMap(map);

  let infoWindow = new google.maps.InfoWindow();

  drawingManager.addListener('polygoncomplete', polygon => {
    const area = geometryutil.area.polygon(polygon);
    const center = geometryutil.center.polygon(polygon);
    const infoWindow = maputil.areaPopup(area, center);
    click_handler(infoWindow)();
    polygon.addListener('click', click_handler(infoWindow))
  });

  drawingManager.addListener('rectanglecomplete', rectangle => {
    const area = geometryutil.area.rectangle(rectangle);
    const center = geometryutil.center.rectangle(rectangle);
    const infoWindow = maputil.areaPopup(area, center);
    click_handler(infoWindow)();
    rectangle.addListener('click', click_handler(infoWindow))
  });

  drawingManager.addListener('circlecomplete', circle => {
    const area = geometryutil.area.circle(circle);
    const center = geometryutil.center.circle(circle);
    const infoWindow = maputil.areaPopup(area, center);
    click_handler(infoWindow)();
    circle.addListener('click', click_handler(infoWindow))
  });

  let curOverlay = null;
  drawingManager.addListener('overlaycomplete', event => {
    curOverlay = event.overlay;
    drawingManager.setOptions({
      drawingMode: null
    })
  });

  document.addEventListener('keydown', event => {
    var KeyID = event.keyCode;
    switch(KeyID) {
      case 8:
      case 46:
        if (curOverlay) {
          curOverlay.setMap(null);
          curOverlay = null;
          infoWindow.close()
        }
        break;
      default:
        break;
    }
  })

  function click_handler(infoWindow) {
    return event => {
      infoWindow.open(map);
      setTimeout(() => infoWindow.close(), 5000)
    }
  }

  function overlay_options() {
    return {
      fillColor: '#04fbff'
      , fillOpacity: 0.4
      , strokeColor: '#02d5ff'
      , strokeWeight: 2
    }
  }
}
