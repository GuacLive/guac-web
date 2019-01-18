import React, {Component, Fragment} from 'react'

import {createStore} from 'redux'

import Head from 'next/head'

import GuacButton from '../components/GuacButton'

import VideoPlayer from '../components/VideoPlayer'

import {connect} from 'react-redux';

import * as actions from '../actions';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';

const STREAMING_SERVER = 'eu';
class IndexPage extends Component {
	static async getInitialProps({store, isServer, pathname, query}) {
   		// we can dispatch from here too
		//store.dispatch({type: 'SET_FEATURED'});
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

		if(stream.live && stream.urls){
			if(stream.urls.hls){
				videoJsOptions.sources.push({
					src: stream.servers[STREAMING_SERVER] + stream.urls.hls,
					type: 'application/x-mpegURL'
				});
			}
			if(stream.urls.flv){
				videoJsOptions.sources.push({
					src: stream.servers[STREAMING_SERVER] + stream.urls.flv,
					type: 'video/x-flv'
				});
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
		console.log(this.props);
		return (
			<Fragment>
				<div className="site-component-spotlight w-100 center bg-light-green">
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
				<h2 className="f2 tracked mb0">Welcome to guac.live</h2>
				<GuacButton color="light-green">nice button</GuacButton>
			</Fragment>
		)
	}
}
export default connect(state => state)(IndexPage)