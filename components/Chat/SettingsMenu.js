import { useState, useRef } from 'react';
import useLocalStorage from 'react-use/lib/useLocalStorage';

import Switch from 'react-switch';

import { useClickAway } from 'react-use';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Trans, t } from '@lingui/macro';

function SettingsMenu(props){
	const [checked, isChecked] = useLocalStorage('showTimestamps');
	const [notifySound, setNotifySound] = useLocalStorage('notifySound');
	const [isOpen, setIsOpen] = useState(false);

	const handleTimestampsOption = () => isChecked(!checked);
	const handleNotifySound = () => setNotifySound(!notifySound);
	
	const ref = useRef(null);
	useClickAway(ref, () => {
	  setIsOpen(false);
	});

	const handleToggleClick = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div ref={ref} className="chat-input__settings inline-flex items-center justify-center mr2">
			<FontAwesomeIcon icon='cog' onClick={handleToggleClick} className="primary" />
			<div className="absolute right-0 fr pv2 ph2" style={{'bottom': '11rem'}}>
				{isOpen &&
					<div className={`pa1 ba b--gray br2 ${props.darkMode ? 'bg-near-black' : 'bg-white'} ${props.darkMode ? 'near-white' : 'near-black'}`}>
						<div className="relative h5 w5 ml1 mb2">
							<span className="f3 b tracked mt0 mb3"><Trans>Settings</Trans></span>
							<label htmlFor="switch-timestamps" className="items-center flex flex-nowrap ph3 pv2 bg-animate link pointer">
								<Switch
									id="switch-timestamps"
									onChange={handleTimestampsOption}
									checked={checked}
									uncheckedIcon={false}
									checkedIcon={false}
									onColor="#19a974"
								/>
								<span id="switch-timestamps-label" className="ml2">
								<Trans>Timestamps</Trans>
								</span>
							</label>
							<label htmlFor="switch-notifysound" className="items-center flex flex-nowrap ph3 pv2 bg-animate link pointer">
								<Switch
									id="switch-notifysound"
									onChange={handleNotifySound}
									checked={notifySound}
									uncheckedIcon={false}
									checkedIcon={false}
									onColor="#19a974"
								/>
								<span id="switch-notifysound-label" className="ml2">
								<Trans>Sound when highlighted</Trans>
								</span>
							</label>
							<a href={`/chat/${props.channel}`} onClick={() => {
								if(typeof window !== 'undefined'){
									window.open('/chat/' + props.channel, 'popup', 'width=500,height=800');
								}
							}} target="popup" className="ml2 items-center flex flex-nowrap ph3 pv2 bg-animate link truncate pointer primary">
								<Trans>Pop-out chat</Trans>
							</a>
						</div>
					</div>
				}
			</div>
		</div>
	);
}

export default SettingsMenu;