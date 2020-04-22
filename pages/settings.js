import React, { useState } from 'react'
import { connect } from 'react-redux';

import { Trans, t } from '@lingui/macro';

import withAuth from '../utils/withAuth';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const ProfileComponent = dynamic(() => import('../components/Settings/Profile'));
const ConnectionsComponent = dynamic(() => import('../components/Settings/Connections'));

function SettingsPage(props){
	const auth = props.authentication;
	const [tab, setTab] = useState(0);
	if(auth.loading) return null;
	return (
		<div className="flex flex-nowrap h-100 w-100 mw7 pv3 ph3-l overflow-hidden relative">
			<div className="flex flex-column flex-grow-1 h-100 w-100 overflow-hidden relative">
				<div className="site-component-settings-tabs">
					<h2 className="f2 tracked mt0 mb3"><Trans>Settings</Trans></h2>
					<ul className="flex items-center bb b--gray w-100 list pl0">
						<li className="dib f4 lh-copy">
							<a onClick={() => {return setTab(0);}} className={`no-underline pointer ${tab == 0 ? 'primary': 'gray'} hover-primary link inline-flex pv2 mr4`}><Trans>Profile</Trans></a>
						</li>
						<li className="dib f4 lh-copy">
							<Link href="/dashboard">
								<a onClick={() => {return setTab(1);}} className={`no-underline pointer ${tab == 1 ? 'primary': 'gray'} hover-primary link inline-flex pv2 mr4`}><Trans>Channel</Trans></a>
							</Link>
						</li>
						<li className="dib f4 lh-copy">
							<a onClick={() => {return setTab(2);}} className={`no-underline pointer ${tab == 2 ? 'primary': 'gray'} hover-primary link inline-flex pv2 mr4`}><Trans>Connections</Trans></a>
						</li>
					</ul>
				</div>
				<div className="flex flex-column flex-nowrap h-100 w-100 overflow-hidden relative">
					{tab == 0 && <ProfileComponent />}
					{tab == 2 && <ConnectionsComponent />}
				</div>
			</div>
		</div>
	);
}

export default connect(state => state)(withAuth(SettingsPage))