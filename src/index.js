const flaxCluster = require('./flax-cluster');

const {DATA_DEST_PREFIX} = require('../config/constants');

const belarusFlax = require(`../${DATA_DEST_PREFIX}/belarus`);
const franceFlax = require(`../${DATA_DEST_PREFIX}/france`);
const belgiumFlax = require(`../${DATA_DEST_PREFIX}/belgium`);

const belgiumFlaxFields = require(`../${DATA_DEST_PREFIX}/belgiumFlax.json`);

window.initMap = initMap;

function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: {lat: 49, lng: 26}
  });

  const drawControl = require('./draw-control')(map);
  const drawingPane = require('./drawing-manager')(map);
  const belaruxFlaxCluster = flaxCluster(map, belarusFlax);
  const franceFlaxCluster = flaxCluster(map, franceFlax);
  const belgiumFlaxCluster = flaxCluster(map, belgiumFlax);
  // const distanceLine = require('./distance-line')(map);
  // const dragRectangle = require('./drag-rectangle')(map);

  setTimeout(() => {
    // dragRectangle.draw();
    // distanceLine.draw();
    belgiumFlaxFields.map(drawControl.polygon).map(drawControl.draw)
  }, 3000)
}
