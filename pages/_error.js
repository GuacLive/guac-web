import React, { Component } from 'react';
import { Trans } from '@lingui/macro';

import initialize from '../utils/initialize';
class Error extends Component {
	static async getInitialProps(ctx){
		const {res, err} = ctx;
		const statusCode = res ? res.statusCode : err ? err.statusCode : null;
		return {
			statusCode,
			...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})
		};
	}

	render(){
		if(!this.props.statusCode){
			return (
				<>
					<h2 className="f2 tracked mt0 mb3"><Trans>Client error</Trans></h2>
					<p>An error occurred on client.</p>
				</>
			);
		}
		switch(this.props.statusCode){
			case 404:
				return (
					<>
						<h2 className="f2 tracked mt0 mb3"><Trans>Page not found</Trans></h2>
						<p>We could not find this page.</p>
					</>
				);
			case 500:
				return (
					<>
						<h2 className="f2 tracked mt0 mb3"><Trans>Server error</Trans></h2>
						<p>An error occurred on the server.</p>
					</>
				);
			default:
				return (
					<>
						<h2 className="f2 tracked mt0 mb3"><Trans>Unknown error</Trans></h2>
						<p>An error occurred.</p>
					</>
				);
		}
	}
}

export default Error
