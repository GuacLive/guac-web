// pages/_app.js
import React from 'react';

import {Provider} from 'react-redux';
import App, {Container} from 'next/app';
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

import { faBan, faCheck, faHourglass, faVideo, faSmileWink, faUser, faUserPlus, faSignInAlt, faSearch, faGamepad } from '@fortawesome/free-solid-svg-icons';

library.add(faBan, faCheck, faHourglass, faVideo, faSmileWink, faUser, faUserPlus, faSignInAlt, faSearch, faGamepad);
export default withRedux(configureStore)(class MyApp extends App {
	static async getInitialProps({Component, ctx}) {
		const uuidv4 = require('uuid/v4');
		const nonce = uuidv4();

		// Locale
		const locales = getLangs(ctx, 'languageOnly');
		const locale = getCookie('lang', ctx.req) || locales[0];
		
		let languageData = [];
		languageData['en'] = await import(`../locale/en/messages.po`);
		languageData['nb'] = await import(`../locale/nb/messages.po`);

		const catalog = languageData[locale];

		// Handle authenticaiton
		initialize(ctx);

		// In dev we allow 'unsafe-eval', so HMR doesn't trigger the CSP
		let devCsp = process.env.NODE_ENV !== 'production' ? "'unsafe-eval'" : '';
		let csp = `default-src 'self' guac.live *.guac.live privacy.guac.live localhost:*; base-uri 'self'; script-src 'self' ${devCsp} 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' 'unsafe-eval' www.google.com www.googletagmanager.com www.google-analytics.com www.gstatic.com *.googleapis.com guac.live *.guac.live privacy.guac.live localhost:* wss://chat.guac.live ajax.cloudflare.com; child-src www.google.com guac.live *.guac.live privacy.guac.live localhost:* wss://chat.guac.live blob:; style-src 'self' 'unsafe-inline' *.googleapis.com use.fontawesome.com pro.fontawesome.com guac.live *.guac.live privacy.guac.live localhost:* cdnjs.cloudflare.com; img-src 'self' data: guac.live *.guac.live privacy.guac.live chat.guac.live *.googleapis.com *.gstatic.com www.google-analytics.com *.giphy.com http: https:; media-src 'self' blob: guac.live *.guac.live privacy.guac.live localhost:* wss://chat.guac.live; connect-src 'self' guac.live *.guac.live privacy.guac.live localhost:* ws://chat.local.guac.live ws://chat.guac.live wss://guac.live wss://chat.guac.live ws://localhost:* wss://localhost:* ws://local.guac.live wss://local.guac.live ws://stream.local.guac.live wss://stream.local.guac.live ws://stream.guac.live wss://stream.guac.live ws://*.stream.guac.live wss://*.stream.guac.live www.google-analytics.com vendorlist.consensu.org api.betterttv.net api.frankerfacez.com twitchemotes.com *.giphy.com fcm.googleapis.com; font-src 'self' use.fontawesome.com pro.fontawesome.com guac.live *.guac.live *.gstatic.com data: cdnjs.cloudflare.com; object-src 'none';`;
		if(ctx && ctx.req) ctx.req.nonce = nonce;
		if(ctx.res){
			if(ctx.res.setHeader){
				ctx.res.setHeader('content-security-policy', csp);
				ctx.res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
				ctx.res.setHeader('X-Powered-By', 'tacos');
			}
		}

		// Handle site mode (dark/light mode)
		let mode = getCookie('site-mode', ctx.req) === 'dark' ? 'dark' : 'light';
		let type = mode === 'dark' ? 'SET_DARK_MODE' : 'SET_LIGHT_MODE';
		if(mode !== ctx.store.getState().site.mode){
			ctx.store.dispatch({
				type
			});
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
			pageProps: {
				// Call page-level getInitialProps
				...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
				// Some custom thing for all pages
				pathname: ctx.pathname,
				mode,
				locale,
				catalog
			}
		};
	}

	componentDidMount(){
		const state = this.props.store.getState();
		// Initialize firebase messaging for current user
		if(typeof window !== 'undefined'){
			let f = initializeFirebase();
			if(f){
				f.then(() => {
					initializePush(state.authentication.token);
				});
			}
		}
	}

	render() {
		const {Component, pageProps, store} = this.props;
		const {locale, catalog} = pageProps;
		return (
			<Container>
				<Provider store={store}>
        			<I18nProvider language={locale} catalogs={{ [locale]: catalog }}>
						<PageLayout>
							<Component {...pageProps} {...{'log': log}} />
						</PageLayout>
					</I18nProvider>
				</Provider>
			</Container>
		);
	}
});