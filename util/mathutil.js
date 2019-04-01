function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

function arcTangent(x) {
  return Math.atan(x) * 180 / Math.PI;
}

module.exports = {
  precisionRound,
  arcTangent
}
