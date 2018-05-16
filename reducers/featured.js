const initialState = {
	statusCode: 0,
	data: []
};

export default function(state = initialState, action) {
	switch (action.type) {
		case 'SET_FEATURED':
			return setFeatured(state, action.statusCode, action.data);
		break;
		case 'RESET_FEATURED':
			return initialState;
		break;
	}
	return state;
};

function setFeatured(state, statusCode, data) {
	return {
		...state,
		statusCode,
		data
	};
}