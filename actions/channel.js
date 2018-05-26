import { callApi } from '../services/api';

import { arrayToQueryString } from '../utils';

export function setChannel(args) {
	return {
		type: 'SET_CHANNEL',
		...args
	};
}

export function resetChannel() {
	return {
		type: 'SET_CHANNEL'
	};
}


export const fetchChannel = (name) => async (dispatch) => {
	return callApi('/watch/' + name)
	.then(response => response.json())
	.then((json) => {
		if (!('statusCode' in json)) {
			return Promise.reject(json);
		}
		dispatch(setChannel(json));
	})
	.catch(error => {
		throw error;
	});
};