'use strict';

const Hapi=require('hapi');
const Chain=require('./simpleChain')
const blockchain = Chain.getBlockchain()

// Create a server with a host and port
const server=Hapi.server({
    host:'localhost',
    port:8000
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
