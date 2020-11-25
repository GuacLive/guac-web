import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';

import { fetchChannel } from 'actions';

import log from 'utils/log';

const VIEWER_API_URL = process.env.VIEWER_API_URL;
export default function useChannelSocket(channel){
	const [channelAPISocket, setChannelAPISocket] = useState(null);
	const dispatch = useDispatch();
	useEffect(() => {
		let didCancel = false;

		if(!didCancel){
			log('info', 'Channel', 'Socket', `Connecting`);
			setChannelAPISocket(io(`${VIEWER_API_URL}/channel`));
		}
		return function cleanup() {
			didCancel = true;
			setChannelAPISocket(null);
		};
	}, []);
	useEffect(() => {
		let didCancel = false;

		if(!didCancel){
			if(channelAPISocket){
				channelAPISocket.on('connect', () => {
					if(!channel || !channel.data || !channel.data.name) return;
					log('info', 'Channel', 'Socket', `Joining ${channel.data.name}`);
					channelAPISocket.emit('join', {
						name: channel.data.name
					});
				});
				channelAPISocket.on('disconnect', () => {
					if(!channel || !channel.data || !channel.data.name) return;
					log('info', 'Channel', 'Socket', `Leaving ${channel.data.name}`);
					channelAPISocket.emit('leave', {
						name: channel.data.name
					});
				});
				channelAPISocket.on('reload', () => {
					log('info', 'Channel', 'Socket', `Asked to reload page`);
					window.location.reload();
				});
				channelAPISocket.on('redirect', (url) => {
					log('info', 'Channel', 'Socket', `Asked to redirect to ${url}`);
					window.location = url;
				});
				channelAPISocket.on('live', (liveBoolean) => {
					log('info', 'Channel', 'Socket', `${channel.data.name} going ${liveBoolean ? 'live': 'offline'}`);
					setTimeout(async () => {
						try {
							log('info', 'Channel', 'Socket', `Refetching ${channel.data.name}`);
							dispatch(fetchChannel(channel.data.name));
							// If no longer live, go out of theater mode
							if(!liveBoolean){
								document.documentElement.classList.remove('theater-mode');
							}
						}catch(e){}
					}, Math.floor(Math.random() * (4000 - 2500 + 1) + 2500));
				});
			}
		}
		return function cleanup() {
			didCancel = true;
			if(channelAPISocket){
				log('info', 'Channel', 'Socket', `Disconnecting`);
				channelAPISocket.disconnect();
				channelAPISocket.removeAllListeners();
				channelAPISocket.off('connect');
				channelAPISocket.off('disconnect');
			}
		};
	}, [channelAPISocket]);
	return channelAPISocket;
}