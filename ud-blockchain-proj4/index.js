'use strict';

const Hapi=require('hapi');
const starNotary = require('./starNotary');
const controller = starNotary.getController();

const ERROR_NONE = ''
const ERROR_NO_PAYLOAD = 'There is no payload'
const ERROR_NO_ADDRESS = 'There is no address on the payload'
const ERROR_NO_STAR = 'There is no star information on the payload' 

// Create a server with a host and port
const server=Hapi.server({
    host:'localhost',
    port:8000
});

// Web API post endpoint validates request with JSON response
server.route({
	method: 'POST',
	path:'/requestValidation',
	handler:async function(request, h) {
		var checkRes = checkPayload(request);
		if (checkRes != ERROR_NONE) {
			return JSON.stringify('error: ', checkRes);
		}
		
		const addr = request.payload.address
		const data = await controller.requestValidation(addr)
		console.log('Return from controller.requestValidation:', data)
		return JSON.stringify(data)
	}
});

// Web API post endpoint validates message signature with JSON response.
server.route({
	method: 'POST',
	path:'/message-signature/validate',
	handler:async function(request, h) {
		var checkRes = checkPayloadMsg(request);
		if (checkRes != ERROR_NONE) {
			return JSON.stringify('error: ', checkRes);
		}

		const addr = request.payload.address
		const signature = request.payload.signature
		const data = await controller.validateSignature(addr, signature)
		console.log('Return from controller.validateSignature:', data)
		return JSON.stringify(data)
	}
});

// Star registration Endpoint
server.route({
	method: 'POST',
	path:'/block',
	handler:async function(request, h) {
		var checkRes = checkPayloadStar(request);
		if (checkRes != ERROR_NONE) {
			return JSON.stringify('error: ', checkRes);
		}

		const addr = request.payload.address
		const star = request.payload.star
		const data = await controller.addBlock(addr, star)
		console.log('Return from controller.validateSignature:', data)
		return JSON.stringify(data)
	}
});

// Get star block by hash with JSON response.
server.route({
	method: 'GET',
	path:'/stars/hash:{hash}',
	handler:async function(request, h) {
		const hash = request.params.hash
		console.log('/stars/hash:{hash}:', hash)
		const block = await controller.getBlockByHash(hash)	
		return JSON.stringify(block);
	}
});

// Get star block by wallet address (blockchain identity) with JSON response.
server.route({
	method: 'GET',
	path:'/stars/address:{address}',
	handler:async function(request, h) {
		const address = request.params.address
		console.log('/stars/hasaddressh:{address}:', address)
		const blocks = await controller.getBlockByAddress(address)	
		return JSON.stringify(blocks);
	}
});

// Get star block by star block height with JSON response.
server.route({
	method:'GET',
	path:'/block/{height}',
	handler:async function(request, h) {
		const height = request.params.height;
		const block = await controller.getBlock(height)	
		return JSON.stringify(block);
	}
});

function checkPayload(req) {
	var checkRes = ERROR_NONE;

	if (req.payload == undefined) {
		checkRes = ERROR_NO_PAYLOAD
	}
	console.log(req.payload)
	if (req.payload.address == undefined) {
		checkRes += ',' + ERROR_NO_ADDRESS
	}

	return checkRes
}

function checkPayloadMsg(req) {
	var checkRes = ERROR_NONE;

	if (req.payload == undefined) {
		checkRes = ERROR_NO_PAYLOAD
	}

	console.log(req.payload)
	if (req.payload.address == undefined) {
		checkRes +=  ',' + ERROR_NO_ADDRESS
	}

	if (req.payload.signature == undefined) {
		checkRes +=  ',' + ERROR_NO_SIGNATURE
	}

	return checkRes;
}

function checkPayloadStar(req) {
	var checkRes = ERROR_NONE;

	if (req.payload == undefined) {
		checkRes = ERROR_NO_PAYLOAD
	}

	console.log(req.payload)
	if (req.payload.address == undefined) {
		checkRes +=  ',' + ERROR_NO_ADDRESS
	}

	if (req.payload.star == undefined) {
		checkRes +=  ',' + ERROR_NO_STAR
	}

	return checkRes;
}


// Start the server
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();
