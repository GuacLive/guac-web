import processString from 'react-process-string';
import Linkify from 'linkifyjs/react';
function htmlDecode(input){
	var doc = new DOMParser().parseFromString(input, "text/html");
	return doc.documentElement.textContent;
}
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
		// This will decode <3 and various other variants (that are server-side escaped)
		// This should NOT cause code execution, since React will escape it anyways
		try{
			str = htmlDecode(str);
		}catch(e){}
		// Process giphy regex and replace with JSX img element
		str = processString(config)(str);
		return <Linkify>{str}</Linkify>;
	}
}