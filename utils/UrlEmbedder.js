
import linkifyHtml from 'linkifyjs/html';
export default class UrlEmbedder {
	GIPHY_REGEX = /https?:\/\/(\?|media[0-9]{0,61}\.giphy\.com\/media\/([^ /\n]+)\/giphy\.gif|i\.giphy\.com\/([^ /\n]+)\.gif|giphy\.com\/gifs\/(?:.*-)?([^ /\n]+))/i
	YOUTUBE_REGEX = null

	format(str){
		if(!str) return;
		const self = this;
		// Giphy
		str = str.replace(self.GIPHY_REGEX, (url) => {
			if(url){
				return `<img src="${url}" alt="GIF from Giphy" title="GIF from Giphy" class="flex mw4" />`;
			}
			return url;
		});
		console.log(str);
		// Linkify the rest of urls
		if(!str.match(self.GIPHY_REGEX)){
			str = linkifyHtml(str);
		}
		return str;
	}
}