const maputil = require('../../util/maputil');
const geometryutil = require('../../util/geometryutil');

module.exports = (map) => {
  function draw(fig) {
    fig.setMap(map)
  }

  function unset(fig) {
    fig.setMap(null)
  }

  function polygon({
    paths = [],
    color = '#04fbff',
    strokeColor = '#02d5ff'
  } = {}) {
    const fig = new google.maps.Polygon({
      paths,
      fillColor: color,
      fillOpacity: 0.4,
      strokeColor: strokeColor,
      strokeWeight: 2
    });
    const area = geometryutil.area.polygon(fig);
    const center = geometryutil.center.polygon(fig);
    const infoWindow = maputil.areaPopup(area, center);
    fig.addListener('click', click_handler(infoWindow));
    return fig
  }

  function click_handler(infoWindow) {
    return event => {
      infoWindow.open(map);
      setTimeout(() => infoWindow.close(), 5000)
    }
  }

  return {
    draw,
    polygon,
    unset
  }
}
