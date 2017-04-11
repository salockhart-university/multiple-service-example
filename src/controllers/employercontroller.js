'use strict';

const controller = require('./../utils/controller');

const employerService = require('../services/employerservice');

function validateEmployee(body) {
	return body.password && body.name && body.position && body.years && body.salary;
}

module.exports = controller(
	employerService,
	validateEmployee,
	'Bad Request body needs password, name, position, years, salary',
	'employeeID',
	'/employer'
);
