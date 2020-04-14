import { createStore, applyMiddleware, compose } from 'redux';

import {createWrapper} from 'next-redux-wrapper';

import createSentryMiddleware from "redux-sentry-middleware";
import thunk from 'redux-thunk';

import rootReducer from '../reducers';

import logger from 'redux-logger';

import * as Sentry from '@sentry/node';

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	debug: true,
	attachStacktrace: true,
	release: process.env.SENTRY_RELEASE,
	enabled: process.env.NODE_ENV !== 'test',
	ignoreErrors: [/\[Please ignore this error\]/],
	blacklistUrls: [
	  // Chrome extensions
	  /extensions\//i,
	  /^chrome:\/\//i,
	],
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

/* eslint-disable */
export default function configureStore(context) {
	const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	const store = createStore(
		rootReducer,
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
export const wrapper = createWrapper(configureStore , {debug: true});