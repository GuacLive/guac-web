import { useRef, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';

import Router from 'next/router';
import Link from 'next/link'

import { Trans } from '@lingui/macro';

import * as actions from 'actions';

function LoginPage(props){
	const dispatch = useDispatch();	
	const auth = useSelector(state => state.authentication);
	const username = useRef(null);
	const password = useRef(null);
	
	useEffect(() => {
		if(props.redirect) Router.push('/');
	}, [props.redirect]);

	useEffect(() => {
		// Find out why auth.token is not always set
		if(auth.token || auth.user.username){
			//Router.push('/');
			if(typeof window !== 'undefined') window.location.href = '/';
		}
	}, [auth.token, auth.user.username])

	const handleSubmit = (e) => {
		e.preventDefault();
		// yay uncontrolled forms!
		dispatch(
			actions.authenticate(username.current.value, password.current.value)
		);
	}

	return (
		<>
			<main className="pa4 primary-80">
				<form className="measure center" onSubmit={handleSubmit}>
					<fieldset id="login" className="ba b--transparent ph0 mh0">
						<legend className="f4 fw6 ph0 mh0"><Trans>Log in</Trans></legend>
						{auth.error &&
							<div className="red"><Trans>Error</Trans>: {auth.error.message}</div>
						}
						<div className="mt3">
							<label className="db fw6 lh-copy f6" htmlFor="username"><Trans>Username</Trans></label>
							<input ref={username} className="pa2 input-reset ba b--inherit primary bg-transparent hover-bg-green hover-white w-100" type="text" name="username" id="username" />
						</div>
						<div className="mv3">
							<label className="db fw6 lh-copy f6" htmlFor="password"><Trans>Password</Trans></label>
							<input ref={password} className="b pa2 input-reset ba b--inherit primary bg-transparent hover-bg-green hover-white w-100" type="password" name="password" id="password" />
						</div>
						<label className="pa0 ma0 lh-copy f6 pointer"><input type="checkbox" /> <Trans>Remember me</Trans></label>
					</fieldset>
					<div className="">
						<input className="b ph3 pv2 input-reset color-inherit ba b--inherit primary bg-transparent grow pointer f6 dib" type="submit" value="Sign in" />
					</div>
					<div className="lh-copy mt3">
						<Link prefetch href="/auth/register"><a className="f6 link dim primary db"><Trans>Sign up</Trans></a></Link>
						<Link prefetch href=""><a href="" className="f6 link dim primary db"><Trans>Forgot your password?</Trans></a></Link>
					</div>
				</form>
			</main>
		</>
	)
};

LoginPage.getInitialProps = async({store}) => {
	const { authentication } = store.getState()
	return {redirect: (authentication.token !== null)}
};


export default connect(state => state)(LoginPage)