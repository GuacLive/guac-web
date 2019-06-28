import fetch from 'cross-fetch';

export const fetchEmotes = () => async (dispatch) => {
	let result = [];
	await fetch('/static/emotes/global.json')
	.then(async response => {
		const data = await response.json();
		for(const emote of Object.values(data)){
			result[emote.code] = {
				provider: 'Global',
				url: `/static/emotes/global/${emote.id}.png`,
			};
		}
	})
	.catch(() => {});

	await fetch('/static/emotes/twitch.json')
	.then(async response => {
		const data = await response.json();
		for(const emote of Object.values(data)){
			result[emote.code] = {
				provider: 'Twitch',
				url: `//static-cdn.jtvnw.net/emoticons/v1/${emote.id}/1.0`,
			};
		}
	})
	.catch(() => {});

	await fetch('//api.betterttv.net/2/emotes')
	.then(async response => {
		const data = await response.json();

		for(const emote of data.emotes){
			result[emote.code] = {
				provider: 'BetterTTV',
				url: `//cdn.betterttv.net/emote/${emote.id}/1x`,
			};
		}
	})
	.catch(() => {});

	await fetch('https://api.frankerfacez.com/v1/set/global')
	.then(async response => {
		const data = await response.json();

		for(const set of Object.values(data.sets)){
			for(const emote of set.emoticons){
				result[emote.name] = {
					provider: 'FrankerfaceZ',
					url: `${emote.urls['1']}`,
				};
			}
		}
	})
	.catch(() => {});

	//twitchemotes.com/api_cache/v3/global.json
	dispatch({
		type: 'FETCH_EMOTES_SUCCESS',
		data: result
   });
};