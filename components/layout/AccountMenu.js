import Link from 'next/link'

import { useState } from 'react';

function AccountMenu(props){
	const [show, setShow] = useState(false);
	return (
		<>
			<a className="link pv2 ph3" href="#!" onClick={() => setShow(!show)}><img alt={props.user.name} className="dim ba b--transparent db br-100 w2 w2-ns h2 h2-ns" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII" /></a>
			<div data-details="" className="dropdown-menu primary absolute nowrap right-0 ba br1 w5" style={{left: 'auto', display: show ? 'block' : 'none', top: '100%'}}>
				<ul className="list f6 mr0 ml0 mt0 mb0 pa3">
					<li><Link href={props.user.can_stream ? `/c/${props.user.name}` : '/'}><a className="flex items-center pa1 relative w-100 link b hover-green primary ph3"><span>{props.user.name}</span></a></Link></li>
					<li><Link href="/dashboard"><a className="flex items-center pa1 relative w-100 link b hover-green primary ph3"><span>Dashboard</span></a></Link></li>
					<li><Link href="/auth/logout"><a className="flex items-center pa1 relative w-100 link b hover-green primary ph3"><span>Log out</span></a></Link></li>
				</ul>
			</div>
		</>
	);
}
export default AccountMenu;