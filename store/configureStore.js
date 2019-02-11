import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';

import logger from 'redux-logger';

import {
	createFlopFlipEnhancer,
} from '@flopflip/react-redux';
import adapter from '@flopflip/localstorage-adapter';

const middlewares = [thunk];

const storeEnhancers = [];
console.log('NODE_ENV: ', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

const middlewareEnhancer = applyMiddleware(...middlewares);
storeEnhancers.unshift(middlewareEnhancer);

if(typeof localStorage === 'object'){
  console.log('createFlopFlipEnhancer');
  storeEnhancers.push(createFlopFlipEnhancer(
    adapter,
    {
      user: {
        key: 'user'
      }
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
