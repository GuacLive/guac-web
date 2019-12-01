const initialState = {
	loading: true,
	error: false,
	regError: false,
	statusCode: 0,
	token: null,
	user: {}
};

export default function(state = initialState, action) {
	switch (action.type) {
		case 'AUTHENTICATE_REQUEST':
		case 'REGISTER_REQUEST':
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
		case 'REGISTER_SUCCESS':
			return {
				...state,
				statusCode: action.statusCode,
				token: action.jwtToken,
				user: action.user,
				loading: false,
				error: false,
				regError: false
			};
		break;
		case 'REGISTER_FAILURE':
			return Object.assign({}, state, {
				loading: false,
				error: false,
				regError: action.error
			});
		break;
		case 'DEAUTHENTICATE':
			return initialState;
		break;
	}
	return state;
};