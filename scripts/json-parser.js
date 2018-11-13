const rp = require('request-promise');
const Promise = require('bluebird');
const jsonfile = require('jsonfile');

const {DATA_SOURCE_PREFIX, DATA_DEST_PREFIX} = require('../config/constants');
const mapsConfig = require('../config/maps-googleapis');

const args = process.argv.slice(2);

function geocode(flaxCenter) {
  const uri = encodeURIComponent(flaxCenter.name);
  if (flaxCenter.lat && flaxCenter.lng) {
    flaxCenter.location = {lat: flaxCenter.lat, lng: flaxCenter.lng};
    delete flaxCenter.lat;
    delete flaxCenter.lng;
    return Promise.resolve(flaxCenter)
  }
  return rp({
    uri: `https://maps.googleapis.com/maps/api/geocode/json?address=${uri}&key=${mapsConfig.apiKey}`
    , json: true
  })
    .then(data => {
      if (data.status !== 'OK') {
        return Promise.reject(new Error(`${data.status} - ${data.error_message}`))
      }
      flaxCenter.location = data.results[0].geometry.location
    })
    .return(flaxCenter)
}

function transformJsonToMapData(json) {
  return Promise.map(json, flaxCenter => {
    if (!flaxCenter.branch) {
      flaxCenter.branch = [Object.assign({}, flaxCenter)];
    }
    return Promise.map(flaxCenter.branch, geocode)
  })
}

function toRelativePath(name, prefix = DATA_DEST_PREFIX) {
  return `${__dirname}/../${prefix}/${name}`
}

return Promise.map(args, arg => {
  const sourcePath = toRelativePath(arg, DATA_SOURCE_PREFIX);
  const distPath = toRelativePath(arg, DATA_DEST_PREFIX);
  const mapData = require(sourcePath);
  return transformJsonToMapData(mapData)
    .then(json => jsonfile.writeFile(distPath, json))
})
  .catch(console.error);
