import React, { useState, useRef } from 'react';

import GiphySelect from '@guaclive/react-giphy-select';

import { useClickAway } from 'react-use';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function GifSelector(props){
	const [isOpen, setIsOpen] = useState(false);

	const ref = useRef(null);
	useClickAway(ref, () => {
	  setIsOpen(false);
	});
  
	const handleToggleClick = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div ref={ref} className="chat-input__buttons__gif inline-flex items-center justify-center mr2">
			<FontAwesomeIcon icon='video' onClick={handleToggleClick} />
			<span className="absolute right-0 fr bottom-2 pv2">
				{isOpen &&
					<GiphySelect
					theme={{
						select: `pa1 ba b--gray br2 ${props.darkMode ? 'bg-near-black' : 'bg-white'} ${props.darkMode ? 'near-white' : 'near-black'}`
					}}
					requestKey={process.env.GIPHY_API_KEY}
					onEntrySelect={props.onEntrySelect}
					/>
				}
			</span>
		</div>
	);
}
  
export default GifSelector;