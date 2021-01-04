import Document, {Html, Head, Main, NextScript} from 'next/document';
import * as Sentry from '@sentry/node';

process.on('unhandledRejection', (err) => {
	Sentry.captureException(err);
});

process.on('uncaughtException', (err) => {
	Sentry.captureException(err);
});

import {getCookie} from '../utils/cookie';
export default class MyDocument extends Document {
	static getInitialProps({req, renderPage}) {
		const {html, head, errorHtml, chunks} = renderPage()
		let mode = getCookie('site-mode', req) === 'dark' ? 'dark' : 'light';
		return {html, head, errorHtml, chunks, nonce: req.nonce, locale: req.locale, mode}
	}

	render() {
		const {nonce} = this.props;
		const { page } = this.props.__NEXT_DATA__;
		let shouldSkipQuant = `var skipLayoutDestinations=["embed","chat","overlay"],shouldSkip=window.location.pathname&&-1<skipLayoutDestinations.indexOf(window.location.pathname.split('/')[1]);`;
		let quantCSS = `.qc-cmp2-container>a,.qc-cmp2-footer div button[mode="primary"]{background-color:#19a974!important}.qc-cmp2-footer div button[mode="secondary"]:hover{background:#19a974!important;border-color:transparent!important;color:inherit!important}.qc-cmp2-footer div button[mode="link"]:not(.qc-cmp2-link-active){color:#19a974!important}.qc-cmp2-footer div button[mode="secondary"]{color:#19a974!important;border-color:#19a974!important}.qc-cmp2-buttons-desktop button,.qc-cmp2-footer-links button,.qc-cmp2-summary-buttons button{align-items:center!important;justify-content:center!important}`;
		let quant = `!function(){if(!shouldSkip){var e=window.location.hostname,t=document.createElement("script"),a=document.getElementsByTagName("script")[0],n="https://quantcast.mgr.consensu.org".concat("/choice/","ApXc11SvmTDme","/",e,"/choice.js"),i=0;t.async=!0,t.type="text/javascript",t.src=n,a.parentNode.insertBefore(t,a),function(){for(var e,t="__tcfapiLocator",a=[],n=window;n;){try{if(n.frames[t]){e=n;break}}catch(e){}if(n===window.top)break;n=n.parent}e||(function e(){var a=n.document,i=!!n.frames[t];if(!i)if(a.body){var o=a.createElement("iframe");o.style.cssText="display:none",o.name=t,a.body.appendChild(o)}else setTimeout(e,5);return!i}(),n.__tcfapi=function(){var e,t=arguments;if(!t.length)return a;if("setGdprApplies"===t[0])t.length>3&&2===t[2]&&"boolean"==typeof t[3]&&(e=t[3],"function"==typeof t[2]&&t[2]("set",!0));else if("ping"===t[0]){var n={gdprApplies:e,cmpLoaded:!1,cmpStatus:"stub"};"function"==typeof t[2]&&t[2](n)}else a.push(t)},n.addEventListener("message",function(e){var t="string"==typeof e.data,a={};try{a=t?JSON.parse(e.data):e.data}catch(e){}var n=a.__tcfapiCall;n&&window.__tcfapi(n.command,n.version,function(a,i){var o={__tcfapiReturn:{returnValue:a,success:i,callId:n.callId}};t&&(o=JSON.stringify(o)),e.source.postMessage(o,"*")},n.parameter)},!1))}();var o=function(){var e=arguments;typeof window.__uspapi!==o&&setTimeout(function(){void 0!==window.__uspapi&&window.__uspapi.apply(window.__uspapi,e)},500)};if(void 0===window.__uspapi){window.__uspapi=o;var s=setInterval(function(){i++,window.__uspapi===o&&i<3?console.warn("USP is not accessible"):clearInterval(s)},6e3)}}}();`;
		let darkMode = 'function prefersDarkMode(){var e=window.CSS&&window.CSS.supports.bind(window.CSS)||window.supportsCSS;return!!(!!e&&(e("--f:0")||e("--f",0)))&&(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)}-1!==document.cookie.indexOf("site-mode=dark"),("dark"===localStorage.getItem("site_mode")||prefersDarkMode())&&document.querySelector("html").classList.replace("guac-skin-light","guac-skin-dark")';
		let event = 'window.sa_event=window.sa_event||function(){a=[].slice.call(arguments);sa_event.q?sa_event.q.push(a):sa_event.q=[a]};';
		//let perf = 'hydrationMetrics&&hydrationMetrics.onInputDelay&&performance&&hydrationMetrics.onInputDelay(function(e,n){sa_event("event",{eventCategory:"Perf Metrics",eventAction:"first-input-delay",eventLabel:n.type,eventValue:Math.round(e),nonInteraction:!0})});';
		// Workaround for background-color being set on body
		let bodyClassName = `sans-serif`;
		if(page && page === '/overlay/[name]'){
			bodyClassName += ' overlay';
		}
		return (
			<Html lang={this.props.locale} data-cast-api-enabled="true" id="guac" className={this.props.mode === 'dark' ? 'guac-skin-dark' : 'guac-skin-light'}>
				<Head nonce={nonce}>
					<script async defer type="text/javascript" src="//www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1" nonce={this.props.nonce}></script>
					<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.1/css/solid.css" integrity="sha384-yo370P8tRI3EbMVcDU+ziwsS/s62yNv3tgdMqDSsRSILohhnOrDNl142Df8wuHA+" crossOrigin="anonymous" />
					<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.1/css/brands.css" integrity="sha384-/feuykTegPRR7MxelAQ+2VUMibQwKyO6okSsWiblZAJhUSTF9QAVR0QLk6YwNURa" crossOrigin="anonymous" />
					<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.1/css/fontawesome.css" integrity="sha384-ijEtygNrZDKunAWYDdV3wAZWvTHSrGhdUfImfngIba35nhQ03lSNgfTJAKaGFjk2" crossOrigin="anonymous" />


					<link rel="manifest" href="/manifest.json" />
					<link rel="preconnect" href="https://static.cloudflareinsights.com/" />
					<link rel="preconnect" href="https://use.fontawesome.com/" />
					<link rel="preconnect" href="https://privacy.guac.live/" />
					<link rel="preconnect" href="https://api.guac.live/" />
					<link rel="preconnect" href="https://stream.guac.live/" />
					<link rel="preconnect" href="https://emotes.guac.live/" />
					<link rel="preconnect" href="https://media.rawg.io/" />

					<meta charSet='utf-8' />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta name="apple-touch-fullscreen" content="yes" />
					<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

					<script type="text/javascript" dangerouslySetInnerHTML={{__html: shouldSkipQuant}} nonce={nonce}></script>
					<script type="text/javascript" dangerouslySetInnerHTML={{__html: quant}} nonce={nonce} async={true}></script>
					<script type="text/javascript" dangerouslySetInnerHTML={{__html: event}} nonce={nonce}></script>
					<script type="text/javascript" dangerouslySetInnerHTML={{__html: darkMode}} nonce={nonce}></script>
					<script data-ad-client="ca-pub-4396633769039638" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" nonce={nonce}></script>
					<script type="application/ld+json" dangerouslySetInnerHTML={{__html: '[{"@context":"http://schema.org","@graph":{"sameAs":["https://www.facebook.com/guaclive/","https://twitter.com/guaclive"],"@type":"Organization","@id":"https://guac.live/","name":"guac.live","url":"https://guac.live/"}}]'}}></script>
					<style type="text/css" nonce={nonce} dangerouslySetInnerHTML={{__html: quantCSS}}></style>
				</Head>
				<body className={bodyClassName}>
					<Main />
					<NextScript nonce={nonce} />
					<script async defer src="https://cheese.guac.live/app.js" nonce={nonce}></script>
					<noscript><img src="https://cheese.guac.live/image.gif" alt="" /></noscript>
				</body>
			</Html>
		)
	}
}