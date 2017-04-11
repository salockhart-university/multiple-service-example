'use strict';

function apply(data, success, error) {
	$.ajax({
		type: 'POST',
		url: '/mortgage',
		data: JSON.stringify(data),
		contentType: 'application/json',
		success,
		error
	});
}

function status(mortgageID, success, error) {
	$.ajax({
		type: 'GET',
		url: `/mortgage/${mortgageID}`,
		contentType: 'application/json',
		success,
		error
	});
}

function registerApply() {
	$('#mortgage-apply-form').submit(function (event) {
		event.preventDefault();
		clearWarnings($(this));
		const data = serializeForm($(this));
		const hasError = formHasError(data);
		if (hasError.length > 0) {
			return handleWarnings($(this), hasError)
		}
		apply(data, function (success) {
			console.log('Success!', success);
			$('#mortgage-apply-success').html(`
				Success!
				<br>
				Please copy your mortgage ID to check the status:
				<br>
				<br>
				${success.mortgageID}
			`);
		}, function (error) {
			console.log('Error...', error);
		})
	});
}

function registerStatus() {
	$('#mortgage-status-form').submit(function (event) {
		event.preventDefault();
		clearWarnings($(this));
		const data = serializeForm($(this));
		const hasError = formHasError(data);
		if (hasError.length > 0) {
			return handleWarnings($(this), hasError)
		}
		status(data.mortgageID, function (success) {
			console.log('Success!', success);
			let employerStatus = 'Pending';
			let insuranceStatus = 'Pending';
			if (success.employer.info) {
				const info = success.employer.info;
				employerStatus = `
					Name: ${info.name}
					<br>
					Position: ${info.position}
					<br>
					Years: ${info.years}
					<br>
					Salary: ${info.salary}
				`
			}
			if (success.insurance.info) {
				const info = success.insurance.info;
				insuranceStatus = `
					Policy Number: ${info.policyID}
					<br>
					Value: ${info.value}
				`
			}
			let overallStatus = '';
			if (employerStatus !== 'Pending' && insuranceStatus !== 'Pending') {
				overallStatus = 'Approved!';
			} else {
				overallStatus = 'Pending';
			}
			$('#mortgage-status-success').html(`
				Employer Status:
				<br>
				${employerStatus}
				<br>
				<br>
				Insurance Status:
				<br>
				${insuranceStatus}
				<br>
				<br>
				Application Status:
				<br>
				${overallStatus}
			`);
		}, function (error) {
			handleWarnings($('#mortgage-status-form'), ["mortgageID"])
		})
	});
}

$(document).ready(function () {
	registerApply();
	registerStatus();
});
