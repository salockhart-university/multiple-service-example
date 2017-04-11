'use strict';

const jwt = require('jsonwebtoken');

const secret = process.env.SECRET;

module.exports = {
    getSecret: function () {
        return secret;
	},

    // https://github.com/auth0/node-jsonwebtoken
    getToken: function (payload) {
        delete payload.password;
        const token = jwt.sign(payload, secret, {
          expiresIn: "1 hour"
        });
        return {
            token: `JWT ${token}`
        }
    }
};
