import React, { useState, useRef } from 'react';

import { useLingui } from "@lingui/react"
import { Trans, t } from '@lingui/macro';

import { useClickAway } from 'react-use';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ViewerList(props){
	const { i18n } = useLingui();
	const [isOpen, setIsOpen] = useState(false);

	const ref = useRef(null);
	useClickAway(ref, () => {
	  setIsOpen(false);
	});
  
	const handleToggleClick = () => {
		setIsOpen(!isOpen);
	};

	const users = [...props.users].map((args) => {
		let user = args[1];
		return user;
	});

	const broadcaster = users.filter((u) => {
		return u && u.badges && u.badges[0] && u.badges[0].id === 'broadcaster';
	});
	const staff = users.filter((u) => {
		return u && u.type && u.type === 'staff' && !broadcaster.find((b) => u.id == b.id);
	});
	const mods = users.filter((u) => {
		return u && u.type && u.type !== 'staff' && u.type === 'moderator' && !broadcaster.find((b) => u.id == b.id);
	});
	const supporters = users.filter((u) => {
		return u && !u.anon && u.type !== 'staff' && u.type !== 'moderator' && u.isPatreon && !broadcaster.find((b) => u.id == b.id);
	});
	const usrs = users.filter((u) => {
		return u && !u.anon && u.type !== 'staff' && u.type !== 'moderator' && !u.isPatreon && !broadcaster.find((b) => u.id == b.id);
	});

	return (
		<div ref={ref} className="chat-viewerlist inline-flex items-center justify-center mr2">
			<a
				href="#"
				onClick={(e) => {
					e && e.preventDefault();
					handleToggleClick();
				}}
				className="link color-inherit ph2 br2 bg-animate hover-bg-dark-gray outline-none"
				title={i18n._(t`Users in chat`)}
			>
			<FontAwesomeIcon icon='user' fixedWidth />
			</a>
			<div className="absolute top-2 right-2 fr pv2 ph2 h-100 w5 z-3">
				{isOpen &&
					<div className={`pa2 ba b--gray br2 ${props.darkMode ? 'bg-near-black' : 'bg-white'} ${props.darkMode ? 'near-white' : 'near-black'}`}>
						{
							broadcaster
							&&
							broadcaster.length > 0
							&&
							<div className="db bb b--gray pb4">
								<span className="f5 b tracked mt0 mb3"><Trans>Broadcaster:</Trans></span>
								<ul className="pa0 ma0 list">
									{
										broadcaster &&
										broadcaster.map((u) => {
											return (
												<li key={`broadcaster_${u.name}`} className="flex flex-grow-1" style={{color: `#${u.color}`}}>{u.name}</li>
											);
										})
									}
								</ul>
							</div>
						}
						{
							staff
							&&
							staff.length > 0
							&&
							<div className="db bb b--gray pb4">
								<span className="f5 b tracked mt0 mb3"><Trans>Staff in chat:</Trans></span>
								<ul className="pa0 ma0 list">
									{
										staff &&
										staff.map((u) => {
											return (
												<li key={`staff_${u.name}`} className="flex flex-grow-1" style={{color: `#${u.color}`}}>{u.name}</li>
											);
										})
									}
								</ul>
							</div>
						}
						{
							mods
							&&
							mods.length > 0
							&&
							<div className="db bb b--gray pb4">
								<span className="f5 b tracked mt0 mb3"><Trans>Moderators in chat:</Trans></span>
								<ul className="pa0 ma0 list">
									{
										mods &&
										mods.map((u) => {
											return (
												<li key={`mods_${u.name}`} className="flex flex-grow-1" style={{color: `#${u.color}`}}>{u.name}</li>
											);
										})
									}
								</ul>
							</div>
						}
						{
							supporters
							&&
							supporters.length > 0
							&&
							<div className="db bb b--gray pb4">
								<span className="f5 b tracked mt0 mb3"><Trans>Patreon supporters:</Trans></span>
								<ul className="pa0 ma0 list">
									{
										supporters &&
										supporters.map((u) => {
											return (
												<li key={`user_${u.name}`} className="flex flex-grow-1" style={{color: `#${u.color}`}}>{u.name}</li>
											);
										})
									}
								</ul>
							</div>
						}
						{
							usrs
							&&
							usrs.length > 0
							&&
							<div className="db bb b--gray pb4">
								<span className="f5 b tracked mt0 mb3"><Trans>Users in chat:</Trans></span>
								<ul className="pa0 ma0 list">
									{
										usrs &&
										usrs.map((u) => {
											return (
												<li key={`user_${u.name}`} className="flex flex-grow-1" style={{color: `#${u.color}`}}>{u.name}</li>
											);
										})
									}
								</ul>
							</div>
						}
					</div>
				}
			</div>
		</div>
	);
}
  
export default ViewerList;