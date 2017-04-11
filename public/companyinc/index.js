'use strict';

let authedID;
let token;

function register(data, success, error) {
	$.ajax({
		type: 'POST',
		url: '/employer',
		data: JSON.stringify(data),
		contentType: 'application/json',
		success,
		error
	});
}

function login(data, success, error) {
	$.ajax({
		type: 'POST',
		url: `/employer/login`,
		data: JSON.stringify(data),
		contentType: 'application/json',
		success,
		error
	});
}

function transfer(employeeID, data, success, error) {
	$.ajax({
		type: 'POST',
		url: `/employer/${employeeID}/transfer`,
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
	$('#company-register-form').submit(function (event) {
		event.preventDefault();
		clearWarnings($(this));
		const data = serializeForm($(this));
		const hasError = formHasError(data);
		if (hasError.length > 0) {
			return handleWarnings($(this), hasError)
		}
		register(data, function (success) {
			console.log('Success!', success);
			$('#company-register-success').html(`
				Success!
				<br>
				Your Employee ID is:
				<br>
				<br>
				${success.employeeID}
			`);
		}, function (error) {
			console.log('Error...', error);
		})
	});
}

function registerLogin() {
	$('#company-login-form').submit(function (event) {
		event.preventDefault();
		clearWarnings($(this));
		$('#company-login-success').html('');
		authedID = null;
		$('.transfer-container').toggleClass('hidden', true);
		const data = serializeForm($(this));
		const hasError = formHasError(data);
		if (hasError.length > 0) {
			return handleWarnings($(this), hasError);
		}
		login(data, function (success) {
			console.log('Success!', success);
			authedID = data.employeeID;
			token = success.token;
			$('.transfer-container').toggleClass('hidden', false);
		}, function (error) {
			if (error.status === 401) {
				return handleWarnings($('#company-login-form'), ["employeeID", "password"]);
			}
			console.log('Error...', error);
		})
	});
}

function registerTransfer() {
	$('#company-transfer-form').submit(function (event) {
		event.preventDefault();
		clearWarnings($(this));
		$('#company-transfer-success').html('');
		const data = serializeForm($(this));
		const hasError = formHasError(data);
		if (hasError.length > 0) {
			return handleWarnings($(this), hasError);
		}
		transfer(authedID, data, function (success) {
			console.log('Success!', success);
			$('#company-transfer-success').html('Done!<br><br>Login to your Mortgage Broker to check your status.');
		}, function (error) {
			if (error.status === 400) {
				return handleWarnings($('#company-transfer-form'), ["mortgageID"]);
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
