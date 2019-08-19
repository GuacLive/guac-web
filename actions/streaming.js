import { callApi } from '../services/api';

export function resetStreaming() {
	return {
		type: 'SET_STREAMING'
	};
}

export const setCategory = (token, category = '') => async (dispatch) => {
	dispatch({
		type: 'SET_CATEGORY_REQUEST'
	});
	return callApi('/channel/setCategory', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		accessToken: token,
		body: JSON.stringify({
			category
		})
	})
	.then(response => response.json())
	.then((json) => {
		if (json.statusCode == 200) {
			dispatch(Object.assign({
				type: 'SET_CATEGORY_SUCCESS'
			}, json));
		} else {
			dispatch({
				type: 'SET_CATEGORY_FAILURE',
				error: new Error('Invalid status code in setCategory json: ' + JSON.stringify(json))
			});
		}
	})
	.catch(error => {
        dispatch({
          type: 'SET_CATEGORY_FAILURE',
          error
        });
	});
};

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

export const setPrivate = (token, private = false) => async (dispatch) => {
	dispatch({
		type: 'SET_PRIVATE_REQUEST'
	});
	return callApi('/channel/setPrivate', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		accessToken: token,
		body: JSON.stringify({
			private
		})
	})
	.then(response => response.json())
	.then((json) => {
		if (json.statusCode == 200) {
			dispatch(Object.assign({
				type: 'SET_PRIVATE_SUCCESS'
			}, json));
		} else {
			dispatch({
				type: 'SET_PRIVATE_FAILURE',
				error: new Error('Invalid status code in setPrivate json: ' + JSON.stringify(json))
			});
		}
	})
	.catch(error => {
        dispatch({
          type: 'SET_PRIVATE_FAILURE',
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