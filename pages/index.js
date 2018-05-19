import React, {Component, Fragment} from 'react'

import {createStore} from 'redux'

import Head from 'next/head'

import GuacButton from '../components/GuacButton'

import VideoPlayer from '../components/VideoPlayer'

import {connect} from 'react-redux';

import * as actions from '../actions';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';

class IndexPage extends Component {
	static async getInitialProps({store, isServer, pathname, query}) {
   		// we can dispatch from here too
		//store.dispatch({type: 'SET_FEATURED'});
		const { featured } = store.getState()
		if(!featured || !featured.data || featured.data.length == 0){
			await store.dispatch(actions.fetchFeatured());
		}
    }

    renderStream = stream => {
		const videoJsOptions = {
			autoplay: true,
			controls: true,
			plugins: {
				persistvolume: {
					namespace: 'guac-live'
				}
			},
			sources: [{
				src: stream.url,
				type: 'application/x-mpegURL'
			}]
		};

    	return (
    		<div key={stream.user.id}>
    			<a href={"/c/" + stream.user.name} className="link f4 b ma0">
    				<span className="i tracked blue">{stream.name}</span> is live
    			</a>
				<VideoPlayer { ...videoJsOptions }></VideoPlayer>
    		</div>
    	);
    }
    renderStreams = () => {
    	let streams = [];
    	if(this.props.featured.statusCode == 200 
			&& this.props.featured.data
			&& this.props.featured.data.length > 0){
    		streams = this.props.featured.data;
    	}
    	return streams.map(this.renderStream);
    }

	render() {
		console.log(this.props);
		if(!this.props.featured.data || this.props.featured.data.length == 0) {
			return (
				<Fragment>
					<h2 className='f2 tracked mb0'>Welcome to guac.live</h2>
					<p>no streams online</p>
					<GuacButton>nice button</GuacButton>
				</Fragment>
			);
		}
		return (
			<Fragment>
				<h2 className='f2 tracked mb0'>Welcome to guac.live</h2>
				<Slider
					autoplay={false}
					dots={true}
      				adaptiveHeight={true}
      				className="w-75 site-component-spotlight"
				>
				{this.renderStreams()}
				</Slider>
				<GuacButton>nice button</GuacButton>
			</Fragment>
		)
	}
}
export default connect(state => state)(IndexPage)