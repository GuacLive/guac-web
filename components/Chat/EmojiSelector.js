import React, { useState } from 'react';

import { NimblePicker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import twitterData from 'emoji-mart/data/twitter.json';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function EmojiSelector(props){
	const [isOpen, setIsOpen] = useState(false);
	const [emotes, setEmotes] = useState(props.emotes);

	const handleToggleClick = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="chat-input__buttons__emote inline-flex items-center justify-center mr2">
			<FontAwesomeIcon icon='smile-wink' onClick={handleToggleClick} />
			<span className="absolute right-0 fr bottom-2 pv5">
				{isOpen &&
					<NimblePicker
						perLine={8}
						emojiSize={24}
						sheetSize={20}
						set="twitter"
						custom={emotes}
						onSelect={props.onSelect}
						data={twitterData}
						include={[
							'recent',
							'custom',
							'people',
							'nature',
							'foods',
							'activity',
							'places',
							'objects',
							'symbols',
							'flags',
						]}
						showPreview={true}
					/>
				}
			</span>
		</div>
	);
}

export default EmojiSelector;