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
				error: false
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
			console.log('FOLLOW_SUCCESS', action.statusCode, action.statusMessage)
			let isFollowing = null;
			if(action.statusCode == 200){
				if(action.statusMessage == 'Person followed'){
					isFollowing = true;
				}else if(action.statusMessage == 'Person unfollowed'){
					isFollowing = false;
				}
			}
			return {
				...state,
				// omegalul
				isFollowing
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
		error: false,
		loading: false
	};
}

function setChannelViewers(state, viewers) {
	return {
		...state,
		viewers
	};
}