import { useState, useRef, useEffect } from 'react';

import { useClickAway } from 'react-use';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function EmojiSelector(props){
	const [isOpen, setIsOpen] = useState(false);
	const [emotes, setEmotes] = useState(props.emotes);
	
	const handleToggleClick = () => {
		setIsOpen(!isOpen);
	};

	const Picker = require('emoji-picker-element').Picker;
	const picker = new Picker({
		dataSource: '/data.json',
		class: props.darkMode ? 'dark' : 'light',
		customEmoji: emotes,
	});
	picker.addEventListener('emoji-click', event => props.onSelect(event.detail.emoji, setIsOpen));
	
	const ref = useRef(null);
	const emojiRef = useRef(null);
	useClickAway(ref, () => {
	  setIsOpen(false);
	});
 
	useEffect(() => {
		let test = emojiRef.current;
		if(test && (!test.children || test.children.length === 0)){
			picker.customEmoji = emotes;
			test.appendChild(picker);
		}

	}, [emojiRef.current])
	var nameCapitalized;
	if(props.channel){
		nameCapitalized = props.channel.charAt(0).toUpperCase() + props.channel.slice(1);
	}

	return (
		<div ref={ref} className="chat-input__buttons__emote inline-flex items-center justify-center mr2">
			<FontAwesomeIcon icon={['far', 'smile-wink']} onClick={handleToggleClick} />
			<span className="absolute right-0 fr bottom-2 pv2">
				<div ref={emojiRef} hidden={!isOpen}></div>
			</span>
		</div>
	);
}

  
export default EmojiSelector;