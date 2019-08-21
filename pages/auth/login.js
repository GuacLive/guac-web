import React, {Component} from 'react'
import {connect} from 'react-redux';

import Router from 'next/router';
import Link from 'next/link'

import * as actions from '../../actions';

class LoginPage extends Component {
	constructor(props){
		super(props);
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
			actions.authenticate(this.refs.username.value, this.refs.password.value)
		)
		.then(() => {
			if(!this.props.authentication.error) window.location.href = '/';
		});
	}

	render(){
		return (
			<>
				<main className="pa4 primary-80">
					<form className="measure center" onSubmit={this.handleSubmit}>
						<fieldset id="login" className="ba b--transparent ph0 mh0">
							<legend className="f4 fw6 ph0 mh0">Log in</legend>
							{this.props.authentication.error && 
								<div className="red">Error: {this.props.authentication.error.statusText}</div>
							}
							<div className="mt3">
								<label className="db fw6 lh-copy f6" htmlFor="username">Username</label>
								<input ref="username" className="pa2 input-reset ba b--inherit bg-transparent hover-bg-green hover-white w-100" type="text" name="username"  id="username" />
							</div>
							<div className="mv3">
								<label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
								<input ref="password" className="b pa2 input-reset ba b--inherit bg-transparent hover-bg-green hover-white w-100" type="password" name="password"  id="password" />
							</div>
							<label className="pa0 ma0 lh-copy f6 pointer"><input type="checkbox" /> Remember me</label>
						</fieldset>
						<div className="">
							<input className="b ph3 pv2 input-reset color-inherit ba b--inherit bg-transparent grow pointer f6 dib" type="submit" value="Sign in" />
						</div>
						<div className="lh-copy mt3">
							<Link prefetch href="/auth/register"><a className="f6 link dim primary db">Sign up</a></Link>
							<Link prefetch href=""><a href="" className="f6 link dim primary db">Forgot your password?</a></Link>
						</div>
					</form>
				</main>
			</>
		)
	}
}

export default connect(state => state)(LoginPage)