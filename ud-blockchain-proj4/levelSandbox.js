/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const starDB = './stardata';
const db = level(starDB);

// Request Validation - To be deleted
// var requestValidation = function (key) {
//   console.log('requestValidation on lavelSandbox - key', key)
//   return new Promise((resolve, reject) => {
//     console.log('Promise in requestValidtion on levelSandbox')
//     db.get(key, function (error, value) {
//       if (value === undefined) {
//         console.log('Undefined error')
//         return reject(new Error('Not found'))
//       } else if (error) {
//         console.log('Unknown error')
//         return reject(error)
//       } else {
//         console.log('db.get succeeded - value: ', value)
//         resolve(value)
//       }
//     })
//   })
// }

// Save new address - To be deleted
// var saveNewAddress = function (key) {
//   console.log('saveNewAddress called')
//   return new Promise((resolve, reject) => {
//     const timestamp = Date.now()
//     const message = `${key}:${timestamp}:starRegistry`
//     const validationWindow = 5 * 60

//     const data = {
//       address: key,
//       message: message,
//       requestTimeStamp: timestamp,
//       validationWindow: validationWindow
//     }
//     console.log('before db.put')
//     db.put(data.address, JSON.stringify(data))
//     resolve(data)
//   })
// }

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
        resolve(JSON.parse(value))
      }
    })
  })
}


var getLevelDBDataByHash = function(blockHash) {
  let block
  
  return new Promise((resolve, reject) => {
    db.createReadStream().on('data', (data) => {    
      block = JSON.parse(data.value) 
      if (block.hash === blockHash) {
        console.log('getLevelDBDataByHash: ', block)
        return resolve(block)
      }
    }).on('error', (error) => {
      return reject(error)
    }).on('close', () => {
      return reject('Not found')
    })
  })
}

var getLevelDBDataByAddress = function(address) {
  const blocks = []
  let block

  return new Promise((resolve, reject) => {
    db.createReadStream().on('data', (data) => {
      block = JSON.parse(data.value)
      if (block.body.address === address) {
        blocks.push(block)
      }
    }).on('error', (error) => {
      return reject(error)
    }).on('close', () => {
      return resolve(blocks)
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
  addLevelDBData: addLevelDBData,
  getLevelDBData: getLevelDBData,
  addDataToLevelDB: addDataToLevelDB,
  getBlockHeight: getBlockHeight,
  getLevelDBDataByHash: getLevelDBDataByHash,
  getLevelDBDataByAddress: getLevelDBDataByAddress
};
