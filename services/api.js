import fetch from 'cross-fetch';
import lscache from 'lscache';

const TTL_MINUTES = 5;

const API_URL = process.env.API_URL;

export function callApi(endpoint, options = {}) {
	const opt = options;
	opt.headers = opt.headers || {};
	const fullUrl = (endpoint.indexOf(API_URL) === -1) ? API_URL + endpoint : endpoint;

	const accessToken = options.accessToken;
	let shouldCache = opt.method === 'GET' && !accessToken;
	let response = null;
	const defaultHeaders = {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	};
	if (accessToken) {
		defaultHeaders.Authorization = 'Bearer ' + accessToken;
	}
	if (shouldCache) {
		response = lscache.get(fullUrl);
	}
	opt.headers = Object.assign(opt.headers, defaultHeaders);
	if (response === null) {
		response = fetch(fullUrl, opt)
			.then((res) => {
				if (res.status === 401) {
			        return Promise.reject(res);
			    }
		    	return res;
			}
		);
		if (shouldCache) lscache.set(fullUrl, response, TTL_MINUTES);
	}
	return response;
}

export function callDeleteApi(endpoint, options = {}) {
	const opt = options;
	opt.method = 'DELETE';

	return callApi(endpoint, opt)
	.then((res) => {
		if (res.status === 500 || res.status === 503) {
			return Promise.reject(res);
		}
		return res;
	});
}

export function callPutApi(endpoint, options = {}) {
	const opt = options;
	opt.method = 'PUT';

	return callApi(endpoint, opt)
	.then((res) => {
		if (res.status === 500 || res.status === 503) {
			return Promise.reject(res);
		}
		return res;
	});
}
