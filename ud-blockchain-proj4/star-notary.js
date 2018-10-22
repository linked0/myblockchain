const leveldb = require('./levelSandbox');
const bitcoinMessage = require('bitcoinjs-message')

function createData(value) {
    const data = {
        address: address,
        message: message,
        requestTimeStamp: timestamp,
        validationWindow: validationWindow
    }
    return data;
}

async function requestValidation(addr) {
    console.log('requestValidation in star-notary - address:', addr)
    let result
    await leveldb.requestValidation(addr)
      .then((value) => {
        console.log('requestValidation succeeded - value:', value)
        data = JSON.parse(value)
        console.log('requestValidation succeeded - data:', data)
        result = data
      })
      .catch((err) => {
        console.log('Attempting new address')
        const data = leveldb.saveNewAddress(addr)
        data = JSON.parse(data)
        result = data
      })
    return result
}

module.exports = {
	requestValidation: requestValidation,
};