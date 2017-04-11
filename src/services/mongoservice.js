'use strict';

// https://mongodb.github.io/node-mongodb-native/2.2/quick-start/
const MongoClient = require('mongodb').MongoClient;

const bunyan = require('../utils/bunyan');

const url = process.env.MONGO_URL;

MongoClient.connect(url, function(err, db) {
	if (err) {
		bunyan.fatal('fatal error in creating db object');
		throw 'Error getting DB object';
	}
});

module.exports = {
	connect: function () {
		return new Promise(function (resolve, reject) {
			MongoClient.connect(url, function(err, db) {
				if (err) {
					bunyan.fatal('fatal error in creating db object');
					reject('Error getting DB object');
				}
				resolve(db);
			});
		});
	}
};