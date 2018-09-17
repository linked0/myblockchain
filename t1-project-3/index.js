'use strict';

const Hapi=require('hapi');
const Chain=require('./simpleChain')
const blockchain = Chain.getBlockchain()

// Create a server with a host and port
const server=Hapi.server({
    host:'localhost',
    port:8999
});

// Add the route
server.route({
    method:'GET',
    path:'/hello',
    handler:function(request,h) {

        return 'hello world';
    }
});

// Getting block route
server.route({
	method:'GET',
	path:'/block/{height}',
	handler:async function(request, h) {
		const height = request.params.height;
		const block = await blockchain.getBlock(height)	
		return 'get block:' + JSON.stringify(block);
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
