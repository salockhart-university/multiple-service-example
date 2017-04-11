'use strict';

const crypto = require('crypto');

module.exports = {
	getID: function () {
		return crypto.randomBytes(3).toString('hex').toUpperCase();
	}
};
