// pages/_app.js
import React from 'react';

import {Provider} from 'react-redux';
import App from 'next/app';
import withRedux from 'next-redux-wrapper';

import configureStore from '../store/configureStore';

import PageLayout from '../components/layout/PageLayout';

import { getCookie } from '../utils/cookie';

import initialize from '../utils/initialize';

import log from '../utils/log';

import * as actions from '../actions';

import { getLangs } from '../utils/lang';

import { I18nProvider } from "@lingui/react";

import { initializeFirebase, initializePush } from '../utils/push-notification';

import { library } from '@fortawesome/fontawesome-svg-core';

import { faBan, faBars, faCheck, faCheckCircle, faHourglass, faHome, faVideo, faSmileWink, faUser, faUserPlus, faSignInAlt, faSearch, faGamepad, faCog, faMinusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';

import * as Sentry from '@sentry/browser';

// We need to put these here, since Next only allows global.css in _app
import '../css/style.css';
import 'simplebar/dist/simplebar.css';
if(typeof document !== 'undefined'){
	require('!style-loader!css-loader!video.js/dist/video-js.css')
}
library.add(faBan, faBars, faCheck, faCheckCircle, faHourglass, faHome, faVideo, faSmileWink, faUser, faUserPlus, faSignInAlt, faSearch, faGamepad, faCog, faMinusCircle, faTrash);
export default withRedux(configureStore)(class MyApp extends App {
	static async getInitialProps(appContext) {
		const { ctx } = appContext;
		const uuidv4 = require('uuid/v4');
		const nonce = uuidv4();

		// Locale
		const locales = getLangs(ctx, 'languageOnly');
		var locale = getCookie('lang', ctx.req) || locales[0];
		
		var catalog;
		// If locale does not match expected format, fallback to en
		if(!/^[a-zA-Z0-9-_]+$/.test(locale)){
			locale = 'en';
		}
		// Load initial catalog based on locale
		try{
			catalog = await import(
				/* webpackMode: "lazy", webpackChunkName: "i18n-[index]" */
				`@lingui/loader!../locale/${locale || 'en'}/messages.po`
			);
		}catch(e){
			// File does not exist, fallback to en locale
			locale = 'en';
			catalog = await import(
				/* webpackMode: "lazy", webpackChunkName: "i18n-[index]" */
				`@lingui/loader!../locale/en/messages.po`
			);
		}

		// Handle authenticaiton
		initialize(ctx);

		// In dev we allow 'unsafe-eval', so HMR doesn't trigger the CSP
		let devCsp = process.env.NODE_ENV !== 'production' ? "'unsafe-eval'" : '';
		let csp = `default-src 'self' guac.live *.guac.live privacy.guac.live localhost:*; base-uri 'self'; script-src 'self' ${devCsp} 'nonce-${nonce}' 'strict-dynamic' www.google.com www.googletagmanager.com www.google-analytics.com www.gstatic.com *.googleapis.com guac.live *.guac.live cheese.guac.live privacy.guac.live localhost:* wss://chat.guac.live cdn.ravenjs.com; child-src www.google.com guac.live *.guac.live privacy.guac.live localhost:* wss://chat.guac.live blob:; style-src 'self' 'unsafe-inline' *.googleapis.com use.fontawesome.com pro.fontawesome.com guac.live *.guac.live privacy.guac.live localhost:* cdnjs.cloudflare.com; img-src 'self' data: guac.live *.guac.live emotes.guac.live privacy.guac.live cheese.guac.live chat.guac.live *.googleapis.com *.gstatic.com www.google-analytics.com *.giphy.com http: https:; media-src 'self' blob: guac.live *.guac.live privacy.guac.live localhost:* wss://chat.guac.live; connect-src 'self' guac.live *.guac.live emotes.guac.live privacy.guac.live firebaseinstallations.googleapis.com fcmregistrations.googleapis.com localhost:* ws://chat.local.guac.live ws://chat.guac.live wss://guac.live wss://chat.guac.live ws://localhost:* wss://localhost:* ws://local.guac.live wss://local.guac.live ws://stream.local.guac.live wss://stream.local.guac.live ws://stream.guac.live wss://stream.guac.live ws://*.stream.guac.live wss://*.stream.guac.live www.google-analytics.com vendorlist.consensu.org api.betterttv.net api.frankerfacez.com api-test.frankerfacez.com twitchemotes.com *.giphy.com fcm.googleapis.com https://sentry.io; font-src 'self' use.fontawesome.com pro.fontawesome.com guac.live *.guac.live *.gstatic.com data: cdnjs.cloudflare.com; object-src 'none';`;
		if(ctx && ctx.req) ctx.req.nonce = nonce;
		if(ctx.res){
			if(ctx.res.setHeader){
				ctx.res.setHeader('content-security-policy', csp);
				ctx.res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=0, must-revalidate');
				ctx.res.setHeader('X-Powered-By', 'tacos');
			}
		}

		let mode = 'light';
		// Handle site mode (dark/light mode) if cookie exists
		if(getCookie('site-mode', ctx.req)){	
			mode = getCookie('site-mode', ctx.req) === 'dark' ? 'dark' : 'light';
			let type = mode === 'dark' ? 'SET_DARK_MODE' : 'SET_LIGHT_MODE';
			if(mode !== ctx.store.getState().site.mode){
				ctx.store.dispatch({
					type
				});
			}
		}
		// Fetch my followed
		const { site, authentication } = ctx.store.getState()
		if(site.loading && authentication.token){
			// Fetch followed
			await ctx.store.dispatch(actions.fetchMyFollowed(
				authentication.token
			));
		}
	
		// Return some pageProps
		return {
			// Call App getInitialProps
			...(App.getInitialProps ? await App.getInitialProps(appContext) : {}),
			// Some custom thing for all pages
			pathname: ctx.pathname,
			mode,
			hasThemeCookie: !!getCookie('site-mode', ctx.req),
			locale,
			catalogs: {
				[locale]: catalog && catalog.default ? catalog.default : catalog
			}
		};
	}

	componentDidCatch(error, errorInfo) {
		Sentry.withScope((scope) => {
			Object.keys(errorInfo).forEach((key) => {
				scope.setExtra(key, errorInfo[key]);
			});

			Sentry.captureException(error);
		});

		super.componentDidCatch(error, errorInfo);
	}


	componentDidMount(){
		const state = this.props.store.getState();
		if(typeof window !== 'undefined'){
			if(window.matchMedia){
				// Do not use system theme if overridden with cookie
				if(this.props.hasThemeCookie) return;
				// If user has a system-wide dark theme
				if(window.matchMedia('(prefers-color-scheme: dark)').matches){
					this.props.store.dispatch({
						type: 'SET_DARK_MODE'
					});
					this.props.pageProps.mode = 'dark';
				}else if(window.matchMedia('(prefers-color-scheme: light)').matches){
					this.props.store.dispatch({
						type: 'SET_LIGHT_MODE'
					});
					this.props.pageProps.mode = 'light';
				}
			}
			// Initialize firebase messaging for current user
			initializeFirebase(() => {
				console.log('hi');
				console.log('inside firebase state ', state);
				if(state.authentication && state.authentication.token){
					initializePush(state.authentication.token);
				}
			});
		}
	}

	render() {
		const {Component, pageProps, store, locale, catalogs} = this.props;

		// Skip rendering when catalog isn't loaded.
		if (!catalogs[locale]) return null;

		const skipLayoutDestinations = ['/embed/[name]', '/chat/[name]'];
		const shouldSkip = this.props.pathname && skipLayoutDestinations.indexOf(this.props.pathname) === 0;

		return (
			<>
				<Provider store={store}>
        			<I18nProvider language={locale} catalogs={catalogs}>
						<PageLayout skip={shouldSkip}>
							<Component {...pageProps} {...{'log': log}} />
						</PageLayout>
					</I18nProvider>
				</Provider>
			</>
		);
	}
});