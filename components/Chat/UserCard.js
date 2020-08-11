import {useState, useRef} from 'react';

import {useLingui} from "@lingui/react"
import {Trans, t} from '@lingui/macro';

import { useClickAway } from 'react-use';

import { useSelector } from 'react-redux';

import GuacButton from 'components/GuacButton';

function UserCard(props) {
	const {i18n} = useLingui();
	const [isOpen, setIsOpen] = useState(true);

	const myFollowed = useSelector(state => state.site.myFollowed);
	const ref = useRef(null);
	useClickAway(ref, () => {
	  setIsOpen(false);
	  if(props.onClose) props.onClose();
	});

	const handleToggleClick = () => {
		setIsOpen(!isOpen);
		if(!isOpen && props.onClose) props.onClose();
	};
console.log('UserCard props', props);
	if(!props.user) return null;

	let followed = myFollowed && myFollowed.find((u) => {
		return u && u.to_id === props.user.id;
	});

	let msg = document &&
		typeof document.querySelector === 'function' &&
		document.querySelector(`[data-id="${props.msgID}"]`);
	let bounds = msg &&
		typeof msg.getBoundingClientRect === 'function' &&
		msg.getBoundingClientRect();

	let firstBadge = props.user.badges && props.user.badges[0];
	return (
		<div ref={ref} className={`absolute right-2 fr pv2 ph2 w5 ${isOpen ? 'z-3' : 'dn'}`} style={{
			top: bounds ? (bounds.top + window.scrollY + 'px') : 'auto'
		}}>
			{isOpen &&
				<div className={`flex flex-column h-100 w-100 items-start flex-grow-1 content-start pa2 ba b--gray br2 ${props.darkMode ? 'bg-near-black' : 'bg-white'} ${props.darkMode ? 'near-white' : 'near-black'}`}>
					<div className="inline-flex pr5">
						<span className="line-clamp-2 break-word f4">{props.user.name}</span>
					</div>
					<div className="inline-flex pr5">
						<span className="f5">{ followed ? <Trans>Following</Trans> : <Trans>Not following</Trans>}</span>
					</div>
					<div className="flex align-center mb2">
						{
							firstBadge &&
							<>
								<span
									className="chat-message-badges__badge"
									data-badge={firstBadge.id}
									title={firstBadge.label}
								>
								</span>
								<span>{firstBadge.label}</span>
							</>
						}
					</div>
					<div className="flex flex-row items-start align-center justify-between w-100">
						<GuacButton color="green" onClick={props.mention}><Trans>Mention</Trans></GuacButton>
					</div>
					<div className="mr2 mt2 right-0 top-0 absolute">
						<a
							href="#"
							onClick={(e) => {
								e && e.preventDefault();
								handleToggleClick();
							}}
							className="link red ph2 br2 bg-animate hover-bg-dark-gray outline-none b"
							title={i18n._(t`Close`)}
						>
							<span>X</span>
						</a>
					</div>
				</div>
			}
		</div>
	);
}

export default UserCard;