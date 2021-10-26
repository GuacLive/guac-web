import { createStore, applyMiddleware, compose } from 'redux';

import {createWrapper} from 'next-redux-wrapper';

import createSentryMiddleware from "redux-sentry-middleware";
import thunk from 'redux-thunk';

import rootReducer from '../reducers';

import logger from 'redux-logger';

import * as Sentry from '@sentry/nextjs';
import { RewriteFrames } from '@sentry/integrations';

const integrations = []
if (
  process.env.NEXT_IS_SERVER === 'true' &&
  process.env.NEXT_PUBLIC_SENTRY_SERVER_ROOT_DIR
) {
  // For Node.js, rewrite Error.stack to use relative paths, so that source
  // maps starting with ~/_next map to files in Error.stack with path
  // app:///_next
  integrations.push(
	new RewriteFrames({
	  iteratee: (frame) => {
		frame.filename = frame.filename.replace(
		  process.env.NEXT_PUBLIC_SENTRY_SERVER_ROOT_DIR,
		  'app:///'
		)
		frame.filename = frame.filename.replace('.next', '_next')
		return frame
	  },
	})
  )
}
Sentry.init({
	dsn: process.env.SENTRY_DSN,
	release: process.env.SENTRY_RELEASE,
	debug: true,
	attachStacktrace: true,
	integrations,
	enabled: process.env.NODE_ENV === 'production',
	ignoreErrors: [
	  // Random plugins/extensions
	  "top.GLOBALS",
	  // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
	  "originalCreateNotification",
	  "canvas.contentDocument",
	  "MyApp_RemoveAllHighlights",
	  "http://tt.epicplay.com",
	  "Can't find variable: ZiteReader",
	  "jigsaw is not defined",
	  "ComboSearch is not defined",
	  "http://loading.retry.widdit.com/",
	  "atomicFindClose",
	  // Facebook borked
	  "fb_xd_fragment",
	  // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to
	  // reduce this. (thanks @acdha)
	  // See http://stackoverflow.com/questions/4113268
	  "bmi_SafeAddOnload",
	  "EBCallBackMessageReceived",
	  // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
	  "conduitPage",
	],
	ignoreUrls: [
		// Facebook flakiness
		/graph\.facebook\.com/i,
		// Facebook blocked
		/connect\.facebook\.net\/en_US\/all\.js/i,
		// Woopra flakiness
		/eatdifferent\.com\.woopra-ns\.com/i,
		/static\.woopra\.com\/js\/woopra\.js/i,
		// Chrome extensions
		/extensions\//i,
		/^chrome:\/\//i,
		// Other plugins
		/127\.0\.0\.1:4001\/isrunning/i, // Cacaoweb
		/webappstoolbarba\.texthelp\.com\//i,
		/metrics\.itunes\.apple\.com\.edgesuite\.net\//i,
		// Remove errors from vercel subdomain (these are preview deployments)
		/.vercel\.app/i
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
export const wrapper = createWrapper(configureStore);