// pages/_app.js
import React from 'react';

import {Provider} from 'react-redux';
import App, {Container} from 'next/app';
import withRedux from 'next-redux-wrapper';

import configureStore from '../store/configureStore';

import PageLayout from '../components/layout/PageLayout';

import { getCookie } from '../utils/cookie';

import { library } from '@fortawesome/fontawesome-svg-core';

import { faBan, faCheck, faHourglass, faVideo } from '@fortawesome/free-solid-svg-icons';

library.add(faBan, faCheck, faHourglass, faVideo);
export default withRedux(configureStore)(class MyApp extends App {
	static async getInitialProps({Component, ctx}) {
		const uuidv4 = require('uuid/v4');
		const nonce = uuidv4();

		// In dev we allow 'unsafe-eval', so HMR doesn't trigger the CSP
		let devCsp = process.env.NODE_ENV !== 'production' ? "'unsafe-eval'" : '';
		let csp = `default-src 'self' guac.live *.guac.live privacy.guac.live localhost:*; base-uri 'self'; script-src 'self' ${devCsp} 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' 'unsafe-eval' www.google.com www.googletagmanager.com www.google-analytics.com www.gstatic.com *.googleapis.com guac.live *.guac.live privacy.guac.live localhost:* wss://chat.guac.live; child-src www.google.com guac.live *.guac.live privacy.guac.live localhost:* wss://chat.guac.live blob:; style-src 'self' 'unsafe-inline' *.googleapis.com use.fontawesome.com pro.fontawesome.com guac.live *.guac.live privacy.guac.live localhost:* cdnjs.cloudflare.com; img-src 'self' data: guac.live *.guac.live privacy.guac.live chat.guac.live *.googleapis.com *.gstatic.com www.google-analytics.com http: https:; media-src 'self' blob: guac.live *.guac.live privacy.guac.live localhost:* wss://chat.guac.live; connect-src 'self' guac.live *.guac.live privacy.guac.live localhost:* ws://chat.local.guac.live ws://chat.guac.live wss://guac.live wss://chat.guac.live ws://localhost:* wss://localhost:* ws://local.guac.live wss://local.guac.live www.google-analytics.com vendorlist.consensu.org api.betterttv.net api.frankerfacez.com twitchemotes.com; font-src 'self' use.fontawesome.com pro.fontawesome.com guac.live *.guac.live *.gstatic.com data: cdnjs.cloudflare.com; object-src 'none';`;
		if(ctx && ctx.req) ctx.req.nonce = nonce;
		if(ctx.res){
			if(ctx.res.setHeader){
				ctx.res.setHeader('content-security-policy', csp);
				ctx.res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
			}
		}
		let mode = getCookie('site-mode', ctx.req) === 'dark' ? 'SET_DARK_MODE' : 'SET_LIGHT_MODE';
		ctx.store.dispatch({
			type: mode
		});
		return {
			pageProps: {
				// Call page-level getInitialProps
				...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
				// Some custom thing for all pages
				pathname: ctx.pathname
			}
		};
	}

	render() {
		const {Component, pageProps, store} = this.props;
		return (
			<Container>
				<Provider store={store}>
					<PageLayout>
						<Component {...pageProps} />
					</PageLayout>
				</Provider>
			</Container>
		);
	}

});