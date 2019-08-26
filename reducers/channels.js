const initialState = {
	loading: true,
	error: false,
	statusCode: 0,
	data: null,
};

export default function(state = initialState, action) {
	switch (action.type) {
		case 'FETCH_CHANNELS_REQUEST':
			return Object.assign({}, state, {
				loading: true,
			});
		break;
		case 'FETCH_CHANNELS_FAILURE':
			return Object.assign({}, state, {
				loading: false,
				error: action.error
			});
		break;
		case 'FETCH_CHANNELS_SUCCESS':
			return setChannels(state, action.statusCode, action.data);
		break;
		case 'RESET_CHANNELS':
			return initialState;
		break;
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