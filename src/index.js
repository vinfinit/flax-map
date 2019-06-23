const flaxCluster = require('./flax-cluster');

const {DATA_DEST_PREFIX} = require('../config/constants');

const belarusFlax = require(`../${DATA_DEST_PREFIX}/belarus`);
const franceFlax = require(`../${DATA_DEST_PREFIX}/france`);
const belgiumFlax = require(`../${DATA_DEST_PREFIX}/belgium`);

const belgium2018 = require(`../${DATA_DEST_PREFIX}/2018_vlasvelden_in_vlaanderen.json`);
const belgium2019 = require(`../${DATA_DEST_PREFIX}/2019_vlasvelden_in_vlaanderen.json`);

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
  const customControl = require('./custom-control')(map,
    Control(belgium2018, 'Belgium 2018', '#ef3bff', '#ff0bba'),
    Control(belgium2019, 'Belgium 2019', '#fff064', '#ffd20a')
  );

  function Control(fields, name, color, strokeColor) {
    return {
      name,
      color,
      handler: toggleFields(fields, color, strokeColor)
    }
  }

  function toggleFields(fields, color, strokeColor) {
    let active = false;
    let figList = [];
    return () => {
      if (!active) {
        figList = fields.map(paths => drawControl.polygon({paths, color, strokeColor}));
        figList.map(drawControl.draw);
      } else {
        figList.map(drawControl.unset);
        figList = [];
      }
      return active = !active;
    }
  }
}
