const bitcoin = require('bitcoinjs-lib')
const bitcoinMessage = require('bitcoinjs-message')
const simpleChain=require('./simpleChain')
const blockchain = simpleChain.getBlockchain()

const TimeoutRequestWindowTime = 5*60*1000; //5*60*1000;

class StarNotary {
    constructor() {
        this.mempool = [];
        this.timeoutRequests = [];
        this.mempoolValid = [];
    }

    async requestValidation(addr) {
        console.log('>>>>>> requestValidation in star-notary - address:', addr)
        let data = this.mempool[addr]
        var timeRemaining
    
        if (data == undefined) {
            data = this.createValidationRequest(addr)
            this.mempool[addr] = data
            this.timeoutRequests[addr] = setTimeout(
                () => this.removeValidationRequest(addr), 
                TimeoutRequestWindowTime);
            timeRemaining = TimeoutRequestWindowTime;
        }
        else {
            const currentTime = Date.now()
            const timeElapsed = currentTime - data['requestTimeStamp'];
            timeRemaining = TimeoutRequestWindowTime - timeElapsed;
        }

        timeRemaining = Math.round(timeRemaining/1000)

        const retData = {
            'address': data['address'],
            'requestTimeStamp': data['requestTimeStamp'],
            'message': data['message'],
            'validationWindow': timeRemaining
        }
        console.log(`${addr} - ${retData}`)
        
        return retData
    }

    async validateSignature(addr, sig) {
        let data = this.mempool[addr]

        console.log('data on mempool:', data)

        var retData

        if (data == undefined) {
            console.log(`Request has expired for address ${addr}`)
            retData = {
                'registerStar': false,
                'status': {
                    'address': addr,
                    'error': 'Request has expired'
                }
            }
            return retData
        }

        console.log('>>>>>> validateSignature address:',addr, 
                ', message:', data['message'],', signature:', sig)

        const validSignature = bitcoinMessage.verify(data['message'], addr, sig)
        console.log(`validSignature: ${validSignature}`)
        var registerStar = false;
        var messageSignature = false;
        if (validSignature) {
            registerStar = true;
            messageSignature = true;
            console.log('Valid signature')
        }
        else {
            console.log('Invalid signature')
        }

        const currentTime = Date.now()
        const timeElapsed = currentTime - data['requestTimeStamp']
        var timeRemaining = TimeoutRequestWindowTime - timeElapsed
        timeRemaining = Math.round(timeRemaining/1000)
        retData = {
            'registerStar': registerStar,
            'status': {
                'address': addr,
                'requestTimeStamp': data['requestTimeStamp'],
                'message': data['message'],
                'validationWindow': timeRemaining,
                'messageSignature': messageSignature
            }
        }
        
        if (registerStar) {
            this.mempoolValid[addr] = retData
        }
    
        return retData
    }

    async addBlock(addr, star) {
        console.log(`addrress:${addr}`)
        console.log(`star:${star}`)

        let body = {
            "address": addr,
            "star": {
                "ra": star.ra,
                "dec": star.dec,
                "story": Buffer(star.story).toString('hex')
                }
        }

        await blockchain.addBlock(new simpleChain.Block(body))
        const height = await blockchain.getBlockHeight()
        const block = await blockchain.getBlock(height)
        return block
    }

    async getBlockByHash(hash) {
        const block = await blockchain.getBlockByHash(hash)
        return block
    }

    async getBlockByAddress(addr) {
        const blocks = await blockchain.getBlockByAddress(addr)
        return blocks
    }

    async getBlock(height) {
        const block = await blockchain.getBlock(height)
        return block
    }

    createValidationRequest(address) {
        const timestamp = Date.now()
        const message = `${address}:${timestamp}:starRegistry`

        const data = {
            address: address,
            message: message,
            requestTimeStamp: timestamp,
        }
        return data;
    }

    removeValidationRequest(addr) {
        console.log('removeValidationRequest')
        this.mempool[addr] = undefined
        this.mempoolValid[addr] = undefined
    }
}

controller = new StarNotary()

function getController() {
    return controller;
}

module.exports = {
    getController: getController
};