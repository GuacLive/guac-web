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
			<div ref={ref} data-details="" className="dropdown-menu primary absolute nowrap right-0 ba b--transparent shadow-1 br2 w5" style={{left: 'auto', display: isOpen ? 'block' : 'none', top: '100%'}}>
				<ul className="list f6 mr0 ml0 mt0 mb0 pa3">
					<li>
						<Link href={props.user.can_stream ? `/c/${props.user.name}` : '/'}>
							<a className="flex items-center tw-relative pa2 relative w-100 link b hover-green white ph3">
								<div className="items-center flex flex-shrink-0 pr2">
									<div className="items-center inline-flex">
										<i className="fa fa-user"></i>
									</div>
								</div>
								<div className="flex-grow-1">{props.user.name}</div>
							</a>
						</Link>
					</li>
					<li>
						<Link href="/settings">
							<a className="flex items-center tw-relative pa2 relative w-100 link b hover-green white ph3">
								<div className="items-center flex flex-shrink-0 pr2">
									<div className="items-center inline-flex">
										<i className="fas fa-fw fa-user-cog"></i>
									</div>
								</div>
								<div className="flex-grow-1">Settings</div>
							</a>
						</Link>
					</li>
					<li>
						<Link href="/dashboard">
							<a className="flex items-center tw-relative pa2 relative w-100 link b hover-green white ph3">
								<div className="items-center flex flex-shrink-0 pr2">
									<div className="items-center inline-flex">
										<i className="fas fa-fw fa-video"></i>
									</div>
								</div>
								<div className="flex-grow-1">Dashboard</div>
							</a>
						</Link>
					</li>
					{
					(props.user.type === 'staff' || props.user.type === 'admin')
					&&
						<li>
							<Link href="/admin">
								<a className="flex items-center tw-relative pa2 relative w-100 link b hover-blue white ph3">
									<div className="items-center flex flex-shrink-0 pr2">
										<div className="items-center inline-flex">
											<i className="fas fa-fw fa-hammer"></i>
										</div>
									</div>
									<div className="flex-grow-1">Admin</div>
								</a>
							</Link>
						</li> 
					}
					<li>
						<Link href="/auth/logout">
							<a className="flex items-center tw-relative pa2 relative w-100 link b hover-red white ph3">
								<div className="items-center flex flex-shrink-0 pr2">
									<div className="items-center inline-flex">
										<i className="fas fa-fw fa-sign-out-alt"></i>
									</div>
								</div>
								<div className="flex-grow-1">Log out</div>
							</a>
						</Link>
					</li>
				</ul>
			</div>
		</>
	);
}
export default AccountMenu;