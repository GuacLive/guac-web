// pages/_app.js
import React from 'react';
import { Fragment, useEffect, useState } from 'react';

import App from "next/app";
// Polyfill
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';

import { useDispatch, useSelector } from 'react-redux';

import { wrapper } from '../store/configureStore';

import PageLayout from '../components/layout/PageLayout';

import { getCookie } from '../utils/cookie';

import initialize from '../utils/initialize';

import log from '../utils/log';

import * as actions from '../actions';

import { getLangs } from '../utils/lang';

import { I18nProvider, useLingui } from '@lingui/react';
import { i18n } from '@lingui/core';
import { activate, isValidLocale } from '../utils/i18n';

import { initializeFirebase, initializePush } from '../utils/push-notification';

import ErrorBoundary from 'utils/ErrorBoundary';

import { config } from '@fortawesome/fontawesome-svg-core'

import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import { library } from '@fortawesome/fontawesome-svg-core';

import { faBan, faBars, faBell, faCheck, faCheckCircle, faClock, faCaretSquareLeft, faCaretSquareRight, faHourglass, faHome, faUser, faUserPlus, faSignInAlt, faSearch, faGamepad, faCog, faMinusCircle, faTrash, faEdit, faVideo, faEye, faEyeSlash, faPlus, faUserCog, faStar, faHammer, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import { faSmileWink, faImage, faPaperPlane } from '@fortawesome/free-regular-svg-icons';

import FeaturesService from 'utils/FeaturesService';

// We need to put these here, since Next only allows global.css in _app
import '../css/style.css';
import 'simplebar-react/dist/simplebar.min.css';
import '../css/select-search.css';
library.add(faBan, faBars, faBell, faCheck, faCheckCircle, faClock, faCaretSquareLeft, faCaretSquareRight, faHourglass, faHome, faImage, faPaperPlane, faSmileWink, faUser, faUserPlus, faSignInAlt, faSearch, faGamepad, faCog, faMinusCircle, faTrash, faEdit, faVideo, faEye, faEyeSlash, faPlus, faUserCog, faStar, faHammer, faSignOutAlt);

// Polyfill (browser-only)
if(typeof window !== 'undefined'){
	require('element-remove');
}
function I18nWatchLocale({children}) {
	const {i18n} = useLingui()

	// Skip render when locale isn't loaded
	if (!i18n.locale) return null

	// Force re-render when locale changes. Otherwise string translations (e.g.
	// t`Macro`) won't be updated.
	return <Fragment key={i18n.locale}>{children}</Fragment>
}
const skipLayoutDestinations = ['/embed/[name]', '/chat/[name]', '/overlay/[name]'];
const MyApp = (props) => {
	const dispatch = useDispatch();
	const [registered, setRegistered] = useState(false);
	const authentication = useSelector(state => state.authentication);
	// Load initial catalog based on locale
	activate(props.locale);
	useEffect(() => {
		if(typeof window !== 'undefined'){
			// Initialize firebase messaging for current user
			if (!registered) {
				initializeFirebase((reg) => {
					console.log('hi');
					if(authentication && authentication.token){
						initializePush(authentication.token, reg);
					}
					setRegistered(true);
				});
			}
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
	}, [authentication, dispatch, registered, props.hasThemeCookie, props.pageProps]);

	const { Component, pageProps, featuresService } = props;

	const shouldSkip = props.pathname && skipLayoutDestinations.indexOf(props.pathname) > -1;

	return (
		<ErrorBoundary>
			<I18nProvider i18n={i18n}>
				<I18nWatchLocale>
					<PageLayout skip={shouldSkip} nonce={props.nonce}>
						<Component {...pageProps} {...{'log': log}} featuresService={featuresService} err={props.err} />
					</PageLayout>
				</I18nWatchLocale>
			</I18nProvider>
		</ErrorBoundary>
	);
};
MyApp.getInitialProps = async appContext => {
	const { ctx }  = appContext;
	const { v4: uuidv4 } = require('uuid');
	const nonce = uuidv4();

	// Locale
	const locales = getLangs(ctx, 'languageOnly');
	var locale = getCookie('lang', ctx.req) || locales[0];

	// If locale does not match expected format, fallback to en
	if(!isValidLocale(locale)){
		locale = 'en';
	}

	// Load initial catalog based on locale
	activate(locale);

	// Handle authenticaiton
	initialize(ctx);

	if(ctx && ctx.req && locale) ctx.req.locale = locale;

	// If we are on server
	if(typeof window === 'undefined'){
		// In dev we allow 'unsafe-eval', so HMR doesn't trigger the CSP
		let devCsp = process.env.NODE_ENV !== 'production' ? "'unsafe-eval'" : '';
		let csp = `default-src 'self' guac.live *.guac.live privacy.guac.live localhost:* googleads.g.doubleclick.net www.patreon.com bid.g.doubleclick.net; base-uri 'self'; script-src 'self' ${devCsp} 'nonce-${nonce}' 'strict-dynamic' pagead2.googlesyndication.com partner.googleadservices.com tpc.googlesyndication.com www.googletagservices.com adservice.google.com adservice.google.ad adservice.google.ae adservice.google.com.af adservice.google.com.ag adservice.google.com.ai adservice.google.al adservice.google.am adservice.google.co.ao adservice.google.com.ar adservice.google.as adservice.google.at adservice.google.com.au adservice.google.az adservice.google.ba adservice.google.com.bd adservice.google.be adservice.google.bf adservice.google.bg adservice.google.com.bh adservice.google.bi adservice.google.bj adservice.google.com.bn adservice.google.com.bo adservice.google.com.br adservice.google.bs adservice.google.bt adservice.google.co.bw adservice.google.by adservice.google.com.bz adservice.google.ca adservice.google.cd adservice.google.cf adservice.google.cg adservice.google.ch adservice.google.ci adservice.google.co.ck adservice.google.cl adservice.google.cm adservice.google.cn adservice.google.com.co adservice.google.co.cr adservice.google.com.cu adservice.google.cv adservice.google.com.cy adservice.google.cz adservice.google.de adservice.google.dj adservice.google.dk adservice.google.dm adservice.google.com.do adservice.google.dz adservice.google.com.ec adservice.google.ee adservice.google.com.eg adservice.google.es adservice.google.com.et adservice.google.fi adservice.google.com.fj adservice.google.fm adservice.google.fr adservice.google.ga adservice.google.ge adservice.google.gg adservice.google.com.gh adservice.google.com.gi adservice.google.gl adservice.google.gm adservice.google.gr adservice.google.com.gt adservice.google.gy adservice.google.com.hk adservice.google.hn adservice.google.hr adservice.google.ht adservice.google.hu adservice.google.co.id adservice.google.ie adservice.google.co.il adservice.google.im adservice.google.co.in adservice.google.iq adservice.google.is adservice.google.it adservice.google.je adservice.google.com.jm adservice.google.jo adservice.google.co.jp adservice.google.co.ke adservice.google.com.kh adservice.google.ki adservice.google.kg adservice.google.co.kr adservice.google.com.kw adservice.google.kz adservice.google.la adservice.google.com.lb adservice.google.li adservice.google.lk adservice.google.co.ls adservice.google.lt adservice.google.lu adservice.google.lv adservice.google.com.ly adservice.google.co.ma adservice.google.md adservice.google.me adservice.google.mg adservice.google.mk adservice.google.ml adservice.google.com.mm adservice.google.mn adservice.google.ms adservice.google.com.mt adservice.google.mu adservice.google.mv adservice.google.mw adservice.google.com.mx adservice.google.com.my adservice.google.co.mz adservice.google.com.na adservice.google.com.ng adservice.google.com.ni adservice.google.ne adservice.google.nl adservice.google.no adservice.google.com.np adservice.google.nr adservice.google.nu adservice.google.co.nz adservice.google.com.om adservice.google.com.pa adservice.google.com.pe adservice.google.com.pg adservice.google.com.ph adservice.google.com.pk adservice.google.pl adservice.google.pn adservice.google.com.pr adservice.google.ps adservice.google.pt adservice.google.com.py adservice.google.com.qa adservice.google.ro adservice.google.ru adservice.google.rw adservice.google.com.sa adservice.google.com.sb adservice.google.sc adservice.google.se adservice.google.com.sg adservice.google.sh adservice.google.si adservice.google.sk adservice.google.com.sl adservice.google.sn adservice.google.so adservice.google.sm adservice.google.sr adservice.google.st adservice.google.com.sv adservice.google.td adservice.google.tg adservice.google.co.th adservice.google.com.tj adservice.google.tl adservice.google.tm adservice.google.tn adservice.google.to adservice.google.com.tr adservice.google.tt adservice.google.com.tw adservice.google.co.tz adservice.google.com.ua adservice.google.co.ug adservice.google.co.uk adservice.google.com.uy adservice.google.co.uz adservice.google.com.vc adservice.google.co.ve adservice.google.vg adservice.google.co.vi adservice.google.com.vn adservice.google.vu adservice.google.ws adservice.google.rs adservice.google.co.za adservice.google.co.zm adservice.google.co.zw adservice.google.cat www.google.com www.googletagmanager.com www.google-analytics.com www.gstatic.com *.googleapis.com guac.live *.guac.live cheese.guac.live privacy.guac.live secure.quantserve.com quantcast.mgr.consensu.org localhost:* c6.patreon.com static.cloudflareinsights.com wss://chat.guac.live wss://viewer-api.guac.live cdn.ravenjs.com; child-src googleads.g.doubleclick.net tpc.googlesyndication.com googlesyndication.com *.googlesyndication.com www.google.com guac.live *.guac.live cdn.guac.live privacy.guac.live quantcast.mgr.consensu.org localhost:* patreon.com www.patreon.com youtube.com www.youtube.com wss://chat.guac.live wss://viewer-api.guac.live blob:; style-src 'self' 'unsafe-inline' *.googleapis.com use.fontawesome.com kit.fontawesome.com pro.fontawesome.com guac.live *.guac.live privacy.guac.live quantcast.mgr.consensu.org localhost:*; img-src 'self' data: blob: guac.live *.guac.live cdn.guac.live emotes.guac.live privacy.guac.live googleads.g.doubleclick.net www.google.com quantcast.mgr.consensu.org cdn.7tv.app cheese.guac.live chat.guac.live viewer-api.guac.live *.googleapis.com *.gstatic.com www.google-analytics.com c6.patreon.com *.giphy.com android-webview-video-poster: http: https:; media-src 'self' blob: data: guac.live *.guac.live cdn.guac.live privacy.guac.live quantcast.mgr.consensu.org *.giphy.com media.giphy.com giphy.com localhost:* wss://chat.guac.live wss://viewer-api.guac.live; connect-src 'self' guac.live *.guac.live cdn.guac.live emotes.guac.live privacy.guac.live ka-p.fontawesome.com quantcount.com partner.googleadservices.com csi.gstatic.com adservice.google.no adservice.google.com pagead2.googlesyndication.com quantcast.mgr.consensu.org api.7tv.app nttpf0l7a8eq71c8oqmhd5r3a.litix.io *.quantcast.mgr.consensu.org firebaseinstallations.googleapis.com fcmregistrations.googleapis.com localhost:* c6.patreon.com ws://chat.local.guac.live ws://viewer-api.guac.live ws://chat.guac.live wss://guac.live wss://chat.guac.live wss://viewer-api.guac.live ws://localhost:* wss://localhost:* ws://local.guac.live wss://local.guac.live ws://stream.local.guac.live wss://stream.local.guac.live ws://stream.guac.live wss://stream.guac.live ws://*.stream.guac.live wss://*.stream.guac.live www.google-analytics.com vendorlist.consensu.org api.betterttv.net api.frankerfacez.com api2.frankerfacez.com api-test.frankerfacez.com twitchemotes.com *.giphy.com fcm.googleapis.com https://o222117.ingest.sentry.io https://sentry.io blob:; font-src 'self' use.fontawesome.com ka-p.fontawesome.com kit.fontawesome.com pro.fontawesome.com guac.live *.guac.live *.gstatic.com data:; object-src 'none'; report-uri https://o222117.ingest.sentry.io/api/1369483/security/?sentry_key=8dacf1eaf9c24bcfbc37284e60cf6f9b;`;

		if(ctx && ctx.req) ctx.req.nonce = nonce;
		if(ctx.res){
			if(ctx.res.setHeader){
				ctx.res.setHeader('content-security-policy', csp);
				ctx.res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=0, must-revalidate');
				ctx.res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
				ctx.res.setHeader('permissions-policy', 'sync-xhr=(),document-domain=(),interest-cohort=()');
				ctx.res.setHeader('strict-transport-security', 'max-age=15552000; includeSubDomains');
				ctx.res.setHeader('X-Content-Type-Options', 'nosniff');
				ctx.res.setHeader('X-Powered-By', 'tacos');
				// Only allow framing embeds
				if(skipLayoutDestinations.indexOf(ctx.pathname) === -1){
					ctx.res.setHeader('X-Frame-Options', 'SAMEORIGIN');
				}
			}
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
	if(site.loading && authentication && authentication.token){
		// Fetch followed
		await ctx.store.dispatch(actions.fetchMyFollowed(
			authentication.token
		));
	}

	const featuresService = new FeaturesService();
	// Return some pageProps
	return {
		// Call App getInitialProps
		...(App.getInitialProps ? await App.getInitialProps(appContext) : {}),
		// Some custom thing for all pages
		pathname: ctx.pathname,
		mode,
		nonce,
		hasThemeCookie: !!getCookie('site-mode', ctx.req),
		locale,
		featuresService
	};
};
export default wrapper.withRedux(MyApp);