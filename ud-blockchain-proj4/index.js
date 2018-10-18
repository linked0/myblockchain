'use strict';

const Hapi=require('hapi');
const Chain=require('./simpleChain')
const blockchain = Chain.getBlockchain()
const statNotary = require('./star-notary')

// Create a server with a host and port
const server=Hapi.server({
    host:'localhost',
    port:8000
});


// Criteria: Web API post endpoint validates request with JSON response
server.route({
	method:'POST',
	path:'/requestValidation',
	handler:async function(request, h) {
		if (request.payload == undefined) {
			return 'There is no payload\n'
		}
		console.log(request.payload)
		if (request.payload.address == undefined) {
			return 'There is no address on the payload\n'
		}
		const addr = request.payload.address
		return statNotary.requestValidation(addr)
	}
});

// Getting block route
server.route({
	method:'GET',
	path:'/block/{height}',
	handler:async function(request, h) {
		const height = request.params.height;
		const block = await blockchain.getBlock(height)	
		return JSON.stringify(block);
	}
});

// Adding new block
server.route({
	method:'POST',
	path:'/block',
	handler:async function(request, h) {
		if (request.payload == undefined) {
			return 'There is no payload'
		}
		if (request.payload.body == undefined) {
			return 'There is no body on the payload'
		}
		await blockchain.addBlock(new Chain.Block(request.payload.body))
		const height = await blockchain.getBlockHeight()
		const block = await blockchain.getBlock(height)
		return JSON.stringify(block)
	}
});

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
