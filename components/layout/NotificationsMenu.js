import Link from 'next/link'

import { useEffect, useState, useRef } from 'react';

import { connect, useDispatch, useSelector } from 'react-redux';
	
import { useClickAway } from 'react-use';

import { useLingui } from "@lingui/react";
import { Trans, t } from '@lingui/macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const API_URL = process.env.API_URL;
function NotificationsMenu(props){
	const auth = useSelector(state => state.authentication);
	const [isOpen, setIsOpen] = useState(false);
	const [notifications, setNotifications] = useState({});
	let notificationMaxId = useRef();
	
	const ref = useRef(null);
	useClickAway(ref, () => {
	  setIsOpen(false);
	});

	useEffect(() => {
		async function fetchData() {
			const res = await fetch(API_URL + '/notifications', {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${auth.user.token}`,
				}
			}).then(response => response.json());
			let data = res.data;
			let ids = [null];
			if (res?.data) {
				ids = res.data.map(n => n.id);
			}
			notificationMaxId.current = Math.min(...ids);
			setNotifications(data);
		}
		if (auth?.user?.token) fetchData();
	}, [auth?.user?.token]);

	return (
		<div className="items-stretch flex flex-grow-1 h-100 relative">
			<a className="db link pv2 ph3 color-inherit" href="#!" onClick={() => setIsOpen(!isOpen)}>
				<FontAwesomeIcon icon="bell" />
			</a>
			<div ref={ref} data-details="" className="dropdown-menu color-inherit absolute nowrap right-0 ba b--transparent shadow-1 br2 w5" style={{left: 'auto', display: isOpen ? 'block' : 'none', top: '100%'}}>
				<div className="notification-header flex items-center bb b--mid-gray" style={{
					height: '50px'
				}}>
					<h3 className="f3 mh3"><Trans>Notifications</Trans></h3>
				</div>
				<div className="notification-messages flex overflow-y-auto">
					{
						notifications &&
						notifications.length === 0 &&
						<div className="f5 b pa3"><Trans>No notifications yet.</Trans></div>
					}
					{
						notifications &&
						notifications.length > 0 &&
						notifications.map((n, key) => {
							return (
								<div
									className="flex items-center pv2 ph3 bb bb-dark-gray"
									key={`notification_${key}`}
								>
									{JSON.stringify(n)}
								</div>
							)
						})
					}
				</div>
			</div>
		</div>
	);
}
export default NotificationsMenu;