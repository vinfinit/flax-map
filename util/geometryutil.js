let area = Object.create(null);

area.circle = circle => {
  const radius = circle.getRadius();
  return Math.PI*radius*radius
}

area.rectangle = rectangle => {
  let ne = rectangle.getBounds().getNorthEast();
  let sw = rectangle.getBounds().getSouthWest();

  let southWest = new google.maps.LatLng(sw.lat(), sw.lng());
  let northEast = new google.maps.LatLng(ne.lat(), ne.lng());
  let southEast = new google.maps.LatLng(sw.lat(), ne.lng());
  let northWest = new google.maps.LatLng(ne.lat(), sw.lng());

  return google.maps.geometry.spherical.computeArea([northEast, northWest, southWest, southEast])
}

area.polygon = polygon => {
  return google.maps.geometry.spherical.computeArea(polygon.getPath())
}

let center = Object.create(null);

center.circle = circle => {
  return circle.center
}

center.rectangle = rectangle => {
  let bounds = rectangle.getBounds();
  return bounds.getCenter()
}

center.polygon = polygon => {
  let bounds = new google.maps.LatLngBounds();
  polygon.getPath().forEach((path, index) => {
    bounds.extend(path)
  });
  return bounds.getCenter()
}

module.exports = {area, center}