import AbortController from 'abort-controller';
import lscache from 'lscache';

const TTL_MINUTES = 5;

const API_URL = process.env.API_URL;

export function callApi(endpoint, options = {}) {
	const opt = options;
	opt.headers = opt.headers || {};
	// Timeout to prevent SSR from locking up
	opt.timeout = opt.timeout || typeof window === 'undefined' ? process.env.SSR_TIMEOUT : 0;
	const fullUrl = (endpoint.indexOf(API_URL) === -1) ? API_URL + endpoint : endpoint;

	const controller = new AbortController();
	const timeout = setTimeout(
		() => {
			controller.abort();
		},
		opt.timeout,
	);

	const accessToken = opt.accessToken;
	let response = null;
	const defaultHeaders = {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	};
	if (accessToken) {
		defaultHeaders.Authorization = 'Bearer ' + accessToken;
	}
	if (opt.timeout) {
		opt.signal = controller.signal;
	}
	// Automatically whitelist if server
	if (typeof window === 'undefined') {
		defaultHeaders['x-guac-bypass'] = process.env.guac_whitelist_secret;
	}
	opt.headers = Object.assign(defaultHeaders, opt.headers);
	if (response === null) {
		response = fetch(fullUrl, opt)
			.then((res) => {
				if (res.status === 401) {
			        //return Promise.reject(res);
			    }
		    	return res;
			},
			err => {
				if (err.name !== 'AbortError') throw err;
			}
		);
		if (opt.timeout) {
			response = response
				.finally(() => {
					clearTimeout(timeout);
				});
		}
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
