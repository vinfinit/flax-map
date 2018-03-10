window.initMap = initMap;

function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: {lat: 49, lng: 26}
  });

  const drawingManager = require('./drawing-manager')(map);
  const lienCluster = require('./lien-cluster')(map);
  const distanceLine = require('./distance-line')(map);
  const dragRectangle = require('./drag-rectangle')(map);

  setTimeout(() => {
    dragRectangle.draw();
    distanceLine.draw()
  }, 3000)
}