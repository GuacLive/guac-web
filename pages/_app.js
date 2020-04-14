// pages/_app.js
import React from 'react';
import { Fragment, useEffect } from 'react';

import App from "next/app";


import { useDispatch, useSelector } from 'react-redux';

import { wrapper } from '../store/configureStore';

import { ConfigureFlopFlip } from '@flopflip/react-redux';
import adapter from '@flopflip/splitio-adapter';

import PageLayout from '../components/layout/PageLayout';

import { getCookie } from '../utils/cookie';

import initialize from '../utils/initialize';

import log from '../utils/log';

import * as actions from '../actions';

import { getLangs } from '../utils/lang';

import { I18nProvider, useLingui } from '@lingui/react';
import { i18n } from '@lingui/core';
import { activate } from '../utils/i18n';

import { initializeFirebase, initializePush } from '../utils/push-notification';

import ErrorBoundary from '../utils/ErrorBoundary';

import { library } from '@fortawesome/fontawesome-svg-core';


import { faBan, faBars, faCheck, faCheckCircle, faClock, faHourglass, faHome, faVideo, faSmileWink, faUser, faUserPlus, faSignInAlt, faSearch, faGamepad, faCog, faMinusCircle, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

// We need to put these here, since Next only allows global.css in _app
import '../css/style.css';
import 'simplebar/dist/simplebar.css';
if(typeof document !== 'undefined'){
	require('!style-loader!css-loader!video.js/dist/video-js.css')
}
library.add(faBan, faBars, faCheck, faCheckCircle, faClock, faHourglass, faHome, faVideo, faSmileWink, faUser, faUserPlus, faSignInAlt, faSearch, faGamepad, faCog, faMinusCircle, faTrash, faEdit);
function I18nWatchLocale({children}) {
	const {i18n} = useLingui()

	// Skip render when locale isn't loaded
	if (!i18n.locale) return null

	// Force re-render when locale changes. Otherwise string translations (e.g.
	// t`Macro`) won't be updated.
	return <Fragment key={i18n.locale}>{children}</Fragment>
}
const MyApp = (props) => {
	const dispatch = useDispatch();
	const authentication = useSelector(state => state.authentication);
	useEffect(() => {
		// Load initial catalog based on locale
		activate(props.locale);

		if(typeof window !== 'undefined'){
			// Initialize firebase messaging for current user
			initializeFirebase(() => {
				console.log('hi');
				if(authentication && authentication.token){
					initializePush(authentication.token);
				}
			});
			if(window.matchMedia){
				// Do not use system theme if overridden with cookie
				if(props.hasThemeCookie) return;
				// If user has a system-wide dark theme
				if(window.matchMedia('(prefers-color-scheme: dark)').matches){
					dispatch({
						type: 'SET_DARK_MODE'
					});
					props.pageProps.mode = 'dark';
				}else if(window.matchMedia('(prefers-color-scheme: light)').matches){
					dispatch({
						type: 'SET_LIGHT_MODE'
					});
					props.pageProps.mode = 'light';
				}
			}
		}
	}, []);

	const { Component, pageProps } = props;

	const skipLayoutDestinations = ['/embed/[name]', '/chat/[name]', '/overlay/[name]'];
	const shouldSkip = props.pathname && skipLayoutDestinations.indexOf(props.pathname) > -1;

	// Skip render when locale isn't 
	return (
		<ErrorBoundary>
			<ConfigureFlopFlip adapter={adapter} adapterArgs={{
				authorizationKey: process.env.SPLIT_IO_KEY,
				user: {
					key: authentication.user && authentication.user.name
				}
			}}>
				<I18nProvider i18n={i18n}>
						<PageLayout skip={shouldSkip} nonce={props.nonce}>
							<Component {...pageProps} {...{'log': log}} />
						</PageLayout>
				</I18nProvider>
			</ConfigureFlopFlip>
		</ErrorBoundary>
	);
};
MyApp.getInitialProps = wrapper.getInitialAppProps(async appContext => {
	const { ctx }  = appContext;
	const uuidv4 = require('uuid/v4');
	const nonce = uuidv4();

	// Locale
	const locales = getLangs(ctx, 'languageOnly');
	var locale = getCookie('lang', ctx.req) || locales[0];

	// If locale does not match expected format, fallback to en
	if (!/^[a-zA-Z0-9-_]+$/.test(locale)) {
		locale = 'en';
	}

	// Load initial catalog based on locale
	activate(locale);

	// Handle authenticaiton
	initialize(ctx);

	// In dev we allow 'unsafe-eval', so HMR doesn't trigger the CSP
	let devCsp = process.env.NODE_ENV !== 'production' ? "'unsafe-eval'" : '';
	let csp = `default-src 'self' guac.live *.guac.live privacy.guac.live localhost:*; base-uri 'self'; script-src 'self' ${devCsp} 'nonce-${nonce}' 'strict-dynamic' www.google.com www.googletagmanager.com www.google-analytics.com www.gstatic.com *.googleapis.com guac.live *.guac.live cheese.guac.live privacy.guac.live static.cloudflareinsights.com localhost:* c6.patreon.com wss://chat.guac.live wss://viewer-api.guac.live cdn.ravenjs.com; child-src www.google.com guac.live *.guac.live privacy.guac.live localhost:* patreon.com www.patreon.com wss://chat.guac.live wss://viewer-api.guac.live blob:; style-src 'self' 'unsafe-inline' *.googleapis.com use.fontawesome.com pro.fontawesome.com guac.live *.guac.live privacy.guac.live localhost:*; img-src 'self' data: guac.live *.guac.live emotes.guac.live privacy.guac.live cheese.guac.live chat.guac.live viewer-api.guac.live *.googleapis.com *.gstatic.com www.google-analytics.com c6.patreon.com *.giphy.com http: https:; media-src 'self' blob: guac.live *.guac.live privacy.guac.live localhost:* wss://chat.guac.live wss://viewer-api.guac.live; connect-src 'self' guac.live *.guac.live emotes.guac.live privacy.guac.live firebaseinstallations.googleapis.com fcmregistrations.googleapis.com localhost:* sdk.split.io events.split.io c6.patreon.com ws://chat.local.guac.live ws://viewer-api.guac.live ws://chat.guac.live wss://guac.live wss://chat.guac.live wss://viewer-api.guac.live ws://localhost:* wss://localhost:* ws://local.guac.live wss://local.guac.live ws://stream.local.guac.live wss://stream.local.guac.live ws://stream.guac.live wss://stream.guac.live ws://*.stream.guac.live wss://*.stream.guac.live www.google-analytics.com vendorlist.consensu.org api.betterttv.net api.frankerfacez.com api-test.frankerfacez.com twitchemotes.com *.giphy.com fcm.googleapis.com https://sentry.io; font-src 'self' use.fontawesome.com pro.fontawesome.com guac.live *.guac.live *.gstatic.com data:; object-src 'none';`;
	if(ctx && ctx.req) ctx.req.nonce = nonce;
	if(ctx.res){
		if (ctx.res.setHeader) {
			ctx.res.setHeader('content-security-policy', csp);
			ctx.res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=0, must-revalidate');
			ctx.res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
			ctx.res.setHeader('X-Powered-By', 'tacos');
		}
	}

	let mode = 'light';
	// Handle site mode (dark/light mode) if cookie exists
	if (getCookie('site-mode', ctx.req)) {
		mode = getCookie('site-mode', ctx.req) === 'dark' ? 'dark' : 'light';
		let type = mode === 'dark' ? 'SET_DARK_MODE' : 'SET_LIGHT_MODE';
		if (mode !== ctx.store.getState().site.mode) {
			ctx.store.dispatch({
				type
			});
		}
	}
	// Fetch my followed
	const {site, authentication} = ctx.store.getState()
	if(site.loading && authentication.token){
		// Fetch followed
		await ctx.store.dispatch(actions.fetchMyFollowed(
			authentication.token
		));
		console.log('clap', site, authentication);
	}

	// Return some pageProps
	return {
		// Call App getInitialProps
		...(App.getInitialProps ? await App.getInitialProps(appContext) : {}),
		// Some custom thing for all pages
		pathname: ctx.pathname,
		mode,
		nonce,
		hasThemeCookie: !!getCookie('site-mode', ctx.req),
		locale
	};
});
export default wrapper.withRedux(MyApp);