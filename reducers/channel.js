import { HYDRATE } from 'next-redux-wrapper';
const initialState = {
	loading: true,
	error: false,
	statusCode: 0,
	data: null,
	viewers: null,
	isFollowing: null
};

export default function channelReducer(state = initialState, action) {
	switch (action.type) {
		case 'FETCH_CHANNEL_REQUEST':
			return Object.assign({}, state, {
				loading: true,
			});
		case 'FETCH_CHANNEL_FAILURE':
			return Object.assign({}, state, {
				loading: false,
				error: action.error
			});
		case HYDRATE:
			return {...state, ...action.payload.channel};
		case 'FETCH_CHANNEL_SUCCESS':
			return setChannel(state, action.statusCode, action.data, action.viewers);
		case 'FOLLOW_SUCCESS':
			return {
				...state,
				// omegalul
				isFollowing: (action.statusCode == 200 && action.statusMessage == 'Person followed')
			};
		case 'SET_CHANNEL_VIEWERS':
			return setChannelViewers(state, action.viewers);
		case 'RESET_CHANNEL':
			return initialState;
	}
	return state;
};

function setChannel(state, statusCode, data, viewers) {
	return {
		...state,
		statusCode,
		data,
		viewers,
		loading: false
	};
}

function setChannelViewers(state, viewers) {
	return {
		...state,
		viewers
	};
}