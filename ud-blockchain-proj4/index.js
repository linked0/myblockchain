'use strict';

const Hapi=require('hapi');
const starNotary = require('./starNotary');
const controller = starNotary.getController();

// Create a server with a host and port
const server=Hapi.server({
    host:'localhost',
    port:8000
});

// Criteria: Web API post endpoint validates request with JSON response
server.route({
	method: 'POST',
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
		const data = await controller.requestValidation(addr)
		console.log('Return from controller.requestValidation:', data)
		return JSON.stringify(data)
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
