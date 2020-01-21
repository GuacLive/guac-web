import React, {Component} from 'react'
import {connect} from 'react-redux';
import dynamic from 'next/dynamic'

import { Trans } from '@lingui/macro';

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
		if(auth.loading) return null;
		if(auth.error) throw auth.error;
		return (
			<div className="flex flex-column flex-wrap w-100">
                <h2 className="f2 tracked mt0 mb3"><Trans>User settings</Trans></h2>
                {auth.error && 
					<div className="red"><Trans>Error</Trans>: {auth.error.message}</div>
				}
                <form className="measure" onSubmit={this.handleSubmit}>
					<label htmlFor="password"><Trans>New password:</Trans></label>
					<input name="password" type="password" className="input-reset bn pa3 w-100 bg-white br2" ref="password" placeholder="password" />
					<input type="submit" value="Edit user" className="link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--green bg-green ml1" />
				</form>
			</div>
		)
	}
}

export default connect(state => state)(withAuth(DashboardPage))