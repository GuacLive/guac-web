import React, {Component, Fragment} from 'react';

import { ToggleFeature } from '@flopflip/react-redux';

import GuacButton from '../components/GuacButton'

import VideoPlayer from '../components/VideoPlayer'

import {connect} from 'react-redux';

import * as actions from '../actions';

import initialize from '../utils/initialize';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';

const STREAMING_SERVER = 'eu';
class IndexPage extends Component {
	static async getInitialProps({store, isServer, pathname, query, req}){
		// we can dispatch from here too
		//store.dispatch({type: 'SET_FEATURED'});
		initialize({store, isServer, pathname, query, req});
		const { featured } = store.getState()
		if(featured.loading){
			await store.dispatch(actions.fetchFeatured());
		}
    }

    renderStream = stream => {
		let videoJsOptions = {
			autoplay: true,
			controls: true,
			sources: []
		};

		if(stream.live){
			if(stream.urls){
				if(stream.urls.flv){
					videoJsOptions.sources.push({
						src: stream.servers[STREAMING_SERVER] + stream.urls.flv,
						type: 'video/x-flv',
						label: STREAMING_SERVER + `(FLV)`
					});
				}
				Object.keys(stream.qualities).forEach((key) => {
					let urlKey = stream.qualities[key];
					videoJsOptions.sources.push({
						src: stream.servers[STREAMING_SERVER] + `/live/${stream.user.name}${urlKey}/index.m3u8`,
						type: 'application/x-mpegURL',
						label: STREAMING_SERVER + `(${key})`
					});
				});
				/*if(stream.urls.hls){
					videoJsOptions.sources.push({
						src: stream.servers[STREAMING_SERVER] + stream.urls.hls,
						type: 'application/x-mpegURL'
					});
				}*/
			}
		}

    	return (
    		<div key={stream.user.id}>
    			<a href={"/c/" + stream.user.name} className="link f4 b ma0">
    				<span className="i tracked b">{stream.name}</span> is live
    			</a>
				<VideoPlayer { ...videoJsOptions }></VideoPlayer>
    		</div>
    	);
    }
    
    renderStreams = () => {
    	if(this.props.featured.statusCode == 200 
			&& this.props.featured.data
			&& this.props.featured.data.length > 0){
    		 return this.props.featured.data.map(this.renderStream);
    	}
    	return (
    		<p>no streams are online</p>
    	);
    }

	render() {
		return (
			<Fragment>
				<div className="site-component-spotlight w-100 center bg-light-green black">
					<h3 className="f4 b ma0 ttu tracked">Live streams</h3>
					<Slider
						autoplay={false}
						dots={true}
	      		adaptiveHeight={true}
	      		className="w-100"
					>
					{this.renderStreams()}
					</Slider>
				</div>
				<ToggleFeature
					flag='guacWelcome'
				>
					<section className="ph3 ph5-ns pv5">
						<article className="mw8 center br2 ba b--transparent">
							<div className="dt-ns dt--fixed-ns w-100">
								<div className="pa3 pa4-ns dtc-ns v-mid">
									<div>
										<h2 className="f2 tracked mt0 mb3">Welcome to guac.live</h2>
										<p className="measure lh-copy mv0">
										hello
										</p>
									</div>
								</div>
								<div className="pa3 pa4-ns dtc-ns v-mid">
									<GuacButton color="light-green">Join</GuacButton>
								</div>
							</div>
						</article>
					</section>
				</ToggleFeature>
			</Fragment>
		)
	}
}
export default connect(state => state)(IndexPage)