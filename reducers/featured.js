import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
	loading: true,
	error: false,
	statusCode: 0,
	data: []
};

export default function(state = initialState, action) {
	switch (action.type) {
		case 'FETCH_FEATURED_REQUEST':
			return Object.assign({}, state, {
				loading: true,
			});
		case 'FETCH_FEATURED_FAILURE':
			return Object.assign({}, state, {
				loading: false,
				error: action.error
			});
		case HYDRATE:
			return {...state, ...action.payload.featured};
		case 'FETCH_FEATURED_SUCCESS':
			return setFeatured(state, action.statusCode, action.data);
		case 'RESET_FEATURED':
			return initialState;
	}
	return state;
};

function setFeatured(state, statusCode, data) {
	return {
		...state,
		statusCode,
		data,
		loading: false
	};
}