import React, {Component} from 'react'
import {connect} from 'react-redux';

import Link from 'next/link'

import { Trans } from '@lingui/macro';

import * as actions from 'actions';

class RegisterPage extends Component {
	constructor(props){
		super(props);
		this.state = {
			registered: false
		}
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	static async getInitialProps({store}){
		const { authentication } = store.getState()
		return {redirect: (authentication.token !== null)}
    }

	componentDidMount() {
		if(this.props.redirect){
			window.location.href = '/';
		}
	}

	componentDidUpdate(prevProps) {
		if(this.props.redirect){
			window.location.href = '/';
		}
	}

	handleSubmit(e){
		e.preventDefault();
		// yay uncontrolled forms!
		this.props.dispatch(
			actions.register(this.refs.username.value, this.refs.email.value, this.refs.password.value)
		)
		.then(() => {
			if(this.props.authentication.statusCode === 200) this.setState({registered: true})
		});
	}

	render(){
		if(this.state.registered){
			return (
				<main className="pa4 primary-80">
					<Trans>Your account is now registered. Please check your e-mail to verify your account.</Trans>
				</main>
			)
		}
		return (
			<>
				<main className="pa4 primary-80">
					<form className="measure center" onSubmit={this.handleSubmit}>
						<fieldset id="login" className="ba b--transparent ph0 mh0">
							<legend className="f4 fw6 ph0 mh0"><Trans>Sign up</Trans></legend>
							{this.props.authentication.regError && 
								<div className="red"><Trans>Error</Trans>: {this.props.authentication.regError.message}</div>
							}
							<div className="mt3">
								<label className="db fw6 lh-copy f6" htmlFor="username"><Trans>Username</Trans></label>
								<input ref="username" className="pa2 input-reset ba b--inherit primary bg-transparent hover-bg-green hover-white w-100" type="text" name="username"  id="username" />
							</div>
							<div className="mt3">
								<label className="db fw6 lh-copy f6" htmlFor="username"><Trans>E-mail</Trans></label>
								<input ref="email" className="pa2 input-reset ba b--inherit primary bg-transparent hover-bg-green hover-white w-100" type="email" name="email" id="email" />
							</div>
							<div className="mv3">
								<label className="db fw6 lh-copy f6" htmlFor="password"><Trans>Password</Trans></label>
								<input ref="password" className="b pa2 input-reset ba b--inherit primary bg-transparent hover-bg-green hover-white w-100" type="password" name="password"  id="password" />
							</div>
						</fieldset>
						<div className="">
							<input className="b ph3 pv2 input-reset color-inherit ba b--inherit primary bg-transparent grow pointer f6 dib" type="submit" value="Register" />
						</div>
						<div className="lh-copy mt3">
							<Link prefetch href="/auth/login"><a className="f6 link dim primary db"><Trans>Log in</Trans></a></Link>
							<Link prefetch href=""><a href="" className="f6 link dim primary db"><Trans>Forgot your password?</Trans></a></Link>
						</div>
					</form>
				</main>
			</>
		)
	}
}

export default connect(state => state)(RegisterPage)