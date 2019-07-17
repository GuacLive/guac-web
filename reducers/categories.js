const initialState = {
	loading: true,
	error: false,
	statusCode: 0,
	data: null
};

export default function(state = initialState, action) {
	switch (action.type) {
		case 'FETCH_CATEGORIES_REQUEST':
			return Object.assign({}, state, {
				loading: true,
			});
		break;
		case 'FETCH_CATEGORIES_FAILURE':
			return Object.assign({}, state, {
				loading: false,
				error: action.error
			});
		break;
		case 'FETCH_CATEGORIES_SUCCESS':
			return {
				...state,
				statusCode: action.statusCode,
				data: action.data,
				loading: false,
				error: false
			};
		break;
		case 'RESET_CATEGORIES':
			return initialState;
		break;
	}
	return state;
};