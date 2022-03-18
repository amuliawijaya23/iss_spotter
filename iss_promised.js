const request = require('request-promise-native');
const apiKey = require('./api_key');

const fetchMyIP = () => request('https://api.ipify.org?format=json');

const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`https://freegeoip.app/json/${ip}`);
};

const fetchISSFlyOverTimes = function(body) {
  const data = JSON.parse(body);
  const coordinates = {latitude: data.latitude, longitude: data.longitude};
  const url = `http://api.open-notify.org/iss-pass.json?lat=${data.latitude}&lon=${data.longitude}`;
  return request(url);
};

const nextISSTimesForMyLocation = function (callback) {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const response = JSON.parse(data).response
      return response;
    });
};
module.exports = {nextISSTimesForMyLocation};