'use strict';

const controller = require('./../utils/controller');

const insuranceService = require('../services/insuranceservice');

function validatePolicy(body) {
	return body.password && body.value;
}

module.exports = controller(
	insuranceService,
	validatePolicy,
	'Bad Request body needs password, value',
	'policyID',
	'/insurance'
);
