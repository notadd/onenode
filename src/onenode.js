'use strict';

const fastify = require('fastify');

const target = fastify({
	logger: true
});

target.get('/', (request, reply) => {
	reply.send('hello world');
});

const proxy = fastify({
	logger: true
});

proxy.register(require('fastify-reply-from'), {
	base: 'http://localhost:3001/',
	undici: {
		connections: 100,
		pipelining: 10
	}
});

proxy.get('/', (request, reply) => {
	reply.from('/');
});

target.listen(3001, err => {
	if (err) {
		throw err;
	}

	proxy.listen(3000, err => {
		if (err) {
			throw err;
		}
	});
});
