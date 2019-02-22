import React, {Component, Fragment} from 'react'

import {createStore} from 'redux'

import Link from 'next/link'
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
			sources: [],
			streamInfo: {
				username: stream.user.name
			}
		};

		if(stream.live){
			if(stream.urls){
				Object.keys(stream.qualities).forEach((key) => {
					let urlKey = stream.qualities[key];
					videoJsOptions.sources.push({
						src: stream.servers[STREAMING_SERVER] + `/${stream.user.name}_${urlKey}'/index.m3u8`,
						type: 'application/x-mpegURL',
						label: STREAMING_SERVER + `(${key}p)`
					});
				});
				/*if(stream.urls.hls){
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
				}*/
			}
		}

    	return (
    		<Fragment key={stream.user.id}>
				<div className="site-component-channel__player">
					<VideoPlayer { ...videoJsOptions }></VideoPlayer>
				</div>
				<div className="site-component-channel__info dib w-100 bg-light-green">
					<h2 className='f2 tracked ma0 dib'>
					{stream.user.name}
					&nbsp;
					{stream.live ? <svg fill="red" id="icon_live" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><path d="M6,0 C-1.7,0, -1.7,12, 6,12 C13.7,12, 13.7,0, 6,0"></path></svg> : ''}
					</h2>

					<GuacButton color="white">Follow</GuacButton>
					<GuacButton color="green">Subscribe</GuacButton>
					<div>
						<span className="b f4">{stream.title}
						<br />
						playing <Link href={'/category/' + stream.category_id}><a>{stream.category_name}</a></Link>
						</span>
					</div>
				</div>
    		</Fragment>
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
			<div className="w-100 h-100 flex flex-nowrap">
				<div className="site-component-channel w-100 h-100 flex flex-column flex-grow-1 overflow-hidden relative">
				{this.renderStream(channel.data)}
				</div>
				<aside className="site-component-chat w-third h-100 flex flex-column flex-grow-1 flex-shrink-1 flex-nowrap w-100-ns">
					<Chat channel={channel.data.name} />
				</aside>
			</div>
		)
	}
}
export default connect(state => state)(ChannelPage)