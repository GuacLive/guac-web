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
		let shouldSkipQuant = `var skipLayoutDestinations=["embed","chat","overlay"],shouldSkip=window.location.pathname&&-1<skipLayoutDestinations.indexOf(window.location.pathname.split('/')[1]);`;
		let quantCSS = `.qc-cmp2-container>a,.qc-cmp2-footer div button[mode="primary"]{background-color:#19a974!important}.qc-cmp2-footer div button[mode="secondary"]:hover{background:#19a974!important;border-color:transparent!important;color:inherit!important}.qc-cmp2-footer div button[mode="link"]:not(.qc-cmp2-link-active){color:#19a974!important}.qc-cmp2-footer div button[mode="secondary"]{color:#19a974!important;border-color:#19a974!important}.qc-cmp2-buttons-desktop button,.qc-cmp2-footer-links button,.qc-cmp2-summary-buttons button{align-items:center!important;justify-content:center!important}`;
		let quant = `!shouldSkip&&!function(){var e=window.location.hostname,t=document.createElement("script"),a=document.getElementsByTagName("script")[0],n=(new Date).getTime(),c="https://quantcast.mgr.consensu.org".concat("/choice/","ApXc11SvmTDme","/",e,"/choice.js").concat("?timestamp=",n);function o(){var e,c="__tcfapiLocator",n=[],o=window;for(;o;){try{if(o.frames[c]){e=o;break}}catch(e){}if(o===window.top)break;o=o.parent}e||(!function e(){var t=o.document,a=!!o.frames[c];if(!a)if(t.body){var n=t.createElement("iframe");n.style.cssText="display:none",n.name=c,t.body.appendChild(n)}else setTimeout(e,5);return!a}(),o.__tcfapi=function(){var e,t=arguments;if(!t.length)return n;if("setGdprApplies"===t[0])3<t.length&&2===t[2]&&"boolean"==typeof t[3]&&(e=t[3],"function"==typeof t[2]&&t[2]("set",!0));else if("ping"===t[0]){var a={gdprApplies:e,cmpLoaded:!1,cmpStatus:"stub"};"function"==typeof t[2]&&t[2](a)}else n.push(t)},o.addEventListener("message",function(n){var c="string"==typeof n.data,e={};try{e=c?JSON.parse(n.data):n.data}catch(e){}var o=e.__tcfapiCall;o&&window.__tcfapi(o.command,o.version,function(e,t){var a={__tcfapiReturn:{returnValue:e,success:t,callId:o.callId}};c&&(a=JSON.stringify(a)),n.source.postMessage(a,"*")},o.parameter)},!1))}t.async=!0,t.type="text/javascript",t.src=c,a.parentNode.insertBefore(t,a),"undefined"!=typeof module?module.exports=o:o()}();`;
		let darkMode = 'function prefersDarkMode(){var e=window.CSS&&window.CSS.supports.bind(window.CSS)||window.supportsCSS;return!!(!!e&&(e("--f:0")||e("--f",0)))&&(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)}-1!==document.cookie.indexOf("site-mode=dark"),("dark"===localStorage.getItem("site_mode")||prefersDarkMode())&&document.querySelector("html").classList.replace("guac-skin-light","guac-skin-dark")';
		let event = 'window.sa_event=window.sa_event||function(){a=[].slice.call(arguments);sa_event.q?sa_event.q.push(a):sa_event.q=[a]};';
		//let perf = 'hydrationMetrics&&hydrationMetrics.onInputDelay&&performance&&hydrationMetrics.onInputDelay(function(e,n){sa_event("event",{eventCategory:"Perf Metrics",eventAction:"first-input-delay",eventLabel:n.type,eventValue:Math.round(e),nonInteraction:!0})});';
		return (
			<Html lang={this.props.locale} data-cast-api-enabled="true" id="guac" className={this.props.mode === 'dark' ? 'guac-skin-dark' : 'guac-skin-light'}>
				<Head nonce={nonce}>
					<script async defer type="text/javascript" src="//www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1" nonce={this.props.nonce}></script>
					<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.14.0/css/solid.css" integrity="sha384-TN9eFVoW87zV3Q7PfVXNZFuCwsmMwkuOTOUsyESfMS9uwDTf7yrxXH78rsXT3xf0" crossorigin="anonymous" />
					<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.14.0/css/brands.css" integrity="sha384-MiOGyNsVTeSVUjE9q/52dpdZjrr7yQAjVRUs23Bir5NhrTq0YA0rny4u/qe4dxNj" crossorigin="anonymous" />
					<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.14.0/css/fontawesome.css" integrity="sha384-PRy/NDAXVTUcXlWA3voA+JO/UMtzWgsYuwMxjuu6DfFPgzJpciUiPwgsvp48fl3p" crossorigin="anonymous" />

					<link rel="manifest" href="/manifest.json" />
					<link rel="preconnect" href="https://static.cloudflareinsights.com/" />
					<link rel="preconnect" href="https://use.fontawesome.com/" />
					<link rel="preconnect" href="https://privacy.guac.live/" />
					<link rel="preconnect" href="https://api.guac.live/" />
					<link rel="preconnect" href="https://stream.guac.live/" />
					<link rel="preconnect" href="https://emotes.guac.live/" />

					<meta charSet='utf-8' />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta name="apple-touch-fullscreen" content="yes" />
					<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

					<script type="text/javascript" dangerouslySetInnerHTML={{__html: shouldSkipQuant}} nonce={nonce}></script>
					<script type="text/javascript" dangerouslySetInnerHTML={{__html: quant}} nonce={nonce}></script>
					<script type="text/javascript" dangerouslySetInnerHTML={{__html: event}} nonce={nonce}></script>
					<script type="text/javascript" dangerouslySetInnerHTML={{__html: darkMode}} nonce={nonce}></script>
					<script type="application/ld+json" dangerouslySetInnerHTML={{__html: '[{"@context":"http://schema.org","@graph":{"sameAs":["https://www.facebook.com/guaclive/","https://twitter.com/guaclive"],"@type":"Organization","@id":"https://guac.live/","name":"guac.live","url":"https://guac.live/"}}]'}}></script>
					<style type="text/css" nonce={nonce} dangerouslySetInnerHTML={{__html: quantCSS}}></style>
				</Head>
				<body className="sans-serif">
					<Main />
					<NextScript nonce={nonce} />
					<script async defer src="https://cheese.guac.live/app.js" nonce={nonce}></script>
					<noscript><img src="https://cheese.guac.live/image.gif" alt="" /></noscript>
				</body>
			</Html>
		)
	}
}