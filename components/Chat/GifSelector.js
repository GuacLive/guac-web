import React, { useState } from 'react';

import GiphySelect from 'react-giphy-select';
import 'react-giphy-select/lib/styles.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function GifSelector(props){
	const [isOpen, setIsOpen] = useState(false);

	const handleToggleClick = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="chat-input__buttons__gif inline-flex items-center justify-center mr2">
			<FontAwesomeIcon icon='video' onClick={handleToggleClick} />
			<span className="absolute right-0 fr bottom-2 pv5">
				{isOpen &&
					<GiphySelect
					theme={{
						select: `pa1 ba b--gray br2 bg-white near-black`
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