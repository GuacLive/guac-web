import { callApi } from 'services/api';

export function resetCategories() {
	return {
		type: 'SET_CATEGORIES'
	};
}

export const fetchCategories = (token) => async (dispatch) => {
	dispatch({
		type: 'FETCH_CATEGORIES_REQUEST'
	});
	return callApi('/categories', {
		headers: {
			'Content-Type': 'application/json'
		},
		accessToken: token
	})
	.then(response => response.json())
	.then((json) => {
		if (json.statusCode == 200) {
			dispatch(Object.assign({
				type: 'FETCH_CATEGORIES_SUCCESS'
			}, json));
		} else {
			dispatch({
				type: 'FETCH_CATEGORIES_FAILURE',
				error: new Error('Invalid status code in categories json: ' + JSON.stringify(json))
			});
		}
	})
	.catch(error => {
        dispatch({
          type: 'FETCH_CATEGORIES_FAILURE',
          error
        });
	});
};