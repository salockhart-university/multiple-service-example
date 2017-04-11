'use strict';

const http = require('http');
const express = require('express');
const passport = require('passport');

const bunyan = require('./bunyan');
const token = require('./token');
const request = require('./request');

module.exports = function (dataService, validateDocument, validateErr, idFieldName, transferPath) {

	const router = express.Router();

	function validateLogin(body) {
		return body[idFieldName] && body.password;
	}

	function validateTransfer(body) {
		return body.mortgageID;
	}

	router.post('/', function (req, res) {
		if (!validateDocument(req.body)) {
			return res.status(400).send(validateErr);
		}

		dataService.insert(req.body).then((result) => {
			return dataService.getFromMongoID(result.insertedId);
		}).then((document) => {
			res.status(200).send(document);
		});
	});

	router.post('/login', function (req, res) {
		if (!validateLogin(req.body)) {
			return res.status(400).send(`Bad Request body needs ${idFieldName} and password`);
		}

		dataService.get(req.body[idFieldName]).then(function (doc) {
			if (!doc) {
				return res.sendStatus(401);
			}

			return dataService.authenticate(req.body.password, doc.password).then(function (match) {
				if (!match) {
					return res.sendStatus(401);
				}
				res.status(200).send(token.getToken(doc));
			});
		});
	});

	router.post('/:id/transfer', passport.authenticate('jwt', { session: false }), function (req, res) {
		if (req.user[idFieldName] !== req.params.id) {
			return res.sendStatus(401);
		}

		if (!validateTransfer(req.body)) {
			return res.status(400).send('Bad Request body needs mortgageID');
		}

		dataService.get(req.params.id).then(function (doc) {
			if (!doc) {
				return res.status(400).send(`Bad Request ${idFieldName} does not exist`);
			}

			delete doc._id;
			delete doc.password;

			return request.makeRequest(`/mortgage/${req.body.mortgageID}${transferPath}`, 'PUT', doc, {
				'Authorization': req.header('authorization'),
			});
		}).then(function (data) {
			res.status(200).send(data);
		}).catch(function (err) {
			res.status(400).send(err);
		})
	});

	return router;
};
