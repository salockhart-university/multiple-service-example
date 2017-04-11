'use strict';

const mongoService = require('./mongoservice');
const id = require('../utils/id');

// https://mongodb.github.io/node-mongodb-native/2.2/api/

/*
Mortgage Structure:

{
	mortgageID: String,
	name: String,
	address: String,
	phone: String,
	employer: {
		name: String,
		info: {
			name: String,
			position: String,
			years: Number,
			salary: Number
		}
	},
	insurance: {
		name: String,
		info: {
			policyID: String,
			value: Number
		}
	}
}

 */

function getMortgageCollection() {
	return mongoService.connect().then(function (db) {
		return new Promise(function (resolve, reject) {
			db.collection('mortgage', function (err, collection) {
				if (err) {
					return reject(err);
				}
				resolve(collection);
			});
		});
	});
}

module.exports = {
	getMortgage: function (mortgageID) {
		return getMortgageCollection().then(function (collection) {
			return collection.find({
				mortgageID
			}).limit(1).toArray().then(function (arr) {
				return arr[0];
			});
		});
	},

	getMortgageFromMongoID: function (_id) {
		return getMortgageCollection().then(function (collection) {
			return collection.find({
				_id
			}).limit(1).toArray().then(function (arr) {
				return arr[0];
			});
		});
	},

	insertMortgage: function (formData) {
		const mortgage = {
			mortgageID: id.getID(),
			name: formData.name,
			address: formData.address,
			phone: formData.phone,
			employer: {
				name: formData.employer,
				info: null
			},
			insurance: {
				name: formData.insurance,
				info: null
			}
		};

		return getMortgageCollection().then(function (collection) {
			return collection.insertOne(mortgage);
		});
	},

	updateEmployerInfo: function (mortgageID, employerInfo) {
		return getMortgageCollection().then(function (collection) {
			return collection.findOneAndUpdate({
				mortgageID
			}, {
				$set: {
					'employer.info': employerInfo
				}
			}, {
				returnOriginal: false
			});
		});
	},

	updateInsuranceInfo: function (mortgageID, insuranceInfo) {
		return getMortgageCollection().then(function (collection) {
			return collection.findOneAndUpdate({
				mortgageID
			}, {
				$set: {
					'insurance.info': insuranceInfo
				}
			}, {
				returnOriginal: false
			});
		});
	}
};
