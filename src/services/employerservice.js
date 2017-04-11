'use strict';

const bcrypt = require('bcrypt');
const mongoService = require('./mongoservice');
const id = require('../utils/id');

// https://mongodb.github.io/node-mongodb-native/2.2/api/

/*
Employee Structure:

{
	employeeID: String,
	password: String,
	name: String,
	position: String,
	years: Number,
	salary: Number
}

 */

function getEmployeeCollection() {
	return mongoService.connect().then(function (db) {
		return new Promise(function (resolve, reject) {
			db.collection('employee', function (err, collection) {
				if (err) {
					return reject(err);
				}
				resolve(collection);
			});
		});
	});
}

module.exports = {
	get: function (employeeID) {
		return getEmployeeCollection().then(function (collection) {
			return collection.find({
				employeeID
			}).limit(1).toArray().then(function (arr) {
				return arr[0];
			});
		});
	},

	getFromMongoID: function (_id) {
		return getEmployeeCollection().then(function (collection) {
			return collection.find({
				_id
			}).limit(1).toArray().then(function (arr) {
				return arr[0];
			});
		});
	},

	insert: function (formData) {
		const employee = {
			employeeID: id.getID(),
			password: '',
			name: formData.name,
			position: formData.position,
			years: formData.years,
			salary: formData.salary
		};

		return bcrypt.hash(formData.password, 10).then(function (hash) {
			employee.password = hash;
			return getEmployeeCollection();
		}).then(function (collection) {
			return collection.insertOne(employee);
		});
	},

	authenticate: bcrypt.compare
};
