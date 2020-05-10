import React, {Component} from 'react'
import {connect} from 'react-redux';

import { Trans } from '@lingui/macro';

import Link from 'next/link';

const API_URL = process.env.API_URL;
class ActivatePage extends Component {
	constructor(props){
		super(props);
	}
	static async getInitialProps({store, isServer, pathname, query, req}){
        let result;
		await fetch(API_URL + '/activate', {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			method: 'POST',
			body: JSON.stringify({
				token: query.token
			})
		})
        .then(response => response.json())
        .then(r => {
            result = r;
        });
		return {...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}), result};
    }

	render(){
        const { result } = this.props;
        if(result.statusCode == 400){
            return <Trans>This verification token is not valid.</Trans>;
        }
         return (
            <div className="primary">
                <Trans>Your e-mail has been verified.</Trans>&nbsp;
                <Link href='/auth/login'><a className="color-inherit"><Trans>Log in</Trans></a></Link>
            </div>
        );
	}
}

export default connect(state => state)(ActivatePage)