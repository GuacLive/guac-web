import { callApi } from '../services/api';

export function resetReplays() {
	return {
		type: 'SET_REPLAYS'
	};
}

export const fetchReplays = (name) => async (dispatch) => {
	dispatch({
		type: 'FETCH_REPLAYS_REQUEST'
	});
	return callApi('/replays/' + name)
	.then(response => response.json())
	.then((json) => {
		if (json.statusCode == 200) {
			dispatch(Object.assign({
				type: 'FETCH_REPLAYS_SUCCESS'
			}, json));
		} else {
			dispatch({
				type: 'FETCH_REPLAYS_FAILURE',
				error: new Error('Invalid status code in replays json: ' + JSON.stringify(json))
			});
		}
	})
	.catch(error => {
        dispatch({
          type: 'FETCH_REPLAYS_FAILURE',
          error
        });
	});
};