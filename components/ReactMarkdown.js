import marked from 'marked';
function renderMarkdown(data) {
	const renderer = new marked.Renderer();
	const linkRenderer = renderer.link;
	const imgRenderer = renderer.image;
	renderer.link = (href, title, text) => {
		const html = linkRenderer.call(renderer, href, title, text);
		return html.replace(/^<a /, '<a target="_blank" rel="ugc" ');
	};
	const domainRe = /https?:\/\/((?:[\w\d-]+\.)+[\w\d]{2,})/i;
	const approvedDomains = [
		'guac.live',
		'emotes.guac.live',
		'cdn.guac.live',
		'imgur.com',
		'i.imgur.com',
		'i.stack.imgur.com',
	];
	renderer.image = (href, title, text) => {
		const getDomain = (domain) => {
			return domainRe.exec(domain)[1];
		};
		if(approvedDomains.includes(getDomain(href))){
			return imgRenderer.call(renderer, href, title, text);
		}
		return linkRenderer.call(renderer, href, title, text) + ` <span class='dib v-top'>(image)</span>`;
	};
	return marked(data, {renderer: renderer, sanitize: true, breaks: true});
}

export default function ReactMarkdown(props){
	if(!props || !props.source) return null;
	const compiled = renderMarkdown(props.source);
	return <div {...props} dangerouslySetInnerHTML={{__html: compiled}} />;
}