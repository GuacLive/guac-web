import React, { Component } from 'react'
import { connect } from 'react-redux';

import { Trans, t } from '@lingui/macro';

import withAuth from '../utils/withAuth';

function monthDiff(d1, d2){
	var months;
	months = (d2.getFullYear() - d1.getFullYear()) * 12;
	months -= d1.getMonth();
	months += d2.getMonth();
	return months <= 0 ? 0 : months;
}

const API_URL = process.env.API_URL;
function SubscriptionsPage(props){
	const { result } = props;
	const auth = props.authentication;
	if(auth.loading) return null;
	console.log('subscriptions', result);
	return (
		<div className="flex flex-nowrap h-100 w-100 mw7 pv3 ph3-l overflow-hidden relative">
			<div className="flex flex-column flex-grow-1 h-100 w-100 overflow-hidden relative">
				<h2 className="f2 tracked mt0 mb3"><Trans>Subscriptions</Trans></h2>
				<div className="flex flex-column flex-nowrap h-100 w-100 overflow-hidden relative">
					{
						result.data &&
						result.data.map((sub, i) => {
							let subLength = monthDiff(new Date(sub.start_date), new Date(sub.expiration_date));
							return (
								<div key={`sub_${i}`} className="pa2">
									<p><Trans>Subbed to:</Trans> {channel_stream_id}</p>
									<p><Trans>Start date:</Trans> {sub.start_date}</p>
									<p><Trans>End date:</Trans> {sub.expiration_date}</p>
									<p><Trans>Length:</Trans> {subLength}</p>
								</div>
							);
						})
					}
				</div>
			</div>
		</div>
	);
}
SubscriptionsPage.getInitialProps = async ({store}) => {
	const { authentication } = store.getState();
	let result;
	await fetch(API_URL + '/user/subscriptions', {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		headers: {
			authorization: `${authentication.token}`
		}
	})
	.then(response => response.json())
	.then(r => {
		result = r;
	});
	return {...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}), result};
};

export default connect(state => state)(withAuth(SubscriptionsPage))