import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function SettingsMenu(props){
	const [isOpen, setIsOpen] = useState(false);

	const handleToggleClick = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="chat-input__settings inline-flex items-center justify-center mr2">
			<FontAwesomeIcon icon='cog' onClick={handleToggleClick} className="primary" />
			<div className="absolute right-0 fr pv2 ph2" style={{'bottom': '11rem'}}>
				{isOpen &&
					<div className="pa1 ba b--gray br2 bg-white near-black">
						<div className="relative h5 w5 ml1 mb2">
							<span class="f3 b tracked mt0 mb3">Settings</span>
						</div>
					</div>
				}
			</div>
		</div>
	);
}

export default SettingsMenu;