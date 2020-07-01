import { HYDRATE } from 'next-redux-wrapper';
const initialState = {
	loading: true,
	error: false,
	statusCode: 0,
	data: null
};

export default function categoriesReducer(state = initialState, action) {
	switch (action.type) {
		case 'FETCH_CATEGORIES_REQUEST':
			return Object.assign({}, state, {
				loading: true,
			});
		case 'FETCH_CATEGORIES_FAILURE':
			return Object.assign({}, state, {
				loading: false,
				error: action.error
			});
		case HYDRATE:
			return {...state, ...action.payload.categories};
		case 'FETCH_CATEGORIES_SUCCESS':
			return {
				...state,
				statusCode: action.statusCode,
				data: action.data,
				loading: false,
				error: false
			};
		case 'RESET_CATEGORIES':
			return initialState;
	}
	return state;
};