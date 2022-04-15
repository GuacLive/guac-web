var videojs = require("video.js").default;
import '@videojs/http-streaming';
import 'videojs-errors';

import {useCallback} from 'react';

import {useLingui} from '@lingui/react';

import io from 'socket.io-client';

import {useEffect,useState} from 'react';

import log from 'utils/log';

import { useDispatch } from 'react-redux';

if(typeof document !== 'undefined'){
	require('!style-loader!css-loader!video.js/dist/video-js.css')
}

import './ClipButton';
var playbackAPISocket;
const DEFAULT_OFFLINE_POSTER = '//cdn.guac.live/offline-banners/offline-banner.png';
const VIEWER_API_URL = process.env.VIEWER_API_URL;
function VideoPlayer(props) {
	const playerInitTime = Date.now();
	var videoNode;
	var player;
	const dispatch = useDispatch();
	const { i18n } = useLingui();
	const [connectedStatus, setConnectedStatus] = useState(false);

	var channel = props.streamInfo && props.streamInfo.username;

	const connectToPlaybackAPI = useCallback(() => {
		if(!props.live) return;
		if(!playbackAPISocket || !playbackAPISocket.connected){
			playbackAPISocket = io(`${VIEWER_API_URL}/playback`, {
				'timeout': 2000,
				'reconnection': true,
				'reconnectionDelay': 2000,
				'reconnectionDelayMax': 5000,
				'reconnectionAttempts': 5,
				'forceNew': true,
				'transports': ['websocket'],
				withCredentials: true
			});
			playbackAPISocket.on('connect', () => {
				log('info', 'PlaybackAPI', `connected to ${channel}`);
				if(!player.paused() && props.live){
					playbackAPISocket.emit('join', {
						name: channel
					});
				}
			});
			playbackAPISocket.on('viewerCount', (data) => {
				log('info', 'PlaybackAPI', `connected to ${channel}`);
				log('info', 'PlaybackAPI', `${data.channel} === ${channel}?`)
				if (!data || data.channel !== channel) return;
				dispatch({
					type: 'SET_CHANNEL_VIEWERS',
					viewers: data.viewers
				});
			});
			playbackAPISocket.on('disconnect', () => {
				log('info', 'PlaybackAPI', `left ${channel}`);
			});
			playbackAPISocket.on('reconnect', (attemptNumber) => {
				if (attemptNumber > 5) {
					console.log('We tried reconnecting for the 5th time, so disconnect.');
					playbackAPISocket.disconnect();
				} else {
					log('info', 'PlaybackAPI', 'reconnect');
				}
			});
		}
	}, [props.live, channel, dispatch]);

	useEffect(() => {
		const canAutoplay = require('can-autoplay').default;
		const videoJsOptions = {
			errorDisplay: false,
			liveui: props.live ? true : false,
			fluid: props.fill ? false : true,
			responsive: true,
			fill: props.fill ? true : false,
			language: i18n.locale || 'en',
			poster: `${props.banner ? props.banner : (!props.live ? DEFAULT_OFFLINE_POSTER : '')}?_player_js`,
			inactivityTimeout: 2000,
			suppressNotSupportedError: true,
			plugins: {
				chromecast: {
					appId: '9FCAFA48',
					addButtonToControlBar: false, // Defaults to true
				},
				persistvolume: {
					namespace: 'guac-live'
				},
				/*mux: {
					debug: false,
					data: {
						viewer_user_id: props.streamInfo.viewer_user_id,
						env_key: 'nttpf0l7a8eq71c8oqmhd5r3a', // required
						// Metadata
						player_name: 'guac.live player', // ex: 'My Main Player'
						player_version: process.env.npm_package_version,
						player_init_time: playerInitTime, // ex: 1451606400000
	
						// Video Metadata (cleared with 'videochange' event)
						video_id: props.streamInfo.username, // ex: 'abcd123'
						video_title: props.streamInfo.title, // ex: 'My Great Video'
						video_stream_type: props.streamInfo && props.streamInfo.isChannel ? 'live' : 'on-demand', // 'live' or 'on-demand'
						video_cdn: 'guac',
					},
				},*/
			},
			techOrder: ['chromecast', 'html5'],
			fullscreen: {
				enterOnRotate: true,
				alwaysInLandscapeMode: true,
				iOS: true
			},
			mpegtsConfig: {
				mediaDataSource: {
					isLive: true,
					cors: true,
					withCredentials: false
				},
				enableStashBuffer: false,
				stashInitialSize: 1024 * 64, // 64KB
				enableWorker: true,
				lazyLoad: false,
				liveBufferLatencyChasing: true,
				autoCleanupSourceBuffer: true,
				autoCleanupMaxBackwardDuration: 2,
				autoCleanupMinBackwardDuration: 1,
				seekType: 'range'
			  },
			  controlBar: {
				children: {
					  'playToggle': {},
					  'muteToggle': {},
					  'volumeControl': {},
					  'currentTimeDisplay' : props.replay ? true : false,
					  'timeDivider': props.replay ? true : false,
					  'durationDisplay': props.replay ? true : false,
					  'remainingTimeDisplay': props.replay ? true : false,
					  'liveDisplay': props.live ? {} : false,

					  'flexibleWidthSpacer': {},
					  'progressControl': {},
					  'pictureInPictureToggle': {},

					  'chromecastButton': {},
						
					  'ClipButton': props.live ? {} : false,
					  'TheaterModeToggle': {
						  elementToToggle: 'guac',
						  className: 'theater-mode'
					  },
					  'fullscreenToggle': {}
				}
			},
			...props
		};
		
		if(typeof window !== 'undefined'){
			videoJsOptions.html5 = {
				vhs: {
					withCredentials: false,
					experimentalBufferBasedABR: true,
					overrideNative: !videojs.browser.IS_SAFARI,
					allowSeeksWithinUnsafeLiveWindow: true,
					enableLowInitialPlaylist: true,
					smoothQualityChange: true,
					handlePartialData: true,
					handleManifestRedirects: true,
					experimentalLLHLS: true,
					maxPlaylistRetries: 5
				},
				nativeVideoTracks: true,
				nativeAudioTracks: true,
				nativeTextTracks: true
			};
			videojs.Vhs.xhr.beforeRequest = function (options) {
				console.log('XHR', options.uri);
				if(options.uri.includes('?archive=true')){
					options.uri = `${options.uri}&xhr=true`;
				}
				return options
			}
		}

		if(window){
			window.mpegts = require('mpegts.js');
			window.videojs = videojs;
			try{
				require(`video.js/dist/lang/${i18n.locale || 'en'}.js`);
			}catch(e){

			}
		}

		require('videojs-theater-mode/dist/videojs.theaterMode.js');
		require('../../videojs-mpegts.js');
		require('../../videojs-persistvolume.js');
		require('../../videojs-settings.js');
		require('@silvermine/videojs-quality-selector')(videojs);
		require('../../silvermine-videojs-chromecast')(videojs, { preloadWebComponents: true });
		require('videojs-hotkeys');
		require('../../public/videojs-landscape-fullscreen.min');
		// instantiate Video.js
		player = videojs(videoNode, videoJsOptions, function onPlayerReady() {
			log('info', 'VideoPlayer', 'onPlayerReady', this);
		});
			
		function mouseEnter() {
			/*player.cache_.inactivityTimeout = player.options_.inactivityTimeout;
			player.options_.inactivityTimeout = 0;*/
			if(!player.userActive()){
				player.userActive(true);
			}
		}
		function mouseLeave() {
			/*player.options_.inactivityTimeout = player.cache_.inactivityTimeout;*/
			if(player.userActive()){
				player.userActive(false);
			}
		}

		if(!props.noAutoPlay){
			canAutoplay.video().then((obj) => {
				if(obj.result === false){
					if(player && typeof player.muted === 'function'){
						try{
							player.muted(true);
						}catch(e){}
					}
				}
			});
		}

		// Hide theater mode and clip button if not on channel page
		if(!props.streamInfo || !props.streamInfo.isChannel){
			player.controlBar.removeChild('TheaterModeToggle');
			player.controlBar.removeChild('ClipButton');
		}

		// Reload if the source fails (HLS-only)
		if(player.reloadSourceOnError){
			player.reloadSourceOnError({
				errorInterval: 10
			});
		}

		// Settings
		if(player.settings){
			player.settings({
				version: process.env.npm_package_version,
				before: 'chromecastButton',
				popout: true,
				onPopout: () => {window.open(`/embed/${channel}` , '_blank');},
				report: true,
				onReport: () => {window.open(`/report/${channel}` , '_blank');}
			});
		}

		player.on('clip', () => {
			if(props.onClip) props.onClip.bind(this)();
		});
		//if(props.onClip) player.on('clip', props.onClip.bind(this));

		// Hotkeys
		if(player.hotkeys){
			player.hotkeys({
				volumeStep: 0.1,
				rewindKey: () => {
					return null;
				},
				forwardKey: () => {
					return null;
				},
				enableModifiersForNumbers: false,
				enableNumbers: false,
				enableHoverScroll: true
			});
		}

		if(props.live){
			let infoComponent = document && document.querySelector('.site-component-channel__info');
			// Prevent info bar autohide when cursor placed over it 
			if(infoComponent){
				infoComponent.addEventListener('mouseenter', mouseEnter);
				infoComponent.addEventListener('mouseleave', mouseLeave);
			}
			player.on('useractive', () => {
				if(infoComponent){
					infoComponent.classList.add('active');
				}
			});
			player.on('userinactive', () => {
				if(!player.paused() && infoComponent){
					infoComponent.classList.remove('active');
				}
			});
			player.on('pause', () => {
				if(infoComponent){
					infoComponent.classList.add('active');
				}
				if(playbackAPISocket) {
					if(playbackAPISocket.connected) {
						playbackAPISocket.emit('leave', {
							name: channel
						});
					}
				}
			})
			player.on('playing', () => {
				if(!player.userActive()){
					if(infoComponent){
						infoComponent.classList.remove('active');
					}
				}
				if(playbackAPISocket == undefined){
					connectToPlaybackAPI();
				}else if(!playbackAPISocket.connected){
					playbackAPISocket.connect();
				}
				playbackAPISocket.emit('join', {
					name: channel
				});
			});

			player.on('error', (e) => {
				if(playbackAPISocket){
					if(playbackAPISocket.connected){
						playbackAPISocket.emit('leave', {
							name: channel
						});
					}
				}
				if(e.code != 3){
					player.error(null);
					if(props.live){
						this.player.poster = videoJsOptions.poster;
						this.player.play();
					}
				}
			});

			player.on('theaterMode', function (elm, data){
				if(data.theaterModeIsOn){
					player.fill(true);
				}else{
					player.fill(false);
				}
			});
		}

		// Specify how to clean up after this effect:
		return function cleanup() {
			if(player){
				player.dispose();
			}
			let infoComponent = document && document.querySelector('.site-component-channel__info');
			if(infoComponent){
				infoComponent.removeEventListener('mouseenter', mouseEnter);
				infoComponent.removeEventListener('mouseleave', mouseLeave);
			}
			if(playbackAPISocket){
				playbackAPISocket.disconnect();
				playbackAPISocket.removeAllListeners();
				playbackAPISocket.off('connect');
				playbackAPISocket.off('disconnect');
				setConnectedStatus(false);
			}
		};
	  }, [channel, connectToPlaybackAPI, i18n.locale, videoNode]);

	// wrap the player in a div with a `data-vjs-player` attribute
	// so videojs won't create additional wrapper in the DOM
	// see https://github.com/videojs/video.js/pull/3856
	return (
		<>	
			<div className="player" data-vjs-player>
				<video
					ref={ node => videoNode = node }
					id="streamplayer"
					crossOrigin="anonymous"
					className={`player-video video-js vjs-default-skin vjs-big-play-centered ${props.fill ? 'vjs-fill' : 'vjs-16-9'}`} 
					poster={`${props.banner ? props.banner : (!props.live ? DEFAULT_OFFLINE_POSTER : '')}?_poster`}
					controls
					playsInline
					preload="auto"
					autoPlay={!props.noAutoPlay}
					style={{'width': '100%'}}
				></video>
			</div>
		</>
	);
}

export default VideoPlayer;