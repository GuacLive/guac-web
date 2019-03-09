const initialState = {
	mode: null
};

export default function(state = initialState, action) {
	switch (action.type) {
		case 'SET_DARK_MODE':
			return Object.assign({}, state, {
				mode: 'dark',
			});
		break;
		case 'SET_LIGHT_MODE':
			return Object.assign({}, state, {
				mode: 'light',
			});
		break;
		case 'RESET_SITE':
			return initialState;
		break;
	}
	return state;
};