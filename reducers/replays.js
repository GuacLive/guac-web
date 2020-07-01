import { HYDRATE } from 'next-redux-wrapper';
const initialState = {
	loading: true,
	error: false,
	statusCode: 0,
	data: null,
};

export default function replaysReducer(state = initialState, action) {
	switch (action.type) {
		case 'FETCH_REPLAYS_REQUEST':
			return Object.assign({}, state, {
				loading: true,
			});
		case 'FETCH_REPLAYS_FAILURE':
			return Object.assign({}, state, {
				loading: false,
				error: action.error
			});
		case HYDRATE:
			return {...state, ...action.payload.replays};
		case 'FETCH_REPLAYS_SUCCESS':
			return setReplays(state, action.statusCode, action.data);
		case 'RESET_REPLAYS':
			return initialState;
	}
	return state;
};

function setReplays(state, statusCode, data) {
	return {
		...state,
		statusCode,
		data,
		loading: false
	};
}