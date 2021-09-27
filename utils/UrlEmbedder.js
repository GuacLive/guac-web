import processString from 'react-process-string';
import Linkify from 'linkify-react';

import {
	Tooltip
} from 'react-tippy';

function htmlDecode(input) {
	try {
		var doc = new DOMParser().parseFromString(input, 'text/html');
		return doc.documentElement.textContent;
	} catch (e) {
		return input;
	}
}

export default class UrlEmbedder {
	GIPHY_REGEX = /https?:\/\/(\?|media[0-9]{0,61}\.giphy\.com\/media\/([^ /\n]+)\/giphy\.gif|i\.giphy\.com\/([^ /\n]+)\.gif|giphy\.com\/gifs\/(?:.*-)?([^ /\n]+))/i
	YOUTUBE_REGEX = /(https?:\/\/)?(www.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/watch\?feature=player_embedded&v=)([A-Za-z0-9_-]*)(&\S+)?(\?\S+)?/

	constructor(username = '') {
		this.username = username;
	}

	resolveYoutubeUrl(videoId) {
		return videoId && videoId.length > 3 ?
			`https://www.youtube.com/embed/${videoId[4]}?autoplay=0&loop=0&controls=2&rel=0` :
			''
	}

	resolveYoutubeThumbnail(videoId) {
		return videoId && videoId.length > 3 ?
			`https://img.youtube.com/vi/${videoId[4]}/hqdefault.jpg` :
			''
	}

	format(str) {
		if (!str) return;
		const self = this;
		const USER_REGEX = new RegExp(`@${this.username}\\b`, 'gi');
		// Giphy
		let config = [{
			regex: self.GIPHY_REGEX,
			fn: (key, result) => {
				return (
					<Tooltip
						// options
						title={`GIF from Giphy`}
						position="top"
						trigger="mouseenter"
						className="mw5 mt1"
						style={{display: 'flex !important'}}
					>
						<img key={key} src={result[0]} alt="GIF from Giphy" className="flex mw5" />
					</Tooltip>
				);
			}
		},
		{
			regex: self.YOUTUBE_REGEX,
			fn: (key, result) => {
				return (
					<div className="aspect-ratio aspect-ratio--16x9 mt1" key={key}>
						<iframe src={this.resolveYoutubeUrl(result)} className="aspect-ratio--object" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen={true}></iframe>
					</div>
				);
			}
		},
		{
			regex: USER_REGEX,
			fn: (key, result) => <span key={key} className="b green highlight">{result[0]}</span>
		}
		];
		// This will decode <3 and various other variants (that are server-side escaped)
		// This should NOT cause code execution, since React will escape it anyways
		try {
			str = htmlDecode(str);
		} catch (e) { }
		// Process giphy regex and replace with JSX img element
		str = processString(config)(str);
		return <Linkify
			options={{
				className: 'linkify',
				target: (href, type) => type === 'url' && '_blank'
			}}
			key={'linkify' + (new Date).getTime() + (Math.random() * 1000)}
		>{str}
		</Linkify>;
	}
}