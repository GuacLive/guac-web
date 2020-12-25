import { useState, useRef } from 'react';

import ReactGiphySearchbox from 'react-giphy-searchbox/es/index';

import 'react-giphy-searchbox/es/index.module.css';

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
		<div ref={ref} className="chat-input__buttons__gif inline-flex items-center justify-center" onClick={handleToggleClick}>
			<FontAwesomeIcon icon={['far', 'image']} />
			<span className="absolute right-0 fr bottom-2 pv2" 
			onClick={(e) => {
				e && e.stopPropagation();
				e && e.preventDefault();
			}}>
				{isOpen &&
					<ReactGiphySearchbox
					rating="r"
					autoFocus={true}
					wrapperClassName={`chat-gifselector pa1 ba b--gray br2 ${props.darkMode ? 'bg-near-black' : 'bg-white'} ${props.darkMode ? 'near-white' : 'near-black'}`}
					masonryConfig={[
						{ columns: 3, imageWidth: 110, gutter: 5 },
					]}
					apiKey={process.env.GIPHY_API_KEY}
					onSelect={props.onEntrySelect}
					poweredByGiphyImage={props.darkMode ? '/img/giphy_white.png' : '/img/giphy_black.png'}
					/>
				}
			</span>
		</div>
	);
}
  
export default GifSelector;