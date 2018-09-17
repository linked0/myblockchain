'use strict';

const Hapi=require('hapi');
#const SimpleChain=require('simpleChain')

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
	handler:function(request, h) {
		const height = request.params.height;
		return 'get block:' + height;
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
