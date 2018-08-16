import videojs from 'video.js'
import '@videojs/http-streaming'
import 'video.js/dist/video-js.css'
import '@silvermine/videojs-chromecast/dist/silvermine-videojs-chromecast.css'

export default class VideoPlayer extends React.Component {
	componentDidMount() {
		require('@silvermine/videojs-chromecast')(videojs, {
			reloadWebComponents: true
		});
		//require('videojs-persistvolume');
		// instantiate Video.js
		this.player = videojs(this.videoNode, {
			plugins: {
				//persistvolume: {
				//	namespace: 'guac-live'
				//}
			},
			...this.props
		}, function onPlayerReady() {
			console.log('onPlayerReady', this)
		});
		this.player.chromecast();
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
				<video ref={ node => this.videoNode = node } className="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" controls playsInline preload="auto"></video>
			</div>
		</div>
		)
	}
}