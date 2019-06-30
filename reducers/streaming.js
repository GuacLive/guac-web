const initialState = {
	loading: true,
	error: false,
	statusCode: 0,
	key: null,
	title: null,
};

export default function(state = initialState, action) {
	switch (action.type) {
		case 'SET_TITLE_REQUEST':
			return Object.assign({}, state, {
			});
		break;
		case 'SET_TITLE_FAILURE':
			return Object.assign({}, state, {
				loading: false,
				error: action.error
			});
		break;
		case 'SET_TITLE_SUCCESS':
			return {
				...state,
				statusCode: action.statusCode,
				title: action.title,
				loading: false,
				error: false
			};
		break;
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
				title: action.title,
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