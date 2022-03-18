const request = require('request');
const { apiKey } = require('./api_key');


const fetchMyIP = function(callback) {
  const url = 'https://api.ipify.org?format=json';
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = JSON.parse(body);
    callback(null, data.ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  const url = `https://api.freegeoip.app/json/${ip}?apikey=${apiKey}`;
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = JSON.parse(body);
    const coordinates = {latitude: data['latitude'], longitude: data['longitude']};
    callback(null, coordinates);
  });
};

const fetchISSFlyOverTimes = function(coordinates, callback) {
  let url = `https://iss-pass.herokuapp.com/json/?lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS fly over time. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = JSON.parse(body).response;
    callback(null, data);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  let IP = 0;
  let coordinates = {};
  fetchMyIP((error, data) => {
    if (error) {
      callback(error, null);
      return;
    }
    IP = data;
    fetchCoordsByIP(IP, (error, data) => {
      if (error) {
        callback(error, null);
        return;
      }
      coordinates = data;
      fetchISSFlyOverTimes(coordinates, (error, data) => {
        if (error) {
          callback(error, null);
          return;
        }
        callback(null, data);
      });
    });
  });
};






module.exports = {fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation};