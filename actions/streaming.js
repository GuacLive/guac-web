import { callApi } from '../services/api';

import { arrayToQueryString, isObjEmpty } from '../utils';

export function resetStreaming() {
	return {
		type: 'SET_STREAMING'
	};
}

export const fetchStreaming = (token) => async (dispatch) => {
	dispatch({
		type: 'FETCH_STREAMING_REQUEST'
	});
	console.log('BLAAAAAAAAAAAH', token);
	return callApi('/streaming', {
		headers: {
			'Content-Type': 'application/json'
		},
		accessToken: token
	})
	.then(response => response.json())
	.then((json) => {
		if (json.statusCode == 200) {
			dispatch(Object.assign({
				type: 'FETCH_STREAMING_SUCCESS'
			}, json));
		} else {
			dispatch({
				type: 'FETCH_STREAMING_FAILURE',
				error: new Error('Invalid status code in streaming json: ' + JSON.stringify(json))
			});
		}
	})
	.catch(error => {
        dispatch({
          type: 'FETCH_STREAMING_FAILURE',
          error
        });
	});
};