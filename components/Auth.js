import { useRef, useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';

import Router from 'next/router';
import Link from 'next/link'

import {useLingui} from "@lingui/react";
import {Trans, t} from '@lingui/macro';

import * as actions from 'actions';

function LoginComponent(props){
	const {i18n} = useLingui();
	const dispatch = useDispatch();	
	const auth = useSelector(state => state.authentication);

	const username = useRef(null);
	const password = useRef(null);
	const regUsername = useRef(null);
	const regEmail = useRef(null);
	const regPassword = useRef(null);

	const [registered, setRegistered] = useState(false);
	const [tab, setTab] = useState(props.tab ? props.tab : 0);

	// Redirect when logged in
	useEffect(() => {
		// Find out why auth.token is not always set
		if(auth.token || auth.user.username){
			//Router.push('/');
			if(typeof window !== 'undefined'){
				window.location.href = '/';
			}else{
				Router.push('/');
			}
		}
	}, [auth.token, auth.user.username])

	const handleLoginSubmit = (e) => {
		e.preventDefault();
		// yay uncontrolled forms!
		dispatch(
			actions.authenticate(username.current.value, password.current.value)
		);
	}

	const handleRegisterSubmit = (e) => {
		e.preventDefault();
		// yay uncontrolled forms!
		dispatch(
			actions.register(regUsername.current.value, regEmail.current.value, regPassword.current.value)
		)
		.then(() => {
			if(auth.statusCode === 200) setRegistered(true)
		});
	}

	if(registered){
		return (
			<main className="flex items-center justify-center pa4 primary-80">
				<Trans>Your account is now registered. Please check your e-mail to verify your account.</Trans>
			</main>
		)
	}
	return (
		<>
			<form className="flex items-center justify-center pa4" onSubmit={tab === 0 ? handleLoginSubmit : handleRegisterSubmit}>
				<fieldset className="auth-modal-left primary ba b--transparent ph0 mh0"
				style={{
					'width': '408px',
					'marginRight': '260px'
				}}>
					<div className="tabs flex items-center" style={{height:'48px'}}>
						<a 
							href="#"
							onClick={(e) => {setTab(0);e&&e.preventDefault();return true;}}
							className={
								`flex items-center tab f5 ttu mr4 h-100 no-underline pointer bb ${tab == 0 ? 'green b--green' : 'primary b--transparent'} hover-dark-green link`
							}
						>
							<span><Trans>Log in</Trans></span>
						</a>
						<a 
							href="#"
							onClick={(e) => {setTab(1);e&&e.preventDefault();return true;}}
							className={
								`flex items-center tab f5 ttu mr4 h-100 no-underline pointer bb ${tab == 1 ? 'green b--green' : 'primary b--transparent'} hover-dark-green link`
							}
						>
							<span><Trans>Sign up</Trans></span>
						</a>
					</div>
					{
						tab === 0 &&
						<>
							{auth.error &&
								<div className="red"><Trans>Error</Trans>: {auth.error.message}</div>
							}
							<div className="mt3">
								<label className="db fw6 flh-copy f6" htmlFor="username"><Trans>Username</Trans></label>
								<input ref={username} className="fl f6 f5-l pa2 ba br2 input-reset w-100" type="text" name="username" id="username" />
							</div>
							<div className="mv3">
								<label className="db fw6 lh-copy f6" htmlFor="password"><Trans>Password</Trans></label>
								<input ref={password} className="fl f6 f5-l pa2 ba br2 input-reset w-100" type="password" name="password" id="password" />
								<Link prefetch href=""><a href="" className="f6 link dim green db"><Trans>Forgot your password?</Trans></a></Link>
							</div>
							<div className="mv3">
								<label className="pa0 ma0 lh-copy f6 pointer"><input type="checkbox" /> <Trans>Remember me</Trans></label>
							</div>
							<div className="mv3">
								<input className="link color-inherit db w-100 pv2 ph3 nowrap lh-solid pointer br2 ba b--green bg-green guac-btn" type="submit" value={i18n._(t`Sign in`)} />
							</div>
						</>
					}
					{
						tab === 1 &&
						<>
							{auth.regError &&
								<div className="red"><Trans>Error</Trans>: {auth.regError.message}</div>
							}
							<div className="mt3">
								<label className="db fw6 lh-copy f6" htmlFor="username"><Trans>Username</Trans></label>
								<input ref={regUsername} className="fl f6 f5-l pa2 ba br2 input-reset w-100" type="text" name="username" id="username" />
							</div>
							<div className="mv3">
								<label className="db fw6 lh-copy f6" htmlFor="email"><Trans>E-mail</Trans></label>
								<input ref={regEmail} className="fl f6 f5-l pa2 ba br2 input-reset w-100" type="email" name="email" id="email" />
							</div>
							<div className="mv3">
								<label className="db fw6 lh-copy f6" htmlFor="password"><Trans>Password</Trans></label>
								<input ref={regPassword} className="fl f6 f5-l pa2 ba br2 input-reset w-100" type="password" name="password" id="password" />
							</div>
							<div className="mv3">
								<br />
							</div>
							<div className="mt3">
								<input className="link color-inherit db w-100 pv2 ph3 nowrap lh-solid pointer br2 ba b--green bg-green guac-btn" type="submit" value={i18n._(t`Sign up`)} />
							</div>
						</>
					}
				</fieldset>
				<div className="auth-modal-right dn db-l absolute top-0 right-0 pl3 w4 h-100 bg-black cover br1 br--right br--left"
				style={{
					'width': '260px'
				}}>
					<div className="flex flex-column justify-center h-100 primary">
						<p className="f3 ma0 lh-title"><Trans>Welcome to</Trans></p>
						<p className="f2 ma0 lh-copy light-green">guac.live</p>
					</div>
				</div>
			</form>
		</>
	)
};

export default connect(state => state)(LoginComponent)