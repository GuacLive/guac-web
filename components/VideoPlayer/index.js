const videojs = require('video.js').default;
import '@videojs/http-streaming';
import 'videojs-errors';

import {useLingui} from '@lingui/react';

import io from 'socket.io-client';

import {useEffect,useState} from 'react';

import log from '../../utils/log';

import { useDispatch } from 'react-redux';

const OFFLINE_POSTER = '/img/offline-poster.png';
const VIEWER_API_URL = process.env.VIEWER_API_URL;
var didCancel = false;
var playbackAPISocket;
function VideoPlayer(props) {
	const playerInitTime = Date.now();
	let player;
	let videoNode;
	const dispatch = useDispatch();
	const { i18n } = useLingui();
	const [connectedStatus, setConnectedStatus] = useState(false);

	var channel = props.streamInfo && props.streamInfo.username;
	
	function connectToPlaybackAPI() {
		if(!didCancel){
			playbackAPISocket = io(`${VIEWER_API_URL}/playback`, {
				'transports': ['websocket'],
				/*'reconnection': true,
				'reconnectionDelay': 1000,
				'reconnectionDelayMax': 5000,
				'reconnectionAttempts': 5,
				'forceNew': true*/
			});
			playbackAPISocket.on('connect', () => {
				log('info', 'PlaybackAPI', `connected to ${channel}`);
				setConnectedStatus(true);
			});
			playbackAPISocket.on('viewerCount', (data) => {
				log('info', 'PlaybackAPI', `connected to ${channel}`);
				if(!data || data.channel !== channel) return;
				dispatch({
					type: 'SET_CHANNEL_VIEWERS',
					viewers: data.viewers
				});
			});
			playbackAPISocket.on('disconnect', () => {
				log('info', 'PlaybackAPI', `left ${channel}`);
				setConnectedStatus(false);
			});
			playbackAPISocket.on('reconnect', () => {
				log('info', 'PlaybackAPI', 'reconnect');
				setConnectedStatus(true);
			});
		}
	};
	console.log('aaa', props);

	useEffect(() => {
		const canAutoplay = require('can-autoplay').default;
		const videoJsOptions = {
			errorDisplay: false,
			liveui: true,
			fluid: true,
			responsive: true,
			fill: props.fill,
			language: i18n.locale || 'en',
			poster: !props.live ? OFFLINE_POSTER : '',
			inactivityTimeout: 1000,
			suppressNotSupportedError: true,
			plugins: {
				chromecast: {
					appId: '50E3A992',
					addButtonToControlBar: false, // Defaults to true
				},
				persistvolume: {
					namespace: 'guac-live'
				}
			},
			techOrder: ['chromecast', 'flvjs', 'html5'],
			flvjs: {
				mediaDataSource: {
					isLive: true,
					cors: true,
					withCredentials: false
				},
				enableStashBuffer: false,
				stashInitialSize: 1024 * 64, // 64KB
				enableWorker: true,
				lazyLoad: false,
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
					  'currentTimeDisplay' : false,
					  'timeDivider': false,
					  'durationDisplay': false,
					  'remainingTimeDisplay': false,
					  'liveDisplay': {},

					  'flexibleWidthSpacer': {},
					  'progressControl': {},
					  'pictureInPictureToggle': {},

					  'chromecastButton': {},
					  'QualitySelector': {},

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
					overrideNative: !videojs.browser.IS_SAFARI,
					allowSeeksWithinUnsafeLiveWindow: true,
					enableLowInitialPlaylist: true,
					smoothQualityChange: true,
					handlePartialData: true,	
					liveSyncDurationCount: 1,
					liveMaxLatencyDurationCount: 6,
					maxBufferSize: 10*1000*1000,
					liveBackBufferLength: 0		  
				},
				nativeVideoTracks: true,
				nativeAudioTracks: true,
				nativeTextTracks: true
			};
		}

		if(window){
			window.flvjs = require('@guaclive/flv.js').default;
			window.videojs = videojs;
			try{
				require(`video.js/dist/lang/${i18n.locale || 'en'}.js`);
			}catch(e){

			}
		}

		require('videojs-theater-mode/dist/videojs.theaterMode.js');
		require('../../videojs-flvjs.js');
		require('../../videojs-persistvolume.js');
		require('@silvermine/videojs-chromecast')(videojs, {
			reloadWebComponents: true
		});
		require('@silvermine/videojs-quality-selector')(videojs, {
			reloadWebComponents: true
		});
		require('videojs-hotkeys');
		// instantiate Video.js
		player = videojs(videoNode, videoJsOptions, function onPlayerReady() {
			log('info', 'VideoPlayer', 'onPlayerReady', this);
		});
		
        canAutoplay.video().then((obj) => {
            if(obj.result === false){
                if(player && typeof player.muted === 'function'){
					player.muted(true);
				}
            }
		});

		// Hide theater mode if not on channel page
		if(!props.streamInfo || !props.streamInfo.isChannel){
			player.controlBar.removeChild('TheaterModeToggle');
		}

		// Reload if the source fails (HLS-only)
		if(player.reloadSourceOnError){
			player.reloadSourceOnError({
				errorInterval: 10
			});
		}

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

		player.on('pause', () => {
			if(playbackAPISocket) {
				if(playbackAPISocket.connected) {
					playbackAPISocket.disconnect();
				}
			}
		})
		player.on('playing', () => {
			if(playbackAPISocket == undefined){
				connectToPlaybackAPI();
			}else if(!playbackAPISocket.connected){
				playbackAPISocket.connect();
			}
		});

		player.on('error', (e) => {
			if(playbackAPISocket){
				if(playbackAPISocket.connected){
					playbackAPISocket.disconnect();
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

		// If browser is Android, automatically go fullscreen on play tap
		if(player.bigPlayButton && player.bigPlayButton.one){
			player.bigPlayButton.one('tap', function () {
				if(videojs.browser.IS_ANDROID){
					try{
						player.requestFullscreen();
					}catch(e){}
				}
			});
		}

		// Specify how to clean up after this effect:
		return function cleanup() {
			didCancel = true;
			if(player){
				player.dispose();
			}
			if(playbackAPISocket){
				playbackAPISocket.emit('disconnect');
				playbackAPISocket.removeAllListeners();
				playbackAPISocket.off('connect');
				playbackAPISocket.off('disconnect');
				playbackAPISocket.disconnect();
			}
		};
	  }, []);
	
	
	  useEffect(function joinOrLeavePlayback() {
		console.log('useEffect', connectedStatus, channel, playbackAPISocket);
		if(playbackAPISocket){
			console.log('inside playbackAPISocket');
			if(connectedStatus){
				playbackAPISocket.emit('join', {
					name: channel
				});
			}else{
				playbackAPISocket.emit('leave', {
					name: channel
				});
			}
		}
	}.bind(this), [connectedStatus]);


	// wrap the player in a div with a `data-vjs-player` attribute
	// so videojs won't create additional wrapper in the DOM
	// see https://github.com/videojs/video.js/pull/3856
	return (
		<>	
			<div className="player" data-vjs-player>
				<video
					ref={ node => videoNode = node }
					className={`player-video video-js vjs-default-skin vjs-big-play-centered ${props.fill ? 'vjs-fill' : 'vjs-16-9'}`} poster={!props.live ? "/img/offline-poster.png" : ""}
					controls
					playsInline
					preload="auto"
				></video>
			</div>
		</>
	);
}

export default VideoPlayer;