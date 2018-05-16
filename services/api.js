import fetch from 'cross-fetch';

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

const { API_URL } = publicRuntimeConfig

export function callApi(endpoint, options = {}) {
	const opt = options;
	opt.headers = opt.headers || {};
	const fullUrl = (endpoint.indexOf(API_URL) === -1) ? API_URL + endpoint : endpoint;

	const accessToken = null;
	const defaultHeaders = {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	};
	if (accessToken) {
		defaultHeaders.Authorization = 'Bearer ' + accessToken;
	}
	opt.headers = Object.assign(opt.headers, defaultHeaders);
	return fetch(fullUrl, opt);
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
