/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const starDB = './stardata';
const db = level(starDB);

// Request Validation
var requestValidation = function (key) {
  console.log('requestValidation on lavelSandbox')
  return new Promise((resolve, reject) => {
    console.log('Promise in requestValidtion on levelSandbox')
    resolve('hello')
  })
}

// Add data to levelDB with key/value pair
var addLevelDBData = function (key,value) {
  return new Promise((resolve, reject) => {
    db.put(key, value, function(err) {
      if (err) {
        console.log('Block ' + key + ' submission failed', err);
        reject()
      }
    })
    resolve('Added block #' + key)
  })
}

// Get data from levelDB with key
var getLevelDBData = function (key) {
  return new Promise((resolve, reject) => {
    db.get(key, function(err, value) {
      if (err) {
        reject('Not found!', err)
      }
      else {
        console.log('Value = ' + value);
        resolve(value)
      }
    })
  })
}

// Add data to levelDB with value
var addDataToLevelDB = function (value) {
    let i = 0;
    db.createReadStream().on('data', function(data) {
          i++;
        }).on('error', function(err) {
            return console.log('Unable to read data stream!', err)
        }).on('close', function() {
          console.log('Block #' + i);
          addLevelDBData(i, value);
        });
}

// Get block height from levelDB
var getBlockHeight = function () {
  return new Promise((resolve, reject) => {
    let height = -1;
    db.createReadStream()
      .on('data', data => {
        height++;
      })
      .on('error', err => {
        reject(err);
      })
      .on('close', () => {
        resolve(height);
      })
  })
}

module.exports = {
  requestValidation: requestValidation,
  addLevelDBData: addLevelDBData,
  getLevelDBData: getLevelDBData,
  addDataToLevelDB: addDataToLevelDB,
  getBlockHeight: getBlockHeight
};
/* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  * 100 Milliseconds loop = 36,000 blocks per hour                            |
|     (13.89 hours for 500,000 blocks)                                         |
|    Bitcoin blockchain adds 8640 blocks per day                               |
|     ( new block every 10 minutes )                                           |
|  ===========================================================================*/

// (function theLoop (i) {
//   setTimeout(function () {
//     addDataToLevelDB('Testing data');
//     if (--i) theLoop(i);
//   }, 100);
// })(10);
