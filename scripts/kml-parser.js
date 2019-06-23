const fs = require('fs');
const rp = require('request-promise');
const Promise = require('bluebird');
const jsonfile = require('jsonfile');
const convert = require('xml-js');

const {DATA_SOURCE_PREFIX, DATA_DEST_PREFIX} = require('../config/constants');

const kmlList = [
  '2018_vlasvelden_in_vlaanderen',
  '2019_vlasvelden_in_vlaanderen'
];

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

const parseKml = (kml) => {
  const parsedKml = convert.xml2js(kml, {compact: true});

  const parsedJson = parsedKml.kml.Document.Placemark.map(
    (placemark, index) => {
      if (placemark.MultiGeometry) {
        return placemark.MultiGeometry.Polygon.map(extractCoordinatesFromPolygon)[0]
      }
      return extractCoordinatesFromPolygon(placemark.Polygon)
  });

  return parsedJson;
}

kmlList.map(kmlName => {
  const inputFile = `./${DATA_SOURCE_PREFIX}/${kmlName}.kml`;
  const outputFile = `./${DATA_DEST_PREFIX}/${kmlName}.json`;
  Promise.promisify(fs.readFile)(inputFile)
    .then(parseKml)
    .then(data => Promise.promisify(jsonfile.writeFile)(outputFile, data))
    .then(() => console.log(`Success! File ${outputFile} created.`))
    .catch(console.error);
})
