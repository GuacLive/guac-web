const initialState = {
	statusCode: 0,
	data: []
};

export default function(state = initialState, action) {
	switch (action.type) {
		case 'SET_CHANNEL':
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
		data
	};
}