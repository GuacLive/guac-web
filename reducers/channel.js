const initialState = {
	loading: true,
	error: false,
	statusCode: 0,
	data: null
};

export default function(state = initialState, action) {
	switch (action.type) {
		case 'FETCH_CHANNEL_REQUEST':
			return Object.assign({}, state, {
				loading: true,
			});
		break;
		case 'FETCH_CHANNEL_FAILURE':
			return Object.assign({}, state, {
				loading: false,
				error: action.error
			});
		break;
		case 'FETCH_CHANNEL_SUCCESS':
			return setChannel(state, action.statusCode, action.data);
		break;
		case 'RESET_CHANNEL':
			return initialState;
		break;
	}
	return state;
};

function setChannel(state, statusCode, data) {
	return {
		...state,
		statusCode,
		data,
		loading: false
	};
}