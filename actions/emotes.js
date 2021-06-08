export const fetchEmotes = (channel) => async (dispatch) => {
	let result = [];
	await fetch('//emotes.guac.live/index.json')
	.then(async response => {
		const data = await response.json();
		
		for(const emoteList of Object.values(data)){
			if(emoteList && (emoteList.default || emoteList.directory === channel)){
				await fetch(`//emotes.guac.live/${emoteList.directory}/index.json`)
				.then(async response => {
					const data = await response.json();
					for(const emote of Object.values(data)){
						let url = emoteList.directory !== 'twitch' ? `//emotes.guac.live/${emoteList.directory}/${emote.id}.${emote.animated ? 'gif': 'png'}` : `//static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/3.0`
						result[emote.code] = {
							provider: emoteList.name,
							url,
						};
					}
				})
				.catch(() => {});
			}
		}
	})
	.catch(() => {});

	await fetch('//api.betterttv.net/3/cached/users/twitch/7427594')
	.then(async response => {
		const data = await response.json();
		const e = Object.assign(data.channelEmotes, data.sharedEmotes);
		for(const emote of e){
			result[emote.code] = {
				provider: 'BetterTTV',
				url: `//cdn.betterttv.net/emote/${emote.id}/3x`,
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

	await fetch('https://api2.frankerfacez.com/v1/room/datagutt')
	.then(async response => {
		const data = await response.json();

		for(const set of Object.values(data.sets)){
			for(const emote of set.emoticons){
				result[emote.name] = {
					provider: 'FrankerfaceZ',
					url: `${emote.urls['2'] || emote.urls['1']}`,
				};
			}
		}
	})
	.catch(() => {});
	
	await fetch('https://api2.frankerfacez.com/v1/set/global')
	.then(async response => {
		const data = await response.json();

		for(const set of Object.values(data.sets)){
			for(const emote of set.emoticons){
				result[emote.name] = {
					provider: 'FrankerfaceZ',
					url: `${emote.urls['2'] || emote.urls['1']}`,
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