import { createStore, applyMiddleware, compose } from 'redux';
import createSentryMiddleware from "redux-sentry-middleware";
import thunk from 'redux-thunk';

import rootReducer from '../reducers';

import logger from 'redux-logger';

import {
	createFlopFlipEnhancer,
} from '@flopflip/react-redux';
import adapter from '@flopflip/localstorage-adapter';

import * as Sentry from '@sentry/browser';

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	debug: true,
	beforeSend(event) {
		console.log('beforeSend', event);
		if(event.extra && event.extra.state){
			if(event.extra.state.authentication){
				// Don't send user's token
				delete event.extra.state.authentication.token;
			}
			if(event.extra.state.streaming){
				// Don't send user's streaming key
				delete event.extra.state.streaming.key;
			}
		}
		return event;
	}
});

const middlewares = [
	thunk,
	createSentryMiddleware(Sentry,
	{
		getUserContext: (state) => {
			if(state && state.authentication && state.authentication.user){
				return state.authentication.user;
			}
			return null;
		}
	})
];

const storeEnhancers = [];
console.log('NODE_ENV: ', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
	middlewares.push(logger);
}

const middlewareEnhancer = applyMiddleware(...middlewares);
storeEnhancers.unshift(middlewareEnhancer);

if(typeof localStorage === 'object'){
	console.log('createFlopFlipEnhancer', adapter);
	storeEnhancers.push(createFlopFlipEnhancer(
		adapter,
		{
			user: {
				key: 'user'
			},
			onFlagsStateChange: () => {console.log('onFlagsStateChange')},
			onStatusStateChange: () => {}
		}
	));
}

/* eslint-disable */
export default function configureStore(initialState) {
	const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	const store = createStore(
		rootReducer,
		initialState,
		composeEnhancers(...storeEnhancers)
	);

	if (process.env.NODE_ENV === 'development') {
		// Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
		if (module.hot) {
			module.hot.accept('../reducers', () => {
				store.replaceReducer(rootReducer)
			});
		}
	}

	return store;
}
