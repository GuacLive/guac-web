import { callApi } from '../services/api';

export function resetChannel() {
	return {
		type: 'SET_CHANNEL'
	};
}

export const fetchChannel = (name) => async (dispatch) => {
	dispatch({
		type: 'FETCH_CHANNEL_REQUEST'
	});
	return callApi('/watch/' + name)
	.then(response => response.json())
	.then((json) => {
		if (json.statusCode == 200) {
			dispatch(Object.assign({
				type: 'FETCH_CHANNEL_SUCCESS'
			}, json));
		} else {
			dispatch({
				type: 'FETCH_CHANNEL_FAILURE',
				error: new Error('Invalid status code in watch json: ' + JSON.stringify(json))
			});
		}
	})
	.catch(error => {
        dispatch({
          type: 'FETCH_CHANNEL_FAILURE',
          error
        });
	});
};