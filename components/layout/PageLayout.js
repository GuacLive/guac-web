import Link from 'next/link'
import Head from 'next/head'

import { Fragment, useState, useEffect, useLayoutEffect } from 'react';

import {connect} from 'react-redux';

import SimpleBar from 'simplebar-react';

import * as actions from '../../actions';


import { useLingui } from "@lingui/react";
import { Trans, t } from '@lingui/macro';
import LangSwitcher from '../LangSwitcher';

import Image from '../Image';

import GuacButton from '../GuacButton';
import DarkModeToggle from '../DarkModeToggle';
import AccountMenu from './AccountMenu';
import SearchBar from '../Search/SearchBar';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
	Tooltip,
  } from 'react-tippy';
  
const mediaQueryList = typeof window !== 'undefined' 
	&& window.matchMedia('screen and (min-width: 960px)');
function PageLayout(props){
	const { i18n } = useLingui();
	const [showSidebar, setShowSidebar] = useState(true);
	const [overrideSidebar, setOverrideSidebar] = useState(false);

	const updateViewport = () => {
		if(
			typeof document !== 'undefined'
		){
			let vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		}
	};

	const updateDimensions = (evt) => {
		let ssb = evt && evt.matches;
		// If media query is now matching, reset overriden sidebar
		if(showSidebar === true && showSidebar !== ssb){
			ssb = false;
		}
		console.log('updateDimensions', evt);
		if(
			typeof document !== 'undefined'
			&& document.documentElement
			&& document.documentElement.classList
		){
			if(showSidebar || overrideSidebar){
				document.documentElement.classList.add('toggled-sidebar');
			}else{
				document.documentElement.classList.remove('toggled-sidebar');
			}
		}
		setShowSidebar(ssb);
	};

	if(process.browser){
		useLayoutEffect(() => {
			// This a hack to fix vh
			updateViewport();
			window.addEventListener('resize', updateViewport);
	
			// This is the logic that handles sidebar
			if(mediaQueryList){
				mediaQueryList.addListener(updateDimensions);
			}
			updateDimensions(mediaQueryList);
			return () => {
				window.removeEventListener('resize', updateViewport);
				mediaQueryList.removeListener(updateDimensions);
			};
		}, []);
	}

	useEffect(() => {
		if(props.mode){
			if(document) document.documentElement.className = `guac-skin-${props.mode}`;
		}
	}, [props.mode]);

	let {children, isAuthenticated, user, followed} = props;
	let title = props.title ? props.title : '';

	if(props.skip){
		return <Fragment>{children}</Fragment>;
	}

	const SideBarComponent = (
		<aside className="fixed flex flex-column vh-100 flex-shrink-1 mv2-l site-component-sidebar bg-near-black">
			<div className="flex flex-column h-100">
				<nav className="flex flex-column h-100 relative">
					<span className="f5 b inline-flex ph3 light-gray">
						<Trans>Followed Channels</Trans>
					</span>
					<SimpleBar className="flex-shrink-0 h-100 relative">
						{
							(!followed ||
								!followed.length)
							&&
							<div className="align-center flex-l dn flex-column relative ph4 pv2 white">
								<Trans>Start following your favorite streamers to find them quickly!</Trans>
							</div>
						}
						{
							followed &&
							[].concat(followed)
								.sort((a, b) => {
									if (a.live === b.live) {
										return 1;
									} else if (a.live) {
										return 0;
									} else {
										return -1;
									}
								})
								.map((u) => {
									return (
										<Link key={'followed-' + u.username} href="/c/[name]" as={`/c/${u.username}`}>
											<a className="site-component-fUser link white">
												<Tooltip
													// options
													title={u.title}
													position="right"
													trigger="mouseenter"
													theme="transparent"
													className="items-center flex flex-nowrap ph3 pv2 hover-bg-dark-gray bg-animate"
													style={{'display': 'flex !important'}}
												>
													<div className="items-center flex-shrink-0">
														<Image
															src={u.avatar || '//api.guac.live/avatars/unknown.png'}
															alt={u.username}
															shape="squircle"
															fit="cover"
															className={`ba ${+u.live ? 'b--red' : 'b--transparent'} v-mid w2 h2`}
														/>
													</div>
													<div className="dn flex-l justify-between truncate w-100">
														<div className="site-component-fMetadata truncate w-100 ml3">
															<div className="site-component-fUser__name flex items-center">
																<span className="truncate white flex-grow-1 b lh-title">{u.username}</span>
															</div>
															<div className="site-component-fUser__category pr2">
																<span className="f6 lh-title">{u.category_name}</span>
															</div>
														</div>
														<div className="site-component-fLive flex-shrink-0 ml2">
															<div className="flex items-center">
																{
																	+u.live
																		?
																		<span className="ph2 bg-red f6 tc inline-flex truncate white flex-grow-1 lh-title mh3">LIVE</span>
																		:
																		<span className="ph2 f6 tc inline-flex truncate white flex-grow-1 lh-title mh3">Offline</span>
																}
															</div>
														</div>
													</div>
												</Tooltip>
											</a>
										</Link>
									)
								})
						}
					</SimpleBar>
				</nav>
				<footer className="flex bg-near-black white ph4 ph2-m mb5">
					<div className="f6 flex flex-column flex-grow-1">
						<span className="dib mr4 mr5-ns ttu tracked">© {(new Date()).getFullYear()} guac.live</span>
						<span className="dib mr4 mr5-ns f7 silver">v{process.env.SENTRY_RELEASE}</span>
						<Link href="/terms">
							<a className="link white-80 hover-light-purple"><Trans>Terms</Trans></a>
						</Link>
						<Link href="/privacy">
							<a className="link white-80 hover-gold"> <Trans>Privacy</Trans> </a>
						</Link>
						<Link href="/dmca">
							<a className="link white-80 hover-red"> <Trans>DMCA</Trans> </a>
						</Link>
						<Link href="#">
							<a className="link white-80 hover-green"> contact@guac.live </a>
						</Link>
						<LangSwitcher />
					</div>
				</footer>
			</div>
		</aside>
	);
	return (
		<Fragment>
			<Head>
				<title>{title}{title.length > 0 ? ' &middot; guac.live' : 'guac.live'}</title>

				<meta property="og:type" content="website" key="og:type" />
				<meta property="og:url" content="https://guac.live/" key="og:url" />
				<meta property="og:title" content="guac.live — live streaming platform" key="og:title" />
				<meta property="og:description" content="guac is a live streaming platform." key="og:description" />
				<meta property="og:image" content="https://guac.live/img/header-logo.png" key="og:image" />
				<meta property="twitter:card" content="summary_large_image" key="twitter:card" />
				<meta property="twitter:url" content="https://guac.live" key="twitter:url" />
				<meta property="twitter:title" content="guac.live — live streaming platform" key="twitter:title" />
				<meta property="twitter:site" content="@GuacLive" key="twitter:site" />
				<meta property="twitter:creator" content="@datagutt" key="twitter:creator" />
				<meta property="twitter:description" content="guac is a live streaming platform." key="twitter:description" />
				<meta property="twitter:image" content="https://guac.live/img/header-logo.png" key="twitter:image" />
				<script type="text/javascript" src="//privacy.guac.live/release/current/oil.1.3.5-RELEASE.min.js" nonce={props.nonce}></script>
			</Head>
			<main className="w-100 h-100 flex flex-column flex-nowrap justify-between items-start page-wrapper">
				<header className="site-component-header z-5 w-100 fixed ph3 pv2 bg-near-black ml-auto flex-shrink-0">
					<div className="h-100 flex items-stretch flex-nowrap">
						<div className="dn flex-l flex-shrink-0 items-center pointer">
							<Link href="/">
								<a className="inline-flex pa2 content-box">
									<Image className="h2" src="/img/header-logo.png" alt="guac.live" />
								</a>
							</Link>
						</div>
						<div className="dn-l flex-shrink-0 pointer pa2 transition-transform white" onClick={
							() => {
								setOverrideSidebar(!overrideSidebar)
							}
						}>
							<FontAwesomeIcon icon="bars" />
						</div>
						<nav className="items-stretch flex flex-grow-1 flex-nowrap flex-shrink-0">
							<div className="items-stretch flex flex-nowrap flex-shrink-0">
								<Link href="/">
									<a className="flex pa3 pa0-l center nowrap items-center b link white hover-light-green">
										<span className="dn-l" title={i18n._(t`Home`)}><FontAwesomeIcon icon="home" /></span>
									</a>
								</Link>
								<Link href="/channels">
									<a className="flex pa3 center nowrap items-center b link white hover-light-green">
										<span className="dn db-l" title={i18n._(t`Channels`)}><Trans>Channels</Trans></span>
										<span className="dn-l" title={i18n._(t`Channels`)}><FontAwesomeIcon icon="search" /></span>
									</a>
								</Link>
								<Link href="/categories">
									<a className="flex pa3 center nowrap items-center b link white hover-light-green">
										<span className="dn db-l" title={i18n._(t`Browse`)}><Trans>Browse</Trans></span>
										<span className="dn-l" title={i18n._(t`Browse`)}><FontAwesomeIcon icon="gamepad" /></span>
									</a>
								</Link>
							</div>
							<div className="w-100 self-center dn db-l flex-grow-1">
								<SearchBar />
							</div>
						</nav>

						<nav className="relative fw6 order-1 order-2-ns white">
							<div id="account-menu" className="flex flex-nowrap h-100 items-stretch flex-grow-1" style={{WebkitAppRegion: 'no-drag'}}>
								<div className="flex flex-row self-center overflow-x-visible">
									<DarkModeToggle mode={props.mode} />
									{
										!isAuthenticated &&
										<GuacButton url="/auth/login">
											<span className="dn db-l" title={i18n._(t`Log in`)}><Trans>Log in</Trans></span>
											<span className="dn-l" title={i18n._(t`Log in`)}><FontAwesomeIcon icon="sign-in-alt" /></span>
										</GuacButton>
									}
									{
										!isAuthenticated &&
										<GuacButton url="/auth/register" color="green">
											<span className="dn db-l" title={i18n._(t`Sign up`)}><Trans>Sign up</Trans></span>
											<span className="dn-l" title={i18n._(t`Sign up`)}><FontAwesomeIcon icon="user-plus" /></span>
										</GuacButton>
									}
									{
										isAuthenticated &&
										user &&
										<AccountMenu user={user} />
									}
								</div>
							</div>
						</nav>
					</div>
				</header>
				<div className="w-100 min-vh-100 flex flex-row items-start">
					{
						(overrideSidebar || showSidebar)
							?
							SideBarComponent
							:
							null
					}
					<div className="w-100 flex flex-column items-start pl7-l site-component-main">
						{children}
					</div>
				</div>
			</main>
		</Fragment>
	)
}

const mapStateToProps = (state) => (
	{
		isAuthenticated: !!state.authentication.token,
		mode: state.site.mode,
		followed: state.site.myFollowed,
		user: state.authentication && state.authentication.user
	}
);

export default connect(mapStateToProps, actions)(PageLayout);