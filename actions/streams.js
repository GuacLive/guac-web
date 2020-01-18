import { callApi } from '../services/api';

export function resetStreams() {
	return {
		type: 'SET_STREAMS'
	};
}

export const fetchStreams = (token) => async (dispatch) => {
	dispatch({
		type: 'FETCH_STREAMS_REQUEST'
	});
	return callApi('/admin/streams', {
		headers: {
			'Content-Type': 'application/json'
		},
		accessToken: token
	})
	.then(response => response.json())
	.then((json) => {
		if (json.statusCode == 200) {
			dispatch(Object.assign({
				type: 'FETCH_STREAMS_SUCCESS'
			}, json));
		} else {
			dispatch({
				type: 'FETCH_STREAMS_FAILURE',
				error: new Error('Invalid status code in streams json: ' + JSON.stringify(json))
			});
		}
	})
	.catch(error => {
        dispatch({
          type: 'FETCH_STREAMS_FAILURE',
          error
        });
	});
};

export const stopStream = (token, stream = '') => async (dispatch) => {
	dispatch({
		type: 'STOP_STREAM_REQUEST'
	});
	return callApi('/admin/stopStream/' + stream, {
		headers: {
			'Content-Type': 'application/json'
		},
		accessToken: token
	})
	.then(response => response.json())
	.then((json) => {
		if (json.statusCode == 200) {
			dispatch(Object.assign({
				type: 'STOP_STREAM_SUCCESS'
			}, json));
		} else {
			dispatch({
				type: 'STOP_STREAM_FAILURE',
				error: new Error('Invalid status code in stop stream json: ' + JSON.stringify(json))
			});
		}
	})
	.catch(error => {
        dispatch({
          type: 'STOP_STREAM_FAILURE',
          error
        });
	});
};

export const banUser = (token, user = '', reason = '') => async (dispatch) => {
	dispatch({
		type: 'BAN_USER_REQUEST'
	});
	return callApi('/admin/banUser/' + user, {
		headers: {
			'Content-Type': 'application/json'
		},
		accessToken: token
	})
	.then(response => response.json())
	.then((json) => {
		if (json.statusCode == 200) {
			dispatch(Object.assign({
				type: 'BAN_USER_SUCCESS'
			}, json));
		} else {
			dispatch({
				type: 'BAN_USER_FAILURE',
				error: new Error('Invalid status code in ban user json: ' + JSON.stringify(json))
			});
		}
	})
	.catch(error => {
        dispatch({
          type: 'BAN_USER_FAILURE',
          error
        });
	});
};