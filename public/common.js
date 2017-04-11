'use strict';

function serializeForm(form) {
	const arr = form.serializeArray();
	const json = {};
	arr.forEach(function (keyValue) {
		json[keyValue.name] = keyValue.value;
	});
	return json;
}

function formHasError(formData) {
	return Object.keys(formData).filter(function (key) {
		return formData[key] ? false : key;
	});
}

function clearWarnings(form) {
	const inputs = form.find(`input`);
	inputs.each(function () {
		$(this).toggleClass('input-error', false);
	});
}

function handleWarnings(form, errors) {
	errors.forEach(function (name) {
		form.find(`input[name=${name}]`).toggleClass('input-error', true);
	});
}
