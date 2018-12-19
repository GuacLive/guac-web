import React, {Component, Fragment} from 'react'

import {createStore} from 'redux'

import Head from 'next/head'

import GuacButton from '../components/GuacButton'

import VideoPlayer from '../components/VideoPlayer'

import {connect} from 'react-redux';

import * as actions from '../actions';

class ChannelPage extends Component {
	static async getInitialProps({store, isServer, pathname, query}) {
		const { channel } = store.getState()
		console.log(query.name);
		if(channel.loading){
			await store.dispatch(actions.fetchChannel(query.name));
		}
    }

    renderStream = stream => {
		let videoJsOptions = {
			autoplay: true,
			controls: true,
			sources: []
		};

		if(stream.live && stream.url){
			videoJsOptions.sources.push({
				src: stream.url,
				type: 'application/x-mpegURL'
			})
		}

    	return (
    		<div key={stream.user.id}>
				<div className="site-component-channel__info dib w-100 bg-light-green">
					<h2 className='f2 tracked mb0 dib'>
					{stream.user.name}{stream.category ? ' is playing '+stream.category : ''}
					</h2>
					<GuacButton color="white">Follow</GuacButton>
					<GuacButton color="green">Subscribe</GuacButton>
				</div>
				<div className="site-component-channel__player">
					<VideoPlayer { ...videoJsOptions }></VideoPlayer>
				</div>
    		</div>
    	);
    }

	render() {
		const {
			channel
		} = this.props;
		console.log(this.props);
		if(channel.loading) return (<p>Loading...</p>);
		if(channel.error) throw channel.error;
		if(!channel.data || channel.data.length === 0) return (<p>Channel not found</p>);
		return (
			<div className="w-100 flex flex-row">
				<div className="site-component-channel w-100 w-80-l">
				{this.renderStream(channel.data)}
				</div>
				<aside className="site-component-chat w-100 w-20-l">
				this is chat
				</aside>
			</div>
		)
	}
}
export default connect(state => state)(ChannelPage)