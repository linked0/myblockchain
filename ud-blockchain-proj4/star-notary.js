const leveldb = require('./levelSandbox');
const bitcoinMessage = require('bitcoinjs-message')

async function requestValidation(addr) {
    console.log('requestValidation in star-notary')
    let result = ''
    await leveldb.requestValidation(addr)
      .then((res) => {
          result = res
          console.log(res)
      })
    return result
}

module.exports = {
	requestValidation: requestValidation,
};