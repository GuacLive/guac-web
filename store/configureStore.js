import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers/index';

import logger from 'redux-logger';

const middlewares = [thunk];

const storeEnhancers = [];
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
	middlewares.push(logger);
	if (
		typeof window !== 'undefined'
		&& window.devToolsExtension
	) storeEnhancers.push(window.devToolsExtension());
}

const middlewareEnhancer = applyMiddleware(...middlewares);
storeEnhancers.unshift(middlewareEnhancer);

/* eslint-disable */
export default function configureStore(initialState) {
	const store = createStore(
		rootReducer,
		initialState,
		compose(...storeEnhancers)
	);

	if (process.env.NODE_ENV === 'development') {
		// Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
		if (module.hot) {
			module.hot.accept('../reducers', () => {
				const nextRootReducer = require('../reducers/index').default;
				store.replaceReducer(nextRootReducer);
			});
		}
	}

	return store;
}
