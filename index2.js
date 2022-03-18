const {nextISSTimesForMyLocation} = require('./iss_promised');
const {printPassTimes} = require('./printPassTime');

nextISSTimesForMyLocation()
  .then((passTime) => {
    printPassTimes(passTime);
  })
  .catch((error) => {
    console.log(`We ran into an issue:`, error.message);
  })