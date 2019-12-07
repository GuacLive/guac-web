import Link from 'next/link'
import Head from 'next/head'

import { Fragment, Component } from 'react';

import {connect} from 'react-redux';

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.css';

import '../../css/style.css';

import * as actions from '../../actions';

import { withI18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';
import LangSwitcher from '../LangSwitcher';

import Image from '../Image';

import GuacButton from '../GuacButton';
import DarkModeToggle from '../DarkModeToggle';
import AccountMenu from './AccountMenu';
import SearchBar from '../Search/SearchBar';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

class PageLayout extends Component {
	constructor(props){
		super(props);
	}
	
	componentDidMount(){
		if(this.props.mode){
			if(document) document.documentElement.className = `guac-skin-${this.props.mode}`;
		}
	}

	componentDidUpdate(prevProps) {
		if(this.props.mode !== prevProps.mode){
			if(document) document.documentElement.className = `guac-skin-${this.props.mode}`;
		}
	}
	
	componentWillUnmount(){
	}
	
	render(){
		let { children, isAuthenticated, user, followed, i18n } = this.props;
		let title = this.props.title ? this.props.title : '';

		if(this.props.skip){
			return <Fragment>{ children }</Fragment>;
		} 

		return (
			<Fragment>
				<Head>
					<title>{ title }{ title.length > 0 ? ' &middot; guac.live' : 'guac.live'}</title>
					<meta charSet='utf-8' />

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
				</Head>
				<main className="w-100 h-100 flex flex-column flex-nowrap justify-between items-start page-wrapper">
					<header className="z-5 w-100 h-100 ph3 pv2 bg-near-black ml-auto flex-shrink-0">
						<div className="h-100 flex items-stretch flex-nowrap">
							<div className="inline-flex flex-shrink-0 items-center pointer">
								<Link href="/">
									<a className="inline-flex pa2 content-box">
										<Image className="h2" src="/img/header-logo.png" alt="guac.live" />
									</a>
								</Link>
							</div>

							<nav className="items-stretch flex flex-grow-1 flex-nowrap flex-shrink-0">
								<div className="items-stretch flex flex-nowrap flex-shrink-0">
									<Link href="/channels">
										<a className="flex pa3 center nowrap items-center b link white hover-light-green">
											<span className="dn db-l" title={i18n._(t`Channels`)}><Trans>Channels</Trans></span>
											<span className="dn-l" title={i18n._(t`Channels`)}><FontAwesomeIcon icon="search" /></span>
										</a>
									</Link>
									<Link href="/games">
										<a className="flex pa3 center nowrap items-center b link white hover-light-green">
											<span className="dn db-l" title={i18n._(t`Games`)}><Trans>Games</Trans></span>
											<span className="dn-l" title={i18n._(t`Games`)}><FontAwesomeIcon icon="gamepad" /></span>
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
										<DarkModeToggle mode={this.props.mode} />
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
						<aside className="flex flex-column vh-100 flex-shrink-1 site-component-sidebar bg-near-black">
							<div className="flex flex-column h-100">
								<nav className="flex flex-column h-100 overflow-hidden relative">
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
										followed
										.sort((a,b) => {
											if(a.live === b.live){
												return 0;
											}else if(a.live){
												return -1;
											}else{
												return 1;
											}
										})
										.map((u) => {
											return (
												<div key={'followed-'+u.username} className="site-component-fUser items-center flex relative ph4 pv2 white">
													<Link href={`/c/${u.username}`}>
														<a className="inline-flex v-mid mr2 w2 h2">
															<Image
																src={u.avatar || '//api.guac.live/avatars/unknown.png'}
																alt={u.username}
																shape="squircle"
																fit="cover" 
																lassName={`dim ba ${+u.live ? 'b--red' : 'b--transparent'} inline-flex w-100 h-100`}
															/>
														</a>
													</Link>
													<div className="overflow-hidden dn db-l">
														<div className="site-component-fUser__name inline-flex items-center v-bottom">
															<a className="link white" href={'/c/' + u.username}>
																{u.username}
																{+u.live ? <span className="ph2 bg-red f6 tc inline-flex white mh3">LIVE</span> : ''}
															</a>
														</div>
														<div className="site-component-fUser__category truncate"><small>{u.title}</small></div>
													</div>
												</div>
											)
										})
									}
									</SimpleBar>
								</nav>
								
								<footer className="flex bg-near-black white ph4 ph2-m" style={{height:'33%'}}>
									<div className="f6 flex flex-column flex-grow-1">
										<span className="dib mr4 mr5-ns ttu tracked">© {(new Date()).getFullYear()} guac.live</span>
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
						<div className="w-100 flex flex-column items-start pa3">
							{ children }
						</div>
					</div>
				</main>
			</Fragment>
		)
	}
}

const mapStateToProps = (state) => (
	{
		isAuthenticated: !!state.authentication.token,
		mode: state.site.mode,
		followed: state.site.myFollowed,
		user: state.authentication && state.authentication.user
	}
);

export default withI18n()(connect(mapStateToProps, actions)(PageLayout));