'use strict';

const bcrypt = require('bcrypt');
const mongoService = require('./mongoservice');
const id = require('../utils/id');

// https://mongodb.github.io/node-mongodb-native/2.2/api/

/*
Insurance Structure:

{
	policyID: String,
	password: String,
	value: Number
}

 */

function getInsuranceCollection() {
	return mongoService.connect().then(function (db) {
		return new Promise(function (resolve, reject) {
			db.collection('insurance', function (err, collection) {
				if (err) {
					return reject(err);
				}
				resolve(collection);
			});
		});
	});
}

module.exports = {
	get: function (policyID) {
		return getInsuranceCollection().then(function (collection) {
			return collection.find({
				policyID
			}).limit(1).toArray().then(function (arr) {
				return arr[0];
			});
		});
	},

	getFromMongoID: function (_id) {
		return getInsuranceCollection().then(function (collection) {
			return collection.find({
				_id
			}).limit(1).toArray().then(function (arr) {
				return arr[0];
			});
		});
	},

	insert: function (formData) {
		const policy = {
			policyID: id.getID(),
			password: '',
			value: formData.value
		};
		return bcrypt.hash(formData.password, 10).then(function (hash) {
			policy.password = hash;
			return getInsuranceCollection();
		}).then(function (collection) {
			return collection.insertOne(policy);
		});
	},

	authenticate: bcrypt.compare
};
