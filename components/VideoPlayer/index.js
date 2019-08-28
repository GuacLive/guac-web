const videojs = require('video.js').default;
import '@videojs/http-streaming';
import 'video.js/dist/video-js.css';
import '@silvermine/videojs-chromecast/dist/silvermine-videojs-chromecast.css';
import 'videojs-resolution-switcher/lib/videojs-resolution-switcher.css';
import 'videojs-overlay/dist/videojs-overlay.js';
import 'videojs-overlay/dist/videojs-overlay.css';
import 'videojs-resolution-switcher'
import {useFeatureToggle} from '@flopflip/react-broadcast';

import {useEffect} from 'react';

import log from '../../utils/log';

function VideoPlayer(props) {
	let player;
	let videoNode;
	const isFeatureEnabled = useFeatureToggle('streamOverlay');
	useEffect(() => {
		const canAutoplay = require('can-autoplay').default;
		const videoJsOptions = {
			liveui: false,
			poster: !props.live ? '/static/img/offline-poster.png' : '',
			plugins: {
				videoJsResolutionSwitcher: {
					default: 'high',
					dynamicLabel: true
				},
				persistvolume: {
					namespace: 'guac-live'
				}
			},
			techOrder: ['flvjs', 'html5'],
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
			...props
		};
		
		if(window && typeof window.MediaSource === 'undefined'){
			videoJsOptions.html5 = {
				hls: {
					overrideNative: false
				},
				nativeVideoTracks: true,
				nativeAudioTracks: true,
				nativeTextTracks: true
			};
		}

		if(window) window.flvjs = require('flv.js').default;
		if(window) window.videojs = videojs;
		require('../../videojs-flvjs.js');
		require('../../videojs-persistvolume.js');
		require('@silvermine/videojs-chromecast')(videojs, {
			reloadWebComponents: true
		});
		// instantiate Video.js
		player = videojs(videoNode, videoJsOptions, function onPlayerReady() {
			log('info', null, 'onPlayerReady', this);
		});
		
        canAutoplay.video().then((obj) => {
            if (obj.result === false) {
                player.muted(true);
            }
        });

		player.chromecast();
		if(props.streamInfo && isFeatureEnabled){
			player.overlay({
				overlays: [{
					align: 'top',
					content: props.streamInfo.username,
					start: 'loadedmetadata',
					end: 'play'
				}]
			});
		}
		// Specify how to clean up after this effect:
		return function cleanup() {
			if(player){
				player.dispose();
			}
		};
	  }, []);
	


	// wrap the player in a div with a `data-vjs-player` attribute
	// so videojs won't create additional wrapper in the DOM
	// see https://github.com/videojs/video.js/pull/3856
	return (
		<>	
			<div className="player" data-vjs-player>
				<video ref={ node => videoNode = node } className="player-video video-js vjs-default-skin vjs-big-play-centered vjs-16-9" poster={!props.live ? "/static/img/offline-poster.png" : ""} controls playsInline preload="auto"></video>
			</div>
		</>
	);
}

export default VideoPlayer;