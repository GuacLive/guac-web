import React, { useState } from 'react'
import { connect } from 'react-redux';

import { Trans, t } from '@lingui/macro';

import withAuth from '../utils/withAuth';

import dynamic from 'next/dynamic';

const StreamComponent = dynamic(() => import('../components/Dashboard/Stream'));
const BrandComponent = dynamic(() => import('../components/Dashboard/Brand'));

function DashboardPage(props){
	const auth = props.authentication;
	const [tab, setTab] = useState(0);
	if(auth.loading) return null;
	return (
		<div className="flex flex-nowrap h-100 w-100 mw7 pv3 ph3-l relative">
			<div className="flex flex-column flex-grow-1 h-100 w-100 relative">
				<div className="site-component-dashboard-tabs">
					<h2 className="f2 tracked mt0 mb3"><Trans>Dashboard</Trans></h2>
					<ul className="flex items-center bb b--gray w-100 list pl0">
						<li className="dib f4 lh-copy">
							<a onClick={() => {return setTab(0);}} className={`no-underline pointer ${tab == 0 ? 'primary': 'gray'} hover-primary link inline-flex pv2 mr4`}><Trans>Stream</Trans></a>
						</li>
						<li className="dib f4 lh-copy">
							<a onClick={() => {return setTab(1);}} className={`no-underline pointer ${tab == 1 ? 'primary': 'gray'} hover-primary link inline-flex pv2 mr4`}><Trans>Brand</Trans></a>
						</li>
						<li className="dib f4 lh-copy">
							<a onClick={() => {return setTab(2);}} className={`no-underline pointer ${tab == 2 ? 'primary': 'gray'} hover-primary link inline-flex pv2 mr4`}><Trans>Subscriptions</Trans></a>
						</li>
					</ul>
				</div>
				<div className="flex flex-column flex-nowrap h-100 w-100 relative">
					{tab == 0 && <StreamComponent />}
					{tab == 1 && <BrandComponent />}
					{tab == 2 && <Trans>Subscriptions</Trans>}
				</div>
			</div>
		</div>
	);
}

export default connect(state => state)(withAuth(DashboardPage))