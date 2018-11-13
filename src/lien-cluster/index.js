const HashMap = require('hashmap');

const {DATA_DEST_PREFIX} = require('../../config/constants');
const data = require(`../../${DATA_DEST_PREFIX}/belarus`);

module.exports = (map) => {
  let marker_circle_map = new HashMap();
  let markers = [];
  data.forEach(group => {
    group.forEach(data => {
      let marker = new google.maps.Marker({
        position: data.location
        , label: data.name
      });

      marker.addListener('dblclick', marker_onclick(marker));
      markers.push(marker)
    })
  });

  // Add a marker clusterer to manage the markers.
  const markerCluster = new MarkerClusterer(map, markers,
    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

  function marker_onclick(marker) {
    return (event) => {
      let circles = marker_circle_map.get(marker);
      if (!circles) {
        let pos = marker.getPosition();
        let keys = Object.keys(event);
        let mouseEventName = keys.find(key => event[key] instanceof MouseEvent);
        if (mouseEventName) {
          circles = draw_circle(pos, event[mouseEventName].altKey);
        } else {
          circles = draw_circle(pos);
        }
        marker_circle_map.set(marker, circles);
      } else {
        circles.forEach(circle => circle.setMap(null));
        marker_circle_map.delete(marker)
      }
    }
  }

  const radius = [1, 2, 3, 5, 8, 13, 21, 34];
  function draw_circle(center, withNetwork=true) {
    let circles = [];
    let network = [];

    radius.forEach(r => {
      circles.push(new google.maps.Circle({
        center: center
        , radius: r * 1000
        , map: map
        , strokeColor: '#FF0000'
        , strokeOpacity: 0.8
        , strokeWeight: 2
        , fillOpacity: 0
        , zIndex: 0
      }))
    });

    if (withNetwork) {
      let maxRadius = radius[radius.length - 1];
      let maxCircle = circles[circles.length - 1];

      const bounds = maxCircle.getBounds();
      const southWest = bounds.getSouthWest();
      const northEast = bounds.getNorthEast();
      const numberOfParts = maxRadius*2;

      const tileWidth = (northEast.lng() - southWest.lng()) / numberOfParts;
      const tileHeight = (northEast.lat() - southWest.lat()) / numberOfParts;

      for (let x = 0; x < numberOfParts; x++) {
        for (let y = 0; y < numberOfParts; y++) {
          const areaBounds = {
            north: southWest.lat() + (tileHeight * (y+1))
            , south: southWest.lat() + (tileHeight * y)
            , east: southWest.lng() + (tileWidth * (x+1))
            , west: southWest.lng() + (tileWidth * x)
          };

          const area = new google.maps.Rectangle({
            strokeColor: '#04fbff'
            , strokeWeight: 1
            , map: map
            , bounds: areaBounds
            , fillOpacity: 0
          });
          network.push(area)
        }
      }
    }

    return circles.concat(network)
  }

  return markerCluster
}
