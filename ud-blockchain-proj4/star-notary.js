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
      .then(async (value) => {
        console.log('requestValidation succeeded - value:', value)
        data = JSON.parse(value)
        const timestamp = Date.now()
        const timediff = (timestamp - data.requestTimeStamp)/1000
        console.log('difference between timestamp & requestTimeStamp:', timediff)

        if (timediff > 5 * 60) {
            console.log('###### registering with new timestamp after expired')
            await leveldb.saveNewAddress(addr)
                .then((value) => {
                    result = value
                })
        }
        else {
            result = data
        }
      })
      .catch(async (err) => {
        console.log('Attempting new address')
        await leveldb.saveNewAddress(addr)
            .then((value) => {
                console.log('Success of new address saving - value: ', value)
                result = value
            })
      })
    return result
}

module.exports = {
	requestValidation: requestValidation,
};