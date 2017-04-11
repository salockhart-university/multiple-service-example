'use strict';

const express = require('express');
const passport = require('passport');
const router = express.Router();

const mortgageService = require('../services/mortgageservice');

const bunyan = require('../utils/bunyan');

function validateMortgage(body) {
	return body.name && body.address && body.phone && body.employer && body.insurance;
}

function validateEmployerInfo(body) {
	return body.employeeID && body.name && body.position && body.years && body.salary;
}

function validateInsuranceInfo(body) {
	return body.policyID && body.value;
}

router.post('/', function (req, res) {
	if (!validateMortgage(req.body)) {
		return res.status(400).send('Bad Request body needs name, address, phone, employer, insurance');
	}

	mortgageService.insertMortgage(req.body).then((result) => {
		return mortgageService.getMortgageFromMongoID(result.insertedId);
	}).then((document) => {
		res.status(200).send(document);
	});
});

router.get('/:mortgageID', function (req, res) {
	mortgageService.getMortgage(req.params.mortgageID).then(mortgage => {
		if (!mortgage) {
			return res.status(400).send('Bad Request mortgageID does not exist');
		}
		res.status(200).send(mortgage);
	});
});

router.put('/:mortgageID/employer', passport.authenticate('jwt', { session: false }), function (req, res) {
	if (!validateEmployerInfo(req.body)) {
		return res.status(400).send('Bad Request body needs employeeID, name, position, years, salary');
	}

	if (req.user.employeeID !== req.body.employeeID) {
		return res.sendStatus(401);
	}

	mortgageService.updateEmployerInfo(req.params.mortgageID, req.body).then((result) => {
		if (!result.lastErrorObject.updatedExisting) {
			return res.status(400).send('Bad Request mortgageID does not exist');
		}
		res.status(200).send(result.value);
	})
});

router.put('/:mortgageID/insurance', passport.authenticate('jwt', { session: false }), function (req, res) {
	if (!validateInsuranceInfo(req.body)) {
		return res.status(400).send('Bad Request body needs policyID, value');
	}

	if (req.user.policyID !== req.body.policyID) {
		return res.sendStatus(401);
	}

	mortgageService.updateInsuranceInfo(req.params.mortgageID, req.body).then((result) => {
		if (!result.lastErrorObject.updatedExisting) {
			return res.status(400).send('Bad Request mortgageID does not exist');
		}
		res.status(200).send(result.value);
	})
});

module.exports = router;
