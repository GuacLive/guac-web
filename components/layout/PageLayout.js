import Link from 'next/link'
import Head from 'next/head'

import {Fragment, useState, useEffect, useLayoutEffect} from 'react';

import {connect} from 'react-redux';

import Modal from 'react-modal';

import * as actions from 'actions';

import {useLingui} from "@lingui/react";
import {Trans, t} from '@lingui/macro';

import AccountMenu from './AccountMenu';
import NotificationsMenu from './NotificationsMenu';
import SearchBar from '../Search/SearchBar';

import GuacLogo from '../../public/img/guac-text.svg';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {useDispatch} from "react-redux";
import {useInterval, useBoolean} from 'react-use';

import SidebarComponent from 'components/layout/Sidebar';

import LoginComponent from 'components/Auth';

const mediaQueryList = typeof window !== 'undefined'
	&& window.matchMedia('screen and (min-width: 960px)');


Modal.setAppElement('#__next');
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
				if(mediaQueryList.addEventListener){
					mediaQueryList.addEventListener('change', updateDimensions);
				}else if(mediaQueryList.addListener){
					mediaQueryList.addListener(updateDimensions);
				}
			}
			updateDimensions(mediaQueryList);
			return () => {
				window.removeEventListener('resize', updateViewport);
				if(mediaQueryList.removeEventListener){
					mediaQueryList.removeEventListener('change', updateDimensions);
				}else if(mediaQueryList.removeListener){
					mediaQueryList.removeListener(updateDimensions);
				}
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
	}, [user, user.token])

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

	const [authModalIsOpen, setAuthModalIsOpen] = useState(false);
	const [authModalType, setAuthModalType] = useState(false);
	function openAuthModal(type){
		setAuthModalType(type);
		setAuthModalIsOpen(true);
	}
    
	function closeAuthModal(){
		setAuthModalIsOpen(false);
	}

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
			<Modal
				isOpen={authModalIsOpen}
				onRequestClose={closeAuthModal}
				contentLabel={i18n._(t`Log in`)}
				style={{
					overlay: {
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
						zIndex: '9999'
					},
					content: {
						top: '50%',
						left: '50%',
						right: 'auto',
						bottom: 'auto',
						marginRight: '-50%',
						transform: 'translate(-50%, -50%)',
						background: 'var(--modal-background)',
						borderColor: 'transparent',
						borderRadius: '4px'
					}
				}}
			>
				<a className="link absolute primary z4 w2 h2 pointer" style={{
					right: '12px'
				}} onClick={closeAuthModal}>X</a>
				<LoginComponent tab={authModalType == 'login' ? 0 : 1} />
			</Modal>
			<main className="w-100 h-100 flex flex-column flex-nowrap justify-between items-start page-wrapper">
				<header className="site-component-header z-5 w-100 fixed ph3 pv2 bg-bar ml-auto flex-shrink-0">
					<div className="h-100 flex items-stretch flex-nowrap">
						<div className="flex flex-shrink-0 items-center pointer w-33-l">
							<div className="dib v-mid tc flex-shrink-0 pointer pa2 transition-transform white" onClick={
								() => {
									setShowSidebar(!showSidebar)
								}
							}>
								<FontAwesomeIcon icon="bars" fixedWidth />
							</div>
							<Link href="/">
								<a className="inline-flex pa2 content-box" alt="Logo">
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
										<a className="link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--transparent bg-transparent guac-btn" href="#" onClick={() => openAuthModal('login')}>
											<span className="dn db-l" title={i18n._(t`Log in`)}><Trans>Log in</Trans></span>
											<span className="dn-l" title={i18n._(t`Log in`)}><FontAwesomeIcon icon="sign-in-alt" /></span>
										</a>
									}
									{
										!isAuthenticated &&
										<a className="link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--green bg-green guac-btn" href="#" onClick={() => openAuthModal('register')}  color="green">
											<span className="dn db-l" title={i18n._(t`Sign up`)}><Trans>Sign up</Trans></span>
											<span className="dn-l" title={i18n._(t`Sign up`)}><FontAwesomeIcon icon="user-plus" /></span>
										</a>
									}
								</div>
								{
									isAuthenticated &&
									<div className="items-stretch flex flex-grow-1 h-100 pl2 relative">
										<Link href="/dashboard">
											<a className="db link pv2 ph3 color-inherit"><FontAwesomeIcon icon="video" /></a>
										</Link>
									</div>
								}
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
							<SidebarComponent followed={props.followed} />
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
		isAuthenticated: state.authentication && state.authentication.token ? true : false,
		user: state.authentication ? state.authentication.user : {},
		mode: state.site.mode,
		followed: state.site.myFollowed,
		loading: state.site.loading
	}
);

export default connect(mapStateToProps, actions)(PageLayout);