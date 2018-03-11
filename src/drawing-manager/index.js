const geometryutil = require('../../util/geometryutil');
const mathutil = require('../../util/mathutil');

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
    area_info(area, center);
    polygon.addListener('click', click_handler(polygon, area, center))
  });

  drawingManager.addListener('rectanglecomplete', rectangle => {
    const area = geometryutil.area.rectangle(rectangle);
    const center = geometryutil.center.rectangle(rectangle);
    area_info(area, center);
    rectangle.addListener('click', click_handler(rectangle, area, center))
  });

  drawingManager.addListener('circlecomplete', circle => {
    const area = geometryutil.area.circle(circle);
    const center = geometryutil.center.circle(circle);
    area_info(area, center);
    circle.addListener('click', click_handler(circle, area, center))
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

  function click_handler(overlay, area, position) {
    return event => {
      curOverlay = overlay;
      area_info(area, position)
    }
  }

  function area_info(area, position) {
    let convertArea = mathutil.precisionRound(area/1000000, 3);
    let contentString = `Area: ${convertArea} km^2`;
    infoWindow.setContent(contentString);
    infoWindow.setPosition(position);
    infoWindow.open(map);
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