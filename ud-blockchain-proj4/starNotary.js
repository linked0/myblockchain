const leveldb = require('./levelSandbox');
const bitcoinMessage = require('bitcoinjs-message')

const TimeoutRequestWindowTime = 5*60*1000;
const TimeoutMempoolValidWindowTime = 30*60*1000;

class StarNotary {
    constructor() {
        this.mempool = [];
        this.timeoutRequests = [];
        this.mempoolValid = [];
        this.timeoutMempoolValid = [];
    }

    async requestValidation(addr) {
        console.log('>>>>>> requestValidation in star-notary - address:', addr)
        let data = this.mempool[addr]
        console.log("data:", data)
        if (data == undefined) {
            data = this.createValidationRequest(addr)
            this.mempool[addr] = data
            this.timeoutRequests[addr] = setTimeout(
                () => this.removeValidationRequest(addr), 
                TimeoutRequestWindowTime);
        }
        else {
            console.log(`${addr} - ${data}`)
        }
        
        return data
    }

    createValidationRequest(address) {
        const timestamp = Date.now()
        const message = `${address}:${timestamp}:starRegistry`
        const validationWindow = TimeoutRequestWindowTime

        const data = {
            address: address,
            message: message,
            requestTimeStamp: timestamp,
            validationWindow: validationWindow
        }
        return data;
    }

    removeValidationRequest(addr) {
        console.log('removeValidationRequest')
        this.mempool[addr] = undefined
    }
}

controller = new StarNotary()

function getController() {
    return controller;
}

module.exports = {
    getController: getController
};