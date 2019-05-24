const videojs = require('video.js').default;
import '@videojs/http-streaming';
import 'video.js/dist/video-js.css';
import '@silvermine/videojs-chromecast/dist/silvermine-videojs-chromecast.css';
import '@dlive/videojs-resolution-switcher/lib/videojs-resolution-switcher.css';
import 'videojs-overlay/dist/videojs-overlay.js';
import 'videojs-overlay/dist/videojs-overlay.css';

import {connect} from 'react-redux';

import {selectFeatureFlag} from '@flopflip/react-redux';

class VideoPlayer extends React.Component {
	componentDidMount() {
		const canAutoplay = require('can-autoplay').default;
		const videoJsOptions = {
			liveui: false,
			poster: '/static/img/offline-poster.png',
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
				autoCleanupSourceBuffer: true
  			},
			...this.props
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
		require('@dlive/videojs-resolution-switcher');
		// instantiate Video.js
		this.player = videojs(this.videoNode, videoJsOptions, function onPlayerReady() {
			console.log('onPlayerReady', this)
		});
		
        canAutoplay.video().then((obj) => {
            if (obj.result === false) {
                this.player.muted(true);
            }
        });

		this.player.chromecast();
		if(this.props.streamInfo && this.props.isFeatureOn){
			this.player.overlay({
				overlays: [{
					align: 'top',
					content: this.props.streamInfo.username,
					start: 'loadedmetadata',
					end: 'play'
				}]
			});
		}
	}

	// destroy player on unmount
	componentWillUnmount() {
		if(this.player){
			this.player.dispose()
		}
	}

	// wrap the player in a div with a `data-vjs-player` attribute
	// so videojs won't create additional wrapper in the DOM
	// see https://github.com/videojs/video.js/pull/3856
	render() {
		return (
		<div>	
			<div data-vjs-player>
				<video ref={ node => this.videoNode = node } className="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" poster="/static/img/offline-poster.png" controls playsInline preload="auto"></video>
			</div>
		</div>
		)
	}
}
const mapStateToProps = state => ({
  isFeatureOn: selectFeatureFlag('streamOverlay')(state),
});

export default connect(mapStateToProps)(VideoPlayer);
