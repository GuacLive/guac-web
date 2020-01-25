import Link from 'next/link'

import { useState, useRef, Fragment } from 'react';

import { useClickAway } from 'react-use';

import { Trans } from '@lingui/macro';

import Image from '../Image';

function AccountMenu(props){
	const [isOpen, setIsOpen] = useState(false);
	
	const ref = useRef(null);
	useClickAway(ref, () => {
	  setIsOpen(false);
	});

	return (
		<>
			<a className="db link pv2 ph3" href="#!" onClick={() => setIsOpen(!isOpen)}>
				<Image src={props.user.avatar || '//api.guac.live/avatars/unknown.png'} alt={props.user.name} shape="squircle" fit="cover" lazyload className="dim w2 w2-ns h2 h2-ns" />
			</a>
			<div ref={ref} data-details="" className="dropdown-menu primary absolute nowrap right-0 ba br1 w5" style={{left: 'auto', display: isOpen ? 'block' : 'none', top: '100%'}}>
				<ul className="list f6 mr0 ml0 mt0 mb0 pa3">
					<li><Link href={props.user.can_stream ? `/c/${props.user.name}` : '/'}><a className="flex items-center pa1 relative w-100 link b hover-green primary ph3"><span>{props.user.name}</span></a></Link></li>
					<li><Link href="/settings"><a className="flex items-center pa1 relative w-100 link b hover-green primary ph3"><Trans>Settings</Trans></a></Link></li>
					<li><Link href="/dashboard"><a className="flex items-center pa1 relative w-100 link b hover-green primary ph3"><Trans>Dashboard</Trans></a></Link></li>
					{(props.user.type === 'staff' || props.user.type === 'admin') && <li><Link href="/admin"><a className="flex items-center pa1 relative w-100 link b hover-green primary ph3"><Trans>Admin</Trans></a></Link></li>}
					<li><Link href="/auth/logout"><a className="flex items-center pa1 relative w-100 link b hover-green primary ph3"><Trans>Log out</Trans></a></Link></li>
				</ul>
			</div>
		</>
	);
}
export default AccountMenu;