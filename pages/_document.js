import Document, { Head, Main, NextScript } from 'next/document'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
const { OIL_CONFIG } = publicRuntimeConfig

import { getCookie } from '../utils/cookie';
export default class MyDocument extends Document {
	static getInitialProps({req, renderPage}) {
		const { html, head, errorHtml, chunks } = renderPage()
		let mode = getCookie('site-mode', req) === 'dark' ? 'dark' : 'light';
		return { html, head, errorHtml, chunks, 'nonce': req.nonce, mode }

	}
	render() {
		const {nonce} = this.props;
		let oil = `/*! 1.2.5-SNAPSHOT */!function(e){var n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="/",t(t.s=115)}({115:function(e,n,t){"use strict";!function(e,n){e.__cmp||(e.__cmp=function(){function t(e){if(e){var t=!0,r=n.querySelector('script[type="application/configuration"]#oil-configuration');if(null!==r&&r.text)try{var a=JSON.parse(r.text);a&&a.hasOwnProperty("gdpr_applies_globally")&&(t=a.gdpr_applies_globally)}catch(e){}e({gdprAppliesGlobally:t,cmpLoaded:o()},!0)}}function o(){return!(!e.AS_OIL||!e.AS_OIL.commandCollectionExecutor)}!function e(){if(!(n.getElementsByName("__cmpLocator").length>0))if(n.body){var t=n.createElement("iframe");t.style.display="none",t.name="__cmpLocator",n.body.appendChild(t)}else setTimeout(e,5)}();var r=[],a=function(n,a,c){if("ping"===n)t(c);else{var i={command:n,parameter:a,callback:c};r.push(i),o()&&e.AS_OIL.commandCollectionExecutor(i)}};return a.commandCollection=r,a.receiveMessage=function(n){var a=n&&n.data,c="string"==typeof a;if(a=c&&-1!==a.indexOf("__cmpCall")?JSON.parse(a).__cmpCall:a.__cmpCall)if("ping"===a.command)t(function(e,t){var o={__cmpReturn:{returnValue:e,success:t,callId:a.callId}};n.source.postMessage(c?JSON.stringify(o):o,n.origin)});else{var i={callId:a.callId,command:a.command,parameter:a.parameter,event:n};r.push(i),o()&&e.AS_OIL.commandCollectionExecutor(i)}},function(n){var t=e.addEventListener||e.attachEvent;t("attachEvent"===t?"onmessage":"message",function(e){n.receiveMessage(e)},!1)}(a),a}())}(window,document)}});`;
		return (
		<html data-cast-api-enabled="true" className={this.props.mode === 'dark' ? 'guac-skin-dark': 'guac-skin-light'}>
			<Head nonce={nonce}>
				<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick-theme.min.css" />
				<script type="text/javascript" src="//www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1" nonce={this.props.nonce}></script>
				<script type="application/configuration" id="oil-configuration" dangerouslySetInnerHTML={{__html: JSON.stringify(OIL_CONFIG)}}></script>
				<script type="text/javascript" dangerouslySetInnerHTML={{__html: oil}} nonce={nonce}></script>
				<script type="text/javascript" src="//privacy.guac.live/scripts/oil.1.2.5-RELEASE.min.js" nonce={nonce}></script>
			</Head>
			<body className="sans-serif h-100 w-100">
				<Main />
				<NextScript nonce={nonce} />
			</body>
		</html>
		)
	}
}