import { callApi } from '../services/api';

export function resetChannels() {
	return {
		type: 'SET_CHANNELS'
	};
}
export const fetchChannels = (onlyLive) => async (dispatch) => {
	dispatch({
		type: 'FETCH_CHANNELS_REQUEST'
	});
	return callApi('/channels/?live=' + onlyLive)
	.then(response => response.json())
	.then((json) => {
		if (json.statusCode == 200) {
			dispatch(Object.assign({
				type: 'FETCH_CHANNELS_SUCCESS'
			}, json));
		} else {
			dispatch({
				type: 'FETCH_CHANNELS_FAILURE',
				error: new Error('Invalid status code in channels json: ' + JSON.stringify(json))
			});
		}
	})
	.catch(error => {
        dispatch({
          type: 'FETCH_CHANNELS_FAILURE',
          error
        });
	});
};