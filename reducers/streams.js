import { HYDRATE } from 'next-redux-wrapper';
const initialState = {
	loading: true,
	error: false,
	statusCode: 0,
	data: []
};

export default function streamsReducer(state = initialState, action) {
	switch (action.type) {
		case 'FETCH_STREAMS_REQUEST':
			return Object.assign({}, state, {
				loading: true,
			});
		case 'FETCH_STREAMS_FAILURE':
			return Object.assign({}, state, {
				loading: false,
				error: action.error
			});
		case HYDRATE:
			return {...state, ...action.payload.streams};
		case 'FETCH_STREAMS_SUCCESS':
			return setStreams(state, action.statusCode, action.data);
		case 'RESET_STREAMS':
			return initialState;
	}
	return state;
};

function setStreams(state, statusCode, data) {
	return {
		...state,
		statusCode,
		data,
		loading: false
	};
}