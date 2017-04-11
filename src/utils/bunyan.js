'use strict';

// https://github.com/trentm/node-bunyan

const bunyan = require('bunyan');

let streams = process.env.NODE_ENV === 'local' ?  {
	stream: process.stdout
} : {
	path: './app.log',
};

const logger = bunyan.createLogger({
	name: 'csci4145',
	streams: [streams]
});

logger.audit = function (req) {
	logger.info({
		method: req.method,
		route: req.originalUrl,
		userAgent: req.headers['user-agent'],
		body: req.body,
		params: req.params,
		queries: req.query
	})
};

module.exports = logger;