const leveldb = require('./levelSandbox');
const bitcoinMessage = require('bitcoinjs-message')

function requestValidation(addr) {
    return 'check request: ' + addr + '\n'
}

module.exports = {
	requestValidation: requestValidation,
};