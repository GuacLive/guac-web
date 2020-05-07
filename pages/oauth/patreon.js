import React from 'react';

import {connect} from 'react-redux';

import fetch from 'cross-fetch';

import {wrapper} from '../../store/configureStore';

import withAuth from '../../utils/withAuth';

const API_URL = process.env.API_URL;
function OauthPatreonPage(props){
	if(props.oauthResponse){
		return (
			<p>{props.oauthResponse.statusMessage}</p>
		);
	}
	return null;
}

// we can't use getServerSideProps, because we are using withAUth HOC
OauthPatreonPage.getInitialProps = wrapper.getInitialPageProps(
	async ({store, res, isServer, pathname, query, req}) => {
		const state = store.getState();
		const r = await fetch(`${API_URL}/oauth/patreon?code=${query.code}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${state.authentication.token}`,
			}
		});
		const oauthResponse = await r.json();
		console.log('oauthResponse', oauthResponse);
		if(oauthResponse && oauthResponse.statusCode === 200){
			if(res){
				res.setHeader('Location', '/settings');
				res.statusCode = 302;
				res.end();
			}
		}
		return {
			props: {
				oauthResponse
			}, // will be passed to the page component as props
		};
	}
);
	
export default connect(state => state)(withAuth(OauthPatreonPage))