const mathutil = require('../../util/mathutil');
const geometryutil = require('../../util/geometryutil');

const ANGLE_WINDOW = 5;
const COMBINE_SIZE = 2.6; // meters

function polylines(path) {
  const lines = [];
  for (let i = 1; i <= path.length; i++) {
    let [point1, point2] = [path[i-1], i !== path.length ? path[i] : path[0]];
    const k = (point1.lat() - point2.lat()) / (point1.lng() - point2.lng());
    lines.push({
      line: [point1, point2],
      k,
      angle: mathutil.arcTangent(k),
      length: google.maps.geometry.spherical.computeLength([point1, point2])
    });
  }

  // clustering by ANGLE_WINDOW
  const cluster = [];
  for (let i = 0; i < lines.length; i++) {
    cluster.push({lines: [lines[i]]});
    for (let j = 0; j < lines.length; j++) {
      if (i !== j &&
        lines[i].angle - ANGLE_WINDOW <= lines[j].angle &&
        lines[j].angle <= lines[i].angle + ANGLE_WINDOW
      ) {
        cluster[i].lines.push(lines[j]);
      }
    }
    cluster[i].totalLength = cluster[i].lines.reduce((acc, line) => acc + line.length, 0);
  }
  const longestCluster = cluster.reduce(
    (prev, cur) => (prev.totalLength > cur.totalLength) ? prev : cur
  );

  // draw lines
  const baseLine = longestCluster.lines.reduce(
    (prev, cur) => cur.length > prev.length ? cur : prev);
  const otherLines = lines.filter(line => !longestCluster.lines.some(lLine => lLine === line));
  const polygon = wrapPolygon(path);

  return rectLines(polygon.ne, polygon.sw, baseLine.k, otherLines.map(({line}) => line));
}

function rectLines(ne, sw, k = 0, borderLines = []) {
  const rectPath = [
    {lat: ne.lat, lng: ne.lng},
    {lat: ne.lat, lng: sw.lng},
    {lat: sw.lat, lng: sw.lng},
    {lat: sw.lat, lng: ne.lng}
  ];
  const diffLat = ne.lat() - sw.lat();
  const diffLng = ne.lng() - sw.lng();

  let stepLat, stepLng;
  if (k < 0) {
    stepLat = diffLat/100;
    stepLng = -(stepLat/k);
  } else {
    stepLng = diffLng/100;
    stepLat = stepLng*k;
  }
  let [nLat, nLng] = [Math.ceil(diffLat / stepLat), Math.ceil(diffLng / stepLng)];
  for (let i = 1; nLat + nLng > 500; i+=0.1) {
    [stepLat, stepLng] = [i*stepLat, i*stepLng];
    [nLat, nLng] = [Math.ceil(diffLat / stepLat), Math.ceil(diffLng / stepLng)];
  }

  const res = [];
  geometryutil.distance({lat: ne.lat(), lng: ne.lng()}, {lat: ne.lat(), lng: ne.lng()+stepLng});
  const lngStepMeters = geometryutil.distance(
    {lat: ne.lat(), lng: ne.lng()},
    {lat: ne.lat(), lng: ne.lng()+stepLng}); // in meters
  const latStepMeters = geometryutil.distance(
    {lat: ne.lat(), lng: ne.lng()},
    {lat: ne.lat()+stepLat, lng: ne.lng()});
  const kMeters = latStepMeters / lngStepMeters;

  const businessStat = {
    nLines: 0,
    calculatedNLines: 0,
    step: lngStepMeters / Math.sqrt(1+1/Math.pow(kMeters, 2)),
    combineSize: COMBINE_SIZE
  };

  for (let latFlag = 0; latFlag <= 1; latFlag++) {
    for (let i = 0; i <= (latFlag ? nLat : nLng); i++) {
      const line = getLineInRectangle({
        ne,
        sw,
        i,
        k,
        step: (latFlag ? stepLat : stepLng),
        diffLat,
        diffLng,
        isLatStep: latFlag
      }).map(({lat, lng}) => new google.maps.LatLng({lat, lng}));

      const crossLine = intersect(line, borderLines);

      if (crossLine.length == 2) {
        businessStat.nLines++;
        if (i % 10 === 0) {
          const polyLine = new google.maps.Polyline({
            path: crossLine,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
          });

          res.push(polyLine);
        }
      }
    }
  }

  businessStat.calculatedNLines = Math.floor(businessStat.nLines*(businessStat.step/businessStat.combineSize));
  // businessStat.wastedDistance = borderLines
  //   .map(line => geometryutil.distance(line[0], line[1]))
  //   .reduce((a, b) => a + b, 0);
  businessStat.wastedDistance = 52 * businessStat.calculatedNLines;
  return {lines: res, bs: businessStat};
}

function wrapPolygon(path) {
  let [latMax, latMin, lngMax, lngMin] = [0, 90, 0, 180];
  path.forEach(point => {
    latMax = point.lat() > latMax ? point.lat() : latMax;
    latMin = point.lat() < latMin ? point.lat() : latMin;
    lngMax = point.lng() > lngMax ? point.lng() : lngMax;
    lngMin = point.lng() < lngMin ? point.lng() : lngMin;
  });
  return {
    sw: {lat: () => latMin, lng: () => lngMin},
    ne: {lat: () => latMax, lng: () => lngMax}
  }
}

function intersect(line, borderLines) {
  const res = [];
  borderLines.forEach(pathLine => {
    const [x1, y1,
      x2, y2,
      x3, y3,
      x4, y4] = [
        line[0].lat(), line[0].lng(),
        line[1].lat(), line[1].lng(),
        pathLine[0].lat(), pathLine[0].lng(),
        pathLine[1].lat(), pathLine[1].lng()
      ];

    const x12 = x1 - x2;
    const x34 = x3 - x4;
    const y12 = y1 - y2;
    const y34 = y3 - y4;

    const c = x12 * y34 - y12 * x34;

    if (Math.abs(c) === 0) {}
    else {
      const a = x1 * y2 - y1 * x2;
      const b = x3 * y4 - y3 * x4;

      const x = (a * x34 - b * x12) / c;
      const y = (a * y34 - b * y12) / c;

      if (between(x, x1, x2) && between(x, x3, x4) &&
        between(y, y1, y2) && between(y, y3, y4)) {
          res.push({
            lat: x,
            lng: y
          })
        }
    }
  });
  return res;
}

function between(x, x1, x2) {
  return (x1 <= x && x <= x2) || (x1 >= x && x >= x2)
}

function splitPathToLines(path) {
  const lines = [];
  for (let i = 1; i <= path.length; i++) {
    lines.push([path[i-1], i !== path.length ? path[i] : path[0]]);
  }
  return lines;
}

function getLineInRectangle({ne, sw, step, k, i, diffLat, diffLng, isLatStep = true}) {
  if (isLatStep) {
    return [
      {lat: sw.lat() + step*i, lng: sw.lng()},
      {lat: sw.lat() + step*i + k*diffLng, lng: ne.lng()}
    ]
  } else {
    if (k >= 0) {
      return [
        {lat: sw.lat(), lng: sw.lng() + step*i},
        {lat: ne.lat(), lng: sw.lng() + step*i + diffLat/k}
      ]
    }
    else {
      return [
        {lat: ne.lat(), lng: sw.lng() + step*i},
        {lat: sw.lat(), lng: sw.lng() + step*i - diffLat/k}
      ]
    }
  }
}

module.exports = {
  polylines
};
