import fetch from 'cross-fetch';

export const fetchEmotes = () => async (dispatch) => {
	let result = [];
	await fetch('/emotes/global.json')
	.then(async response => {
		const data = await response.json();
		for(const emote of Object.values(data)){
			result[emote.code] = {
				provider: 'Global',
				url: `/emotes/global/${emote.id}.png`,
			};
		}
	})
	.catch(() => {});

	await fetch('/emotes/twitch.json')
	.then(async response => {
		const data = await response.json();
		for(const emote of Object.values(data)){
			result[emote.code] = {
				provider: 'Twitch',
				url: `//static-cdn.jtvnw.net/emoticons/v1/${emote.id}/3.0`,
			};
		}
	})
	.catch(() => {});

	await fetch('//api.betterttv.net/3/cached/emotes/global')
	.then(async response => {
		const data = await response.json();

		for(const emote of data){
			result[emote.code] = {
				provider: 'BetterTTV',
				url: `//cdn.betterttv.net/emote/${emote.id}/3x`,
			};
		}
	})
	.catch(() => {});

	await fetch('https://api-test.frankerfacez.com/v1/set/global')
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