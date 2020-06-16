import Link from 'next/link'

import { useState, useRef, Fragment } from 'react';

import { useClickAway } from 'react-use';

import { useLingui } from "@lingui/react";
import { Trans, t } from '@lingui/macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
function NotificationsMenu(props){
	const { i18n } = useLingui();
	const [isOpen, setIsOpen] = useState(false);
	
	const ref = useRef(null);
	useClickAway(ref, () => {
	  setIsOpen(false);
	});

	return (
		<div className="items-stretch flex flex-grow-1 h-100 relative">
			<a className="db link pv2 ph3 color-inherit" href="#!" onClick={() => setIsOpen(!isOpen)}>
				<FontAwesomeIcon icon="bell" />
			</a>
			<div ref={ref} data-details="" className="dropdown-menu primary absolute nowrap right-0 ba b--transparent shadow-1 br2 w5" style={{left: 'auto', display: isOpen ? 'block' : 'none', top: '100%'}}>
				<div className="f5 b pa3"><Trans>Coming soon.</Trans></div>
			</div>
		</div>
	);
}
export default NotificationsMenu;