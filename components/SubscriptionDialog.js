import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Trans } from '@lingui/macro';

import { callApi } from 'services/api';
function SubscriptionDialog(props){
	const dispatch = useDispatch();
	const channel = useSelector(state => state.channel);
	const auth = useSelector(state => state.authentication);
	var [plans, setPlans] = useState([]);
	var [loading, setLoading] = useState(true);
	var paypal_link;
	
	if(process.env.NODE_ENV == 'development'){
		paypal_link = 'https://www.sandbox.paypal.com/cgi-bin/webscr/?';
	}else{
		paypal_link = 'https://www.paypal.com/cgi-bin/webscr/?';
	}
   
	useEffect(() => {
		const fetchData = async () => {
			await callApi(`/product/${channel.data.name}`)
			.then(response => response.json())
			.then((res) => {
				if(res.data && res.data.plans){
					res.data.plans.forEach((plan, i) => {
						console.log('plan', plan);
						const paypal_args = new URLSearchParams({
							'cmd': '_xclick-subscriptions',
							'business': plan.email,
							'email': auth.user.email,
							'item_name': plan.plan_name,
							'item_number': plan.plan_id,
							'currency_code': 'USD',
							'a3': plan.price,
							'p3': '1',
							't3': 'M',
							'notify_url': 'https://api.guac.live/payments/ipn',
							'return': `https://guac.live/c/${channel.data.name}`,
							'bn': 'guaclive_Subscribe_WPS_NO',
							'charset': 'UTF-8',
							'sra': 1,
							'src': 1
						});

						plans.push({
							...plan,
							url: `${paypal_link}${paypal_args.toString()}`
						});

						if(i == res.data.plans.length - 1){
							setPlans(plans);
							setLoading(false);
						}
					})
				}
			})
			.catch((err) => {
				console.error(err);
			});
		}
		if(auth?.user?.email) fetchData();
	}, [auth.user.email, channel.data.name, paypal_link, plans]);

	if(!auth || !auth.user || !auth.user.email){
		return (
			<div className="flex w-100 flex-grow-1 flex-nowrap pa1 bg-black-50 primary">
				<Trans>You must be logged in, and have an email attached to your user, to subscribe.</Trans>
			</div>
		);
	}

	console.log('plans', plans);
	return (
		<div className="w-100">
			{
				loading
					?
					(<span>Loading...</span>)
					:
					plans.map((plan, i) => {
						return (
							<div key={i} className="flex w-33 flex-grow-1 flex-nowrap pa1 bg-black-50 primary">
								<div className="pa2">
									<span className="f5 db link green">
										<a href={plan.url} className="link color-inherit">{plan.plan_name}</a>
									</span>
									<a className="link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--dark-green bg-dark-green guac-btn" href={plan.url}>Subscribe ({plan.price}$)</a>
								</div>
							</div>
						)
					})
			}
		</div>
	);
}
export default SubscriptionDialog;