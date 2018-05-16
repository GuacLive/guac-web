import { callApi } from '../services/api';

import { arrayToQueryString } from '../utils';

export function setFeatured(args) {
	return {
		type: 'SET_FEATURED',
		...args
	};
}

export function resetFeatured() {
	return {
		type: 'SET_FEATURED'
	};
}


export const fetchFeatured = () => async (dispatch) => {
	return callApi('/featured')
	.then(response => response.json())
	.then((json) => {
		if (!('statusCode' in json)) {
			return Promise.reject(json);
		}
		dispatch(setFeatured(json));
	})
	.catch(error => {
		throw error;
	});
};