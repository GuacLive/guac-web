import Link from 'next/link'

import { useState, useRef } from 'react';

import { useClickAway } from 'react-use';

import { useLingui } from "@lingui/react";
import { Trans, t } from '@lingui/macro';

import Image from '../Image';

import DarkModeToggle from '../DarkModeToggle';
import LangSwitcher from 'components/LangSwitcher';
function AccountMenu(props){
	const { i18n } = useLingui();
	const [isOpen, setIsOpen] = useState(false);
	
	const ref = useRef(null);
	useClickAway(ref, () => {
	  setIsOpen(false);
	});

	return (
		<div className="items-stretch flex flex-grow-1 h-100 pl2 relative">
			<a alt="Account menu" className="db link pv2 ph3 color-inherit" href="#!" onClick={() => setIsOpen(!isOpen)}>
				<div className="relative w2 w2-ns h2 h2-ns">
					<Image alt="User avatar" src={props.user && props.user.avatar || 'https://api.guac.live/avatars/unknown.png'} alt={props.user ? props.user.name : null} width={70} height={70} shape="squircle" fit="cover" lazyload className="dim" />
				</div>
			</a>
			<div ref={ref} data-details="" className="dropdown-menu primary absolute nowrap right-0 ba b--transparent shadow-1 br2 w5" style={{left: 'auto', display: isOpen ? 'block' : 'none', top: '100%'}}>
				{
					props.user &&
					<div className="bg-green black ph3 pv1 br2 br--top">
						<div className="flex items-center">
							<Link href="/settings">
								<a className="link ml0 mr3 relative w2 w2-ns h2 h2-ns">
									<Image alt="User avatar" src={props.user && props.user.avatar || 'https://api.guac.live/avatars/unknown.png'} alt={props.user.name} shape="squircle" width={70} height={70} fit="cover" lazyload className="dim" />
								</a>
							</Link>
							<div>
								<div className="f4 flex-grow-1">{props.user.name}</div>
								<div className="f5 normal flex-grow-1">{props.user.can_stream ? i18n._(t`Streamer`) : i18n._(t`User`)}</div>
							</div>
						</div>
					</div>
				}
				<ul className="list f6 mr0 ml0 mt0 mb0 pa3">
					{props.user &&
						<>
							<li>
								<Link href={props.user.can_stream ? `/${props.user.name}` : '/'}>
									<a className="flex items-center tw-relative pa2 relative w-100 link b hover-green white ph3">
										<div className="items-center flex flex-shrink-0 pr2">
											<div className="items-center inline-flex">
												<i className="fa fa-user"></i>
											</div>
										</div>
										<div className="flex-grow-1"><Trans>My Channel</Trans></div>
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
										<div className="flex-grow-1"><Trans>Settings</Trans></div>
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
										<div className="flex-grow-1"><Trans>Dashboard</Trans></div>
									</a>
								</Link>
							</li>
						</>
					}
					{
					(props.user)
					&&
						<li>
							<Link href="/subscriptions">
								<a className="flex items-center tw-relative pa2 relative w-100 link b hover-blue white ph3">
									<div className="items-center flex flex-shrink-0 pr2">
										<div className="items-center inline-flex">
											<i className="fas fa-fw fa-star"></i>
										</div>
									</div>
									<div className="flex-grow-1"><Trans>Subscriptions</Trans></div>
								</a>
							</Link>
						</li> 
					}
					{
					(props.user && (props.user.type === 'staff' || props.user.type === 'admin'))
					&&
						<li>
							<Link href="/admin">
								<a className="flex items-center tw-relative pa2 relative w-100 link b hover-blue white ph3">
									<div className="items-center flex flex-shrink-0 pr2">
										<div className="items-center inline-flex">
											<i className="fas fa-fw fa-hammer"></i>
										</div>
									</div>
									<div className="flex-grow-1"><Trans>Admin</Trans></div>
								</a>
							</Link>
						</li> 
					}
					<li>
						<DarkModeToggle mode={props.mode} />
					</li>
					<li>
						<LangSwitcher mode={props.mode} />
					</li>
					{
						props.user &&
						<li>
							<Link href="/auth/logout">
								<a className="flex items-center tw-relative pa2 relative w-100 link b hover-red white ph3">
									<div className="items-center flex flex-shrink-0 pr2">
										<div className="items-center inline-flex">
											<i className="fas fa-fw fa-sign-out-alt"></i>
										</div>
									</div>
									<div className="flex-grow-1"><Trans>Log out</Trans></div>
								</a>
							</Link>
						</li>
					}
				</ul>
			</div>
		</div>
	);
}
export default AccountMenu;