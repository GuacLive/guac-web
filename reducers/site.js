import { HYDRATE } from 'next-redux-wrapper';
const initialState = {
	loading: true,
	error: false,
	statusCode: 0,
	myFollowed: null,
	mode: null
};

export default function(state = initialState, action) {
	switch (action.type) {
		case 'FETCH_MY_FOLLOWED_REQUEST':
			return Object.assign({}, state, {
				loading: true,
			});
		case 'FETCH_MY_FOLLOWED_FAILURE':
			return Object.assign({}, state, {
				loading: false,
				error: action.error
			});
		case HYDRATE:
			return {...state, ...action.payload.site};
		case 'FETCH_MY_FOLLOWED_SUCCESS':
			return {
				...state,
				statusCode: action.statusCode,
				myFollowed: action.data,
				loading: false,
				error: false
			};
		case 'SET_DARK_MODE':
			return Object.assign({}, state, {
				mode: 'dark',
			});
		case 'SET_LIGHT_MODE':
			return Object.assign({}, state, {
				mode: 'light',
			});
		case 'RESET_SITE':
			return initialState;
	}
	return state;
};