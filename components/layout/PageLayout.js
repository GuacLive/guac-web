import Link from 'next/link'
import Head from 'next/head'

import { Fragment, Component } from 'react';

import {connect} from 'react-redux';

import '../../css/style.css'

import * as actions from '../../actions';

import GuacButton from '../GuacButton'
import DarkModeToggle from '../DarkModeToggle';

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
		let { children, isAuthenticated, user, followed } = this.props;
		let title = this.props.title ? this.props.title : '';
		return (
			<Fragment>
				<Head>
					<title>{ title }{ title.length > 0 ? ' | guac.live' : 'guac.live'}</title>
					<meta charSet='utf-8' />
					<meta name='viewport' content='initial-scale=1.0, width=device-width' />
				</Head>
				<main className="w-100 h-100 flex flex-column flex-nowrap justify-between items-start page-wrapper">
					<header className="z-5 w-100 ph3 pv2 bg-near-black flex flex-row justify-center items-center ml-auto">
						<div className="w-100 ph5-l flex flex-row justify-between items-center flex-wrap flex-nowrap-ns">
							<div className="flex flex-column items-center pointer">
								<Link href="/">
									<a className="f2 b link dim ba b--transparent db pa1 br-100 fl-l content-box">
										<img className="dib h2" src="/static/img/header-logo.png" alt="guac.live" />
									</a>
								</Link>
							</div>

							<nav className="w-25 db db-m flex-ns flex-row-ns self-center-ns overflow-x-visible-ns">
								<ul className="list pl0">
									<li className="dib">
										<Link href="/channels">
											<a className="b link white hover-light-green ml3">Channels</a>
										</Link>
									</li>
									<li className="dib">
										<Link href="/games">
											<a className="b link white hover-light-green ml3">Games</a>
										</Link>
									</li>
								</ul>
							</nav>

							<form className="w-30 db db-m flex-ns flex-row-ns self-center-ns overflow-x-visible-ns">
								<input type="text" className="input-reset bn pa3 w-100 bg-white br2" placeholder="Search..." />
							</form>

							<nav className="ml3 mt2 mt0-ns pv2-ns flex-auto tr nowrap relative fw6 order-1 order-2-ns white">
								<DarkModeToggle />
								{
									!isAuthenticated && 
									<GuacButton url="/auth/login">Log in</GuacButton>
								}
								{
									!isAuthenticated && 
									<GuacButton url="/auth/signup" color="green">Sign up</GuacButton>
								}
								{
									isAuthenticated && 
									user &&
									<Link href={user.can_stream ? `/c/${user.name}` : '/'}><a className="b link white hover-light-green mr3 ml3">{user.name}</a></Link>
								}
								{
									isAuthenticated && 
									<Link href="/dashboard"><a className="b link white hover-light-green mr3">Dashboard</a></Link>
								}
								{
									isAuthenticated && 
									<GuacButton url="/auth/logout" color="red">Log out</GuacButton>
								}
							</nav>
						</div>
					</header>
					<div className="w-100 min-vh-100 flex flex-row items-start">
						<aside className="flex flex-column vh-100 w-20 bg-near-black">
							<nav className="flex flex-column flex-grow-1">
								<span className="f5 b inline-flex ph3 light-gray">
								Followed Channels
								</span>
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
											<div key={'followed-'+u.username} className="site-component-fUser align-center flex flex-column relative ph4 pv2 white">
												<div className="site-component-fUser__name">
													<a className="link white" href={'/c/' + u.username}>
														{u.username}
														{+u.live ? <span className="ph2 bg-red f6 tc inline-flex white mh3">LIVE</span> : ''}
													</a>
												</div>
												<div className="site-component-fUser__category"><small>{u.title}</small></div>
											</div>
										)
									})
								}
							</nav>
							
							<footer className="flex bg-near-black white pv4 pv5-l ph4 h-25">
								<div className="f6 flex flex-column flex-grow-1">
									<span className="dib mr4 mr5-ns ttu tracked">© {(new Date()).getFullYear()} guac.live</span>
									<Link href="/terms">
										<a className="link white-80 hover-light-purple">Terms</a>
									</Link>
									<Link href="/privacy">
										<a className="link white-80 hover-gold"> Privacy </a>
									</Link>
									<Link href="#">
										<a className="link white-80 hover-green"> contact@guac.live </a>
									</Link>
								</div>
							</footer>
						</aside>
						<div className="w-100 flex flex-column items-start mw9-l pa3">
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

export default connect(mapStateToProps, actions)(PageLayout);