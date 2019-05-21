const initialState = {
	loading: true,
	error: false,
	data: {}
};

export default function(state = initialState, action) {
	switch (action.type) {
		case 'FETCH_EMOTES_REQUEST':
			return Object.assign({}, state, {
				loading: true,
			});
		break;
		case 'FETCH_EMOTES_FAILURE':
			return Object.assign({}, state, {
				loading: false,
				error: action.error
			});
		break;
		case 'FETCH_EMOTES_SUCCESS':
			return setEmotes(state, action.data);
		break;
		case 'RESET_FEATURED':
			return initialState;
		break;
	}
	return state;
};

function setEmotes(state, data) {
	return {
		...state,
		data
	};
}