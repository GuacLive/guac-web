import Link from 'next/link'
import Head from 'next/head'

import { Fragment } from 'react';

import {connect} from 'react-redux';

import css from '../../css/style.css'

const PageLayout = ({ children, title = '' }) => (
	<Fragment>
		<Head>
			<title>{ title }{ title.length > 0 ? ' | guac.live' : 'guac.live'}</title>
			<meta charSet='utf-8' />
			<meta name='viewport' content='initial-scale=1.0, width=device-width' />
		</Head>
		<main className="w-100 h-100 flex flex-column justify-between page-wrapper">
			<header className="z-5 w-100 ph3 pv2 bg-near-black flex flex-row justify-center items-center">
				<div className="w-100 ph5-l flex flex-row justify-between items-center flex-wrap flex-nowrap-ns">
					<div className="flex flex-row justify-center justify-start-l">
						<a className="f2 b link dim ba b--transparent db pa1 br-100 fl-l content-box" href="/">
							<img className="dib h2" src="/static/img/header-logo.png" alt="guac.live" />
						</a>
					</div>
					<form className="w-30 db db-m flex-ns flex-row-ns self-center-ns overflow-x-visible-ns">
						<input type="text" className="input-reset bn pa3 w-100 bg-white br2" placeholder="Search..." />
					</form>
					<nav className="db db-m flex-ns flex-row-ns self-center-ns overflow-x-visible-ns">
						<a className="b link white hover-light-green ml3" href="/channels">Channels</a>
						<a className="b link white hover-light-green ml3" href="/games">Games</a>
					</nav>
				</div>
			</header>

			<div className="w-100 flex flex-column items-start mw9-l pa3">
				{ children }
			</div>

			<footer className="bg-near-black white pv4 pv5-l ph4">
				<p className="f6">
					<span className="dib mr4 mr5-ns ttu tracked">© {(new Date()).getFullYear()} guac.live</span>
					<a className="link white-80 hover-light-purple" href="/terms">Terms</a> /
					<a className="link white-80 hover-gold" href="/privacy"> Privacy </a> /
					<a className="link white-80 hover-green" href="#"> contact@guac.live </a>
				</p>
			</footer>
		</main>
	</Fragment>
);
export default connect(state => state)(PageLayout);