const initialState = {
	loading: true,
	error: false,
	statusCode: 0,
	data: []
};

export default function(state = initialState, action) {
	switch (action.type) {
		case 'FETCH_STREAMS_REQUEST':
			return Object.assign({}, state, {
				loading: true,
			});
		break;
		case 'FETCH_STREAMS_FAILURE':
			return Object.assign({}, state, {
				loading: false,
				error: action.error
			});
		break;
		case 'FETCH_STREAMS_SUCCESS':
			return setStreams(state, action.statusCode, action.data);
		break;
		case 'RESET_STREAMS':
			return initialState;
		break;
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