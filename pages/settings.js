import React, {Component} from 'react'
import {connect} from 'react-redux';

import { withI18n } from '@lingui/react';

import { Trans, t } from '@lingui/macro';

import withAuth from '../utils/withAuth';
import * as actions from '../actions';

class DashboardPage extends Component {
	constructor(props){
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e){
		e.preventDefault();
		console.log(this.refs);
		this.props.dispatch(
			actions.setPassword(this.props.authentication.token, this.refs.password.value)
		);
    }

	render(){
		const auth = this.props.authentication;
		const { i18n } = this.props;
		if(auth.loading) return null;
		return (
			<div className="flex flex-column flex-wrap w-100">
                <h2 className="f2 tracked mt0 mb3"><Trans>User settings</Trans></h2>
                {auth.error && 
					<div className="red"><Trans>Error</Trans>: {auth.error.message}</div>
				}
				<div className="primary"><span className="b"><Trans>E-mail</Trans></span>: {auth.user.email || 'None'}</div>
                <form className="measure" onSubmit={this.handleSubmit}>
					<label htmlFor="password" className="b"><Trans>New password:</Trans></label>
					<input name="password" type="password" className="input-reset bn pa3 w-100 bg-white br2" ref="password" placeholder={i18n._(t`Password`)} />
					<input type="submit" value={i18n._(t`Edit user`)} className="link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--green bg-green ml1" />
				</form>
				<div className="primary"><span className="b"><Trans>Color</Trans></span>: <span style={{color: auth.user.color}}>{auth.user.color || 'Default'}</span></div>
				<span>Want to customize your color? <a target="_blank" href="https://www.patreon.com/join/guaclive" className="primary b">Join our Patreon!</a></span>
			</div>
		)
	}
}

export default withI18n()(connect(state => state)(withAuth(DashboardPage)))