import { HYDRATE } from 'next-redux-wrapper';
const initialState = {
	loading: true,
	error: false,
	statusCode: 0,
	key: null,
	title: null,
	category: null,
	private: false,
	archive: false
};

export default function streamingReducer(state = initialState, action) {
	switch (action.type) {
		case 'SET_CATEGORY_REQUEST':
			return Object.assign({}, state, {
			});
		break;
		case 'SET_CATEGORY_FAILURE':
			return Object.assign({}, state, {
				loading: false,
				error: action.error
			});
		break;
		case HYDRATE:
			return {...state, ...action.payload.streaming};
		case 'SET_CATEGORY_SUCCESS':
			return {
				...state,
				statusCode: action.statusCode,
				category: action.category,
				loading: false,
				error: false
			};
		break;
		case 'SET_TITLE_REQUEST':
			return Object.assign({}, state, {
			});
		break;
		case 'SET_TITLE_FAILURE':
			return Object.assign({}, state, {
				loading: false,
				error: action.error
			});
		break;
		case 'SET_TITLE_SUCCESS':
			return {
				...state,
				statusCode: action.statusCode,
				title: action.title,
				loading: false,
				error: false
			};
		break;
		case 'SET_ARCHIVE_REQUEST':
			return Object.assign({}, state, {
			});
		break;
		case 'SET_ARCHIVE_FAILURE':
			return Object.assign({}, state, {
				loading: false,
				error: action.error
			});
		break;
		case 'SET_ARCHIVE_SUCCESS':
			return {
				...state,
				statusCode: action.statusCode,
				archive: action.archive,
				loading: false,
				error: false
			};
		break;
		case 'SET_PRIVATE_REQUEST':
			return Object.assign({}, state, {
			});
		break;
		case 'SET_PRIVATE_FAILURE':
			return Object.assign({}, state, {
				loading: false,
				error: action.error
			});
		break;
		case 'SET_PRIVATE_SUCCESS':
			return {
				...state,
				statusCode: action.statusCode,
				private: action.private,
				loading: false,
				error: false
			};
		break;
		case 'FETCH_STREAMING_REQUEST':
			return Object.assign({}, state, {
				loading: true,
			});
		break;
		case 'FETCH_STREAMING_FAILURE':
			return Object.assign({}, state, {
				loading: false,
				error: action.error
			});
		break;
		case 'FETCH_STREAMING_SUCCESS':
			return {
				...state,
				statusCode: action.statusCode,
				key: action.key,
				title: action.title,
				category: action.category,
				private: action.private,
				loading: false,
				error: false
			};
		break;
		case 'RESET_STREAMING':
			return initialState;
		break;
	}
	return state;
};