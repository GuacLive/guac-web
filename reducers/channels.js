import { HYDRATE } from 'next-redux-wrapper';
const initialState = {
	loading: true,
	error: false,
	statusCode: 0,
	data: null,
};

export default function channelsReducer(state = initialState, action) {
	switch (action.type) {
		case 'FETCH_CHANNELS_REQUEST':
			return Object.assign({}, state, {
				loading: true,
			});
		case 'FETCH_CHANNELS_FAILURE':
			return Object.assign({}, state, {
				loading: false,
				error: action.error
			});
		case HYDRATE:
			return {...state, ...action.payload.channels};
		case 'FETCH_CHANNELS_SUCCESS':
			return setChannels(state, action.statusCode, action.data);
		case 'RESET_CHANNELS':
			return initialState;
	}
	return state;
};

function setChannels(state, statusCode, data) {
	return {
		...state,
		statusCode,
		data,
		loading: false
	};
}