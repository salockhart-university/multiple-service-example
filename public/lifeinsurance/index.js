'use strict';

let authedID;
let token;

function register(data, success, error) {
	$.ajax({
		type: 'POST',
		url: '/insurance',
		data: JSON.stringify(data),
		contentType: 'application/json',
		success,
		error
	});
}

function login(data, success, error) {
	$.ajax({
		type: 'POST',
		url: `/insurance/login`,
		data: JSON.stringify(data),
		contentType: 'application/json',
		success,
		error
	});
}

function transfer(policyID, data, success, error) {
	$.ajax({
		type: 'POST',
		url: `/insurance/${policyID}/transfer`,
		data: JSON.stringify(data),
		contentType: 'application/json',
		beforeSend: function (xhr) {
			xhr.setRequestHeader('Authorization', token);
		},
		success,
		error
	});
}

function registerRegister() {
	$('#insurance-register-form').submit(function (event) {
		event.preventDefault();
		clearWarnings($(this));
		const data = serializeForm($(this));
		const hasError = formHasError(data);
		if (hasError.length > 0) {
			return handleWarnings($(this), hasError)
		}
		register(data, function (success) {
			console.log('Success!', success);
			$('#insurance-register-success').html(`
				Success!
				<br>
				Your Policy ID is:
				<br>
				<br>
				${success.policyID}
			`);
		}, function (error) {
			console.log('Error...', error);
		})
	});
}

function registerLogin() {
	$('#insurance-login-form').submit(function (event) {
		event.preventDefault();
		clearWarnings($(this));
		$('#insurance-login-success').html('');
		authedID = null;
		$('.transfer-container').toggleClass('hidden', true);
		const data = serializeForm($(this));
		const hasError = formHasError(data);
		if (hasError.length > 0) {
			return handleWarnings($(this), hasError);
		}
		login(data, function (success) {
			console.log('Success!', success);
			authedID = data.policyID;
			token = success.token;
			$('.transfer-container').toggleClass('hidden', false);
		}, function (error) {
			if (error.status === 401) {
				return handleWarnings($('#insurance-login-form'), ["policyID", "password"]);
			}
			console.log('Error...', error);
		})
	});
}

function registerTransfer() {
	$('#insurance-transfer-form').submit(function (event) {
		event.preventDefault();
		clearWarnings($(this));
		$('#insurance-transfer-success').html('');
		const data = serializeForm($(this));
		const hasError = formHasError(data);
		if (hasError.length > 0) {
			return handleWarnings($(this), hasError);
		}
		transfer(authedID, data, function (success) {
			console.log('Success!', success);
			$('#insurance-transfer-success').html('Done!<br><br>Login to your Mortgage Broker to check your status.');
		}, function (error) {
			if (error.status === 400) {
				return handleWarnings($('#insurance-transfer-form'), ["mortgageID"]);
			}
			console.log('Error...', error);
		})
	});
}

$(document).ready(function () {
	registerRegister();
	registerLogin();
	registerTransfer();
});
