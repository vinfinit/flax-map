const fs = require('fs');
const rp = require('request-promise');
const Promise = require('bluebird');
const jsonfile = require('jsonfile');
const convert = require('xml-js');

const {DATA_SOURCE_PREFIX, DATA_DEST_PREFIX} = require('../config/constants');
const file = `./${DATA_DEST_PREFIX}/belgiumFlax.json`;

const BelgiumKml = fs.readFileSync(`${__dirname}/../${DATA_SOURCE_PREFIX}/2018_vlasvelden_in_vlaanderen.kml`);
const belgium = convert.xml2js(BelgiumKml, {compact: true});

const flaxBelgium = belgium.kml.Document.Placemark.map(
  (placemark, index) => {
    if (placemark.MultiGeometry) {
      return placemark.MultiGeometry.Polygon.map(extractCoordinatesFromPolygon)[0]
    }
    return extractCoordinatesFromPolygon(placemark.Polygon)
})

console.log(flaxBelgium[0]);

function extractCoordinatesFromPolygon(polygon) {
  return polygon.outerBoundaryIs.LinearRing.coordinates._text
    .split(/[\s,]+/)
    .filter(i => i !== '')
    .map(parseFloat)
    .filter((item, index) => (index+1) % 3 !== 0)
    .reduce((acc, item, index) => {
      if (index % 2 === 0) {
        acc.push({lng: item});
      } else {
        acc[parseInt(index/2)].lat = item
      }
      return acc
    }, [])
}

Promise.promisify(jsonfile.writeFile)(file, flaxBelgium)
  .catch(console.error);
