'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const token = require('./src/utils/token');

// https://github.com/themikenicholson/passport-jwt
const passportOpts = {
	jwtFromRequest: ExtractJwt.fromAuthHeader(),
	secretOrKey: token.getSecret()
};

passport.use(new JwtStrategy(passportOpts, function (jwt_payload, done) {
	done(null, jwt_payload);
}));

const mortgageController = require('./src/controllers/mortgagecontroller');
const employerController = require('./src/controllers/employercontroller');
const insuranceController = require('./src/controllers/insurancecontroller');

const bunyan = require('./src/utils/bunyan');

app.use(bodyParser.json());

app.use(function (req, res, next) {
	bunyan.audit(req);
	next();
});

app.use(express.static('public'));
app.use('/mortgage', mortgageController);
app.use('/employer', employerController);
app.use('/insurance', insuranceController);

app.listen(3000, function () {
	bunyan.info('Listening on port 3000!');
});

