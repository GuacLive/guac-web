import { callApi } from '../services/api';

import { arrayToQueryString, isObjEmpty } from '../utils';

export function resetStreaming() {
	return {
		type: 'SET_STREAMING'
	};
}

export const setTitle = (token, title = '') => async (dispatch) => {
	dispatch({
		type: 'SET_TITLE_REQUEST'
	});
	return callApi('/channel/setTitle', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		accessToken: token,
		body: JSON.stringify({
			title
		})
	})
	.then(response => response.json())
	.then((json) => {
		if (json.statusCode == 200) {
			dispatch(Object.assign({
				type: 'SET_TITLE_SUCCESS'
			}, json));
		} else {
			dispatch({
				type: 'SET_TITLE_FAILURE',
				error: new Error('Invalid status code in setTitle json: ' + JSON.stringify(json))
			});
		}
	})
	.catch(error => {
        dispatch({
          type: 'SET_TITLE_FAILURE',
          error
        });
	});
};

export const fetchStreaming = (token) => async (dispatch) => {
	dispatch({
		type: 'FETCH_STREAMING_REQUEST'
	});
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