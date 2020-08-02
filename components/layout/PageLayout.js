import Link from 'next/link'
import Head from 'next/head'

import {Fragment, useState, useEffect, useLayoutEffect} from 'react';

import {connect} from 'react-redux';

import SimpleBar from 'simplebar-react';

import * as actions from 'actions';

import {useLingui} from "@lingui/react";
import {Trans, t} from '@lingui/macro';
import LangSwitcher from '../LangSwitcher';

import Image from '../Image';

import GuacButton from '../GuacButton';
import AccountMenu from './AccountMenu';
import NotificationsMenu from './NotificationsMenu';
import SearchBar from '../Search/SearchBar';

import GuacLogo from '../../public/img/guac-text.svg';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
	Tooltip,
} from 'react-tippy';

import {useDispatch} from "react-redux";
import {useInterval, useBoolean} from 'react-use';

const mediaQueryList = typeof window !== 'undefined'
	&& window.matchMedia('screen and (min-width: 960px)');
function PageLayout(props) {
	const dispatch = useDispatch();
	const {i18n} = useLingui();
	const [showSidebar, setShowSidebar] = useState(true);
	const [followingTimer, toggleFollowingTimer] = useBoolean(true);

	const updateViewport = () => {
		if (
			typeof document !== 'undefined'
		) {
			let vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		}
	};

	const updateDimensions = (evt) => {
		let ssb = evt && evt.matches;
		// If media query is now matching, reset overriden sidebar
		if (showSidebar === true && showSidebar !== ssb) {
			ssb = false;
		}
		console.log('updateDimensions', evt);
		if (
			typeof document !== 'undefined'
			&& document.documentElement
			&& document.documentElement.classList
		) {
			if (showSidebar) {
				document.documentElement.classList.add('toggled-sidebar');
			} else {
				document.documentElement.classList.remove('toggled-sidebar');
			}
		}
		setShowSidebar(ssb);
	};

	if (process.browser) {
		useLayoutEffect(() => {
			// This a hack to fix vh
			updateViewport();
			window.addEventListener('resize', updateViewport);

			// This is the logic that handles sidebar
			if (mediaQueryList) {
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
		if (props.mode) {
			if (document) document.documentElement.className = `guac-skin-${props.mode}`;
		}
	}, [props.mode]);

	let {children, isAuthenticated, user} = props;
	let title = props.title ? props.title : '';

	useEffect(() => {
		toggleFollowingTimer(true);
	}, [user.token])

	// Refetch following list every 60 seconds
	useInterval(
		async () => {
			if (!user || !user.token) return;
			await dispatch(actions.fetchMyFollowed(
				user.token
			));
		},
		followingTimer ? 60 * 1000 : null
	);

	if (props.skip) {
		return <Fragment>{children}</Fragment>;
	}

	const SideBarComponent = (
		<aside className="fixed flex flex-column vh-100 flex-shrink-1 mv2-l site-component-sidebar bg-bar">
			<div className="flex flex-column h-100">
				<nav className="flex flex-column h-100 relative">
					<div className="flex flex-column flex-shrink-0 relative pv2">
						<Link href="/">
							<a className="items-center flex flex-nowrap ph3 pv2 hover-bg-dark-gray bg-animate link truncate white hover-light-green">
								<div className="w-100 truncate flex-grow-1 b lh-title">
									<span title={i18n._(t`Home`)} className="inline-flex ml3"><FontAwesomeIcon icon="home" /></span>
									<span title={i18n._(t`Home`)} className="inline-flex ml3"><Trans>Home</Trans></span>
								</div>
							</a>
						</Link>
						<Link href="/channels">
							<a className="items-center flex flex-nowrap ph3 pv2 hover-bg-dark-gray bg-animate link truncate white hover-light-green">
								<div className="w-100 truncate flex-grow-1 b lh-title">
									<span title={i18n._(t`Channels`)} className="inline-flex ml3"><FontAwesomeIcon icon="search" /></span>
									<span title={i18n._(t`Channels`)} className="inline-flex ml3"><Trans>Channels</Trans></span>
								</div>
							</a>
						</Link>
						<Link href="/categories">
							<a className="items-center flex flex-nowrap ph3 pv2 hover-bg-dark-gray bg-animate link truncate white hover-light-green">
								<div className="w-100 truncate flex-grow-1 b lh-title">
									<span title={i18n._(t`Browse`)} className="inline-flex ml3"><FontAwesomeIcon icon="gamepad" /></span>
									<span title={i18n._(t`Browse`)} className="inline-flex ml3"><Trans>Browse</Trans></span>
								</div>
							</a>
						</Link>
					</div>
					<div className="flex f5 b ph3 light-gray">
						<Trans>Followed Channels</Trans>
					</div>
					<SimpleBar className="flex flex-grow-1 relative h-100">
						{
							(!props.followed ||
								!props.followed.length)
							&&
							<div className="align-center flex-l dn flex-column relative ph4 pv2 white">
								<Trans>Start following your favorite streamers to find them quickly!</Trans>
							</div>
						}
						{
							props.followed &&
							[].concat(props.followed)
								.sort((a, b) => {
									if (a.live === b.live) {
										return 1;
									} else if (a.live) {
										return 0;
									} else {
										return -1;
									}
								})
								.sort((a, b) => {
									return b.viewers - a.viewers;
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
													<div className="flex justify-between truncate w-100">
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
																		<span className="ph2 f6 tc inline-flex truncate white flex-grow-1 lh-title mh3">
																			<span className="br-100 inline-flex f6 relative w1 h1 bg-red"></span>
																			{u.viewers}
																		</span>
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
				<footer className="flex white ph4 ph2-m mb5">
					<div className="f6 flex flex-column flex-grow-1" style={{flexFlow: 'row wrap'}}>
						<span className="dib mr4 ttu tracked">© {(new Date()).getFullYear()} guac.live</span>
						<span className="dib mr4 f7 silver">v{process.env.SENTRY_RELEASE}</span>
						<div className="flex flex-row flex-grow-1">
							<Link href="/terms">
								<a className="link white hover-light-purple mr2"><Trans>Terms</Trans></a>
							</Link>
							<span className="white-80 mr2">&middot;</span>
							<Link href="/privacy">
								<a className="link white hover-gold mr2"> <Trans>Privacy</Trans> </a>
							</Link>
							<span className="white-80 mr2">&middot;</span>
							<Link href="/dmca">
								<a className="link white hover-red mr2"> <Trans>DMCA</Trans> </a>
							</Link>
						</div>
						<Link href="#">
							<a className="link white-80 hover-green"> contact@guac.live </a>
						</Link>
						<iframe
							src="https://www.patreon.com/platform/iframe?widget=become-patron-button&creatorID=19057109"
							scrolling="no"
							allowtransparency="true"
							frameBorder="0"
							className="patreon-widget"
							title={i18n._(t`Support us on patreon!`)}
							style={{display: 'flex', width: '11rem', height: '35px', verticalAlign: 'middle'}}
						/>
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

				<meta
					name="viewport"
					content="width=device-width,initial-scale=1,minimal-ui"
				/>

				<meta name="description" content="guac is a live streaming platform." key="description" />
				<meta name="theme-color" key="theme-color" content="#19a974" />
			</Head>
			<main className="w-100 h-100 flex flex-column flex-nowrap justify-between items-start page-wrapper">
				<header className="site-component-header z-5 w-100 fixed ph3 pv2 bg-bar ml-auto flex-shrink-0">
					<div className="h-100 flex items-stretch flex-nowrap">
						<div className="flex flex-shrink-0 items-center pointer">
							<div className="dib v-mid tc flex-shrink-0 pointer pa2 transition-transform white" onClick={
								() => {
									setShowSidebar(!showSidebar)
								}
							}>
								<FontAwesomeIcon icon="bars" fixedWidth />
							</div>
							<Link href="/">
								<a className="inline-flex pa2 content-box">
									<GuacLogo className="guac-logo green h2" alt="guac.live" />
								</a>
							</Link>
						</div>
						<nav className="items-stretch flex flex-grow-1 flex-nowrap flex-shrink-0">
							<div className="items-stretch flex flex-nowrap flex-shrink-0">
							</div>
							<div className="w-100 self-center dn db-l flex-grow-1">
								<SearchBar />
							</div>
						</nav>

						<nav className="relative fw6 order-1 order-2-ns white">
							<div id="account-menu" className="items-center flex flex-grow-1 flex-shrink-1 w-100 justify-end" style={{WebkitAppRegion: 'no-drag'}}>
								<div className="flex flex-nowrap">
									{
										isAuthenticated &&
										<NotificationsMenu />
									}
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
								</div>
								{
									<AccountMenu user={user && Object.keys(user).length ? user : null} mode={props.mode} />
								}
							</div>
						</nav>
					</div>
				</header>
				<div className="w-100 min-vh-100 flex flex-row items-start">
					{
						(showSidebar)
							?
							SideBarComponent
							:
							null
					}
					<div className={`w-100 flex flex-column items-start ${showSidebar ? 'pl7-l' : 'pl2-l'} site-component-main`}>
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
		user: state.authentication ? state.authentication.user : null,
		mode: state.site.mode,
		followed: state.site.myFollowed,
		loading: state.site.loading
	}
);

export default connect(mapStateToProps, actions)(PageLayout);