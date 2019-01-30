const initialState = {
	loading: true,
	error: false,
	statusCode: 0,
	token: null
};

export default function(state = initialState, action) {
	switch (action.type) {
		case 'AUTHENTICATE_REQUEST':
			return Object.assign({}, state, {
				loading: true,
			});
		break;
		case 'AUTHENTICATE_FAILURE':
			return Object.assign({}, state, {
				loading: false,
				error: action.error
			});
		break;
		case 'AUTHENTICATE_SUCCESS':
			return {
				...state,
				statusCode: action.statusCode,
				token: action.jwtToken,
				loading: false,
				error: false
			};
		break;
		case 'DEAUTHENTICATE':
			return initialState;
		break;
	}
	return state;
};