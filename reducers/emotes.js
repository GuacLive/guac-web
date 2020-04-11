import { HYDRATE } from 'next-redux-wrapper';
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
		case 'FETCH_EMOTES_FAILURE':
			return Object.assign({}, state, {
				loading: false,
				error: action.error
			});
		case HYDRATE:
			return {...state, ...action.payload.emotes};
		case 'FETCH_EMOTES_SUCCESS':
			return setEmotes(state, action.data);
		case 'RESET_FEATURED':
			return initialState;
	}
	return state;
};

function setEmotes(state, data) {
	return {
		...state,
		data
	};
}