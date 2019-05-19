import React from 'react';
import PropTypes from 'prop-types';

import { NimblePicker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import twitterData from 'emoji-mart/data/twitter.json';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class EmojiSelector extends React.Component {
	state = {
		isOpen: false,
		emotes: []
	};

	static propTypes = {
		/**
		 * Callback to be called on icon select
		 */
		onSelect: PropTypes.func.isRequired
	};
  
	constructor(props){
		super(props);
		this.state = {
			emotes: props.emotes
		};
		this.handleToggleClick = this.handleToggleClick.bind(this);
	}
	
	/**
	 * Handles open/close state
	 */
	handleToggleClick() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	};

	render() {
		const { isOpen, emotes } = this.state;
		return (
			<div className="chat-input__buttons__emote inline-flex items-center justify-center mv2">
				<FontAwesomeIcon icon='smile-wink' onClick={this.handleToggleClick} />
				<span className="absolute left-0 right-0 fr bottom-2 pv5">
					{isOpen &&
						<NimblePicker
							perLine={8}
							emojiSize={24}
							sheetSize={20}
							set="twitter"
							custom={emotes}
							onSelect={this.props.onSelect}
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
}
export default EmojiSelector;