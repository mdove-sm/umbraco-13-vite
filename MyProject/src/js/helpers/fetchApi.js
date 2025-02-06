export default function fetchAPI(url, method, data, success, error) {
	// console.log("FETCHING: ", url);
	fetch(url, {
		method: method,
		body: null,
	})
		.then(handleErrors)
		.then(function (response) {
			return response.headers
				.get("content-type")
				.indexOf("application/json") !== -1
				? response.json()
				: response.text();
		})
		.then(function (data) {
			// console.log(data);
			if (typeof success === "function") success(data, url);
		})
		.catch(function (e) {
			console.error(e);
			if (typeof error === "function") error();
		});
}

function handleErrors(response) {
	if (!response.ok) {
		throw Error(response.status);
	}
	return response;
}
