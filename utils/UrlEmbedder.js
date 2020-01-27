import processString from 'react-process-string';
import Linkify from 'linkifyjs/react';
export default class UrlEmbedder {
	GIPHY_REGEX = /https?:\/\/(\?|media[0-9]{0,61}\.giphy\.com\/media\/([^ /\n]+)\/giphy\.gif|i\.giphy\.com\/([^ /\n]+)\.gif|giphy\.com\/gifs\/(?:.*-)?([^ /\n]+))/i
	YOUTUBE_REGEX = null

	format(str){
		if(!str) return;
		const self = this;
		// Giphy
		let config = [{
            regex: self.GIPHY_REGEX,
            fn: (key, result) => <img key={key} src={result[0]} alt="GIF from Giphy" title="GIF from Giphy" className="flex mw4" />
		}];
		str = processString(config)(str);
		return <Linkify>{str}</Linkify>;
	}
}