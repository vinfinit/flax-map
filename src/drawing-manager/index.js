const geometryutil = require('../../util/geometryutil');
const mathutil = require('../../util/mathutil');
const maputil = require('../../util/maputil');
const fillPattern = require('../fill-pattern');

module.exports = (map) => {
  let drawingManager = new google.maps.drawing.DrawingManager({
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER
      , drawingModes: ['marker', 'polyline', 'polygon', 'circle', 'rectangle']
    }
    , circleOptions: overlay_options()
    , polygonOptions: overlay_options()
    , rectangleOptions: overlay_options()
  });
  drawingManager.setMap(map);


  drawingManager.addListener('markercomplete', overlay => {
    overlay.addListener('click', click_handler(overlay))
  })

  drawingManager.addListener('polylinecomplete', overlay => {
    const polyPath = geometryutil.polyline.compute(overlay);
    let total = 0;
    polyPath.forEach(i => {
      total += i.distance;
      const infoWindow = maputil.popup(`
        <p><i>Length: </i>${mathutil.precisionRound(i.distance/1000, 3)}km</p>
        <p><i>Total: </i>${mathutil.precisionRound(total/1000 , 3)}km</p>
        `, i.position);
      overlay.addListener('click', click_handler({ overlay, infoWindow }))
    })
  });

  drawingManager.addListener('polygoncomplete', overlay => {
    const area = geometryutil.area.polygon(overlay);
    const center = geometryutil.center.polygon(overlay);
    const {lines, bs} = fillPattern.polylines(overlay.getPath().getArray());
    lines.map(line => line.setMap(map));
    bs.efficientDistance = area / bs.combineSize;
    const infoWindow = maputil.areaPopup(area, center, null, `
      <p><i>Combine size</i>: ${bs.combineSize}</p>
      <p><i>Number of lines</i>: ${bs.calculatedNLines}</p>
      <p><i>Efficient distance</i>: ${mathutil.precisionRound(bs.efficientDistance, 3)} m</p>
      <p><i>Wasted distance</i>: ${mathutil.precisionRound(bs.wastedDistance, 3)} m</p>
      <p><i>Efficiency</i>: ${mathutil.precisionRound(bs.efficientDistance / (bs.efficientDistance + bs.wastedDistance) * 100, 1)}%</p>
      `);
    overlay.addListener('click', click_handler({ overlay, infoWindow }))
  });

  drawingManager.addListener('rectanglecomplete', overlay => {
    const area = geometryutil.area.rectangle(overlay);
    const center = geometryutil.center.rectangle(overlay);
    const infoWindow = maputil.areaPopup(area, center);
    overlay.addListener('click', click_handler({ overlay, infoWindow }))
  });

  drawingManager.addListener('circlecomplete', overlay => {
    const area = geometryutil.area.circle(overlay);
    const center = geometryutil.center.circle(overlay);
    const infoWindow = maputil.areaPopup(area, center);
    overlay.addListener('click', click_handler({ overlay, infoWindow }))
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
          curOverlay = null
        }
        break;
      default:
        break;
    }
  })

  function click_handler({ overlay, infoWindow }) {
    const clHandler = event => {
      curOverlay = overlay;
      if (infoWindow) {
        infoWindow.open(map);
        setTimeout(() => infoWindow.close(), 15000)
      }
    };
    clHandler();
    return clHandler
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
