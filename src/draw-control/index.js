const maputil = require('../../util/maputil');
const geometryutil = require('../../util/geometryutil');

module.exports = (map) => {
  function draw(fig) {
    fig.setMap(map)
  }

  function polygon(paths) {
    const fig = new google.maps.Polygon({
      paths,
      fillColor: '#04fbff',
      fillOpacity: 0.4,
      strokeColor: '#02d5ff',
      strokeWeight: 2
    });
    const area = geometryutil.area.polygon(fig);
    const center = geometryutil.center.polygon(fig);
    const infoWindow = maputil.areaPopup(area, center);
    fig.addListener('click', click_handler(fig, area, center, infoWindow));
    return fig
  }

  function click_handler(overlay, area, position, infoWindow) {
    return event => {
      infoWindow.open(map);
      setTimeout(() => infoWindow.close(), 5000)
    }
  }

  return {
    draw,
    polygon
  }
}
