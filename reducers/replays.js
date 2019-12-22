const initialState = {
	loading: true,
	error: false,
	statusCode: 0,
	data: null,
};

export default function(state = initialState, action) {
	switch (action.type) {
		case 'FETCH_REPLAYS_REQUEST':
			return Object.assign({}, state, {
				loading: true,
			});
		break;
		case 'FETCH_REPLAYS_FAILURE':
			return Object.assign({}, state, {
				loading: false,
				error: action.error
			});
		break;
		case 'FETCH_REPLAYS_SUCCESS':
			return setReplays(state, action.statusCode, action.data);
		break;
		case 'RESET_REPLAYS':
			return initialState;
		break;
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