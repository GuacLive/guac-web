const initialState = {
	loading: true,
	error: false,
	statusCode: 0,
	key: null
};

export default function(state = initialState, action) {
	switch (action.type) {
		case 'FETCH_STREAMING_REQUEST':
			return Object.assign({}, state, {
				loading: true,
			});
		break;
		case 'FETCH_STREAMING_FAILURE':
			return Object.assign({}, state, {
				loading: false,
				error: action.error
			});
		break;
		case 'FETCH_STREAMING_SUCCESS':
			return {
				...state,
				statusCode: action.statusCode,
				key: action.key,
				loading: false,
				error: false
			};
		break;
		case 'RESET_STREAMING':
			return initialState;
		break;
	}
	return state;
};