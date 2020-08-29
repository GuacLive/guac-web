import processString from 'react-process-string';
import Linkify from 'linkifyjs/react';
function htmlDecode(input){
	var doc = new DOMParser().parseFromString(input, "text/html");
	return doc.documentElement.textContent;
}
export default class UrlEmbedder {
	GIPHY_REGEX = /https?:\/\/(\?|media[0-9]{0,61}\.giphy\.com\/media\/([^ /\n]+)\/giphy\.gif|i\.giphy\.com\/([^ /\n]+)\.gif|giphy\.com\/gifs\/(?:.*-)?([^ /\n]+))/i
	YOUTUBE_REGEX = /(https?:\/\/)?(www.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/watch\?feature=player_embedded&v=)([A-Za-z0-9_-]*)(&\S+)?(\?\S+)?/

	constructor(username = ''){
		this.username = username;
	}

    resolveYoutubeUrl(url) {
        const videoId = YOUTUBE_REGEX.exec(url);

        return videoId && videoId.length > 1 ?
            `https://www.youtube.com/embed/${videoId[1]}?autoplay=1&loop=1&controls=2&rel=0` :
            `${url}?autoplay=1&loop=1&controls=2&rel=0`
    }

    resolveYoutubeThumbnail(url) {
        const videoId = YOUTUBE_REGEX.exec(url);

        return videoId ? `https://img.youtube.com/vi/${videoId[1]}/hqdefault.jpg` : '';
	}

	format(str){
		if(!str) return;
		const self = this;
		const USER_REGEX = new RegExp(`@${this.username}\\b`, 'gi');
		// Giphy
		let config = [{
            regex: self.GIPHY_REGEX,
            fn: (key, result) => <img key={key} src={result[0]} alt="GIF from Giphy" title="GIF from Giphy" className="flex mw5 mt1" />
		},
		{
            regex: USER_REGEX,
            fn: (key, result) => <span key={key} className="b green highlight">{result[0]}</span>
		}
		];
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