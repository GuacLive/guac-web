import { callApi } from 'services/api';

export function resetFeatured() {
	return {
		type: 'SET_FEATURED'
	};
}


export const fetchFeatured = () => async (dispatch) => {
	dispatch({
		type: 'FETCH_FEATURED_REQUEST'
	});
	return callApi('/featured', {
		timeout: 1500
	})
	.then(response => response.json())
	.then((json) => {
		if (json.statusCode == 200) {
			dispatch(Object.assign({
				type: 'FETCH_FEATURED_SUCCESS',
			}, json));
		} else {
			dispatch({
				type: 'FETCH_FEATURED_FAILURE',
				error: new Error('Invalid status code in featured json: ' + JSON.stringify(json))
			});
		}
	})
	.catch(error => {
        dispatch({
          type: 'FETCH_FEATURED_FAILURE',
          error
        });
	});
};