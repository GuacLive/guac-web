import React, {Component, Fragment} from 'react'

import {createStore} from 'redux'

import Head from 'next/head'

import Chat from '../components/Chat'

import GuacButton from '../components/GuacButton'

import VideoPlayer from '../components/VideoPlayer'

import {connect} from 'react-redux';

import * as actions from '../actions';

import initialize from '../utils/initialize';

const STREAMING_SERVER = 'eu';
class ChannelPage extends Component {
	static async getInitialProps({store, isServer, pathname, query, req}){
		initialize({store, isServer, pathname, query, req});
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
		if(!channel.data) return (<p>Channel not found</p>);
		return (
			<div className="w-100 flex flex-row">
				<div className="site-component-channel w-100" style={{flex: 3}}>
				{this.renderStream(channel.data)}
				</div>
				<aside className="site-component-chat w-100 w-20-l" style={{flex: 1}}>
					<Chat channel={channel.data.name} />
				</aside>
			</div>
		)
	}
}
export default connect(state => state)(ChannelPage)