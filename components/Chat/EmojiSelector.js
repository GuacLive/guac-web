import { useState, useRef } from 'react';

import { NimblePicker } from 'emoji-mart';
import twitterData from 'emoji-mart/data/twitter.json';

import { useClickAway } from 'react-use';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'emoji-mart/css/emoji-mart.css';

function EmojiSelector(props){
	const [isOpen, setIsOpen] = useState(false);
	const [emotes, setEmotes] = useState(props.emotes);

	const ref = useRef(null);
	useClickAway(ref, () => {
	  setIsOpen(false);
	});
  

	const handleToggleClick = () => {
		setIsOpen(!isOpen);
	};

	var nameCapitalized;
	if(props.channel){
		nameCapitalized = props.channel.charAt(0).toUpperCase() + props.channel.slice(1);
	}

	return (
		<div ref={ref} className="chat-input__buttons__emote inline-flex items-center justify-center" onClick={handleToggleClick} >
			<FontAwesomeIcon icon={['far', 'smile-wink']} />
			<span className="absolute right-0 fr bottom-2 pv2" 
			onClick={(e) => {
				e && e.stopPropagation();
				e && e.preventDefault();
			}}>
				{isOpen &&
					<NimblePicker
						perLine={6}
						emojiSize={38}
						sheetSize={64}
						set="twitter"
						custom={emotes}
						onSelect={props.onSelect}
						theme={props.darkMode ? 'dark' : 'light'}
						data={twitterData}
						include={[
							'recent',
							`custom-${nameCapitalized}`,
							'custom-Global',
							'custom-Twitch',
							'custom-BetterTTV',
							'custom-FrankerfaceZ',
							'custom-7TV',
							'people',
							'nature',
							'foods',
							'activity',
							'places',
							'objects',
							'symbols',
							'flags',
						]}
						title={''}
						emoji={'avocado'}
						emojiTooltip={true}
						showPreview={true}
					/>
				}
			</span>
		</div>
	);
}

  
export default EmojiSelector;