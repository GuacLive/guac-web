import React, {Component, Fragment} from 'react'
import dynamic from 'next/dynamic'

let VideoPlayer = dynamic(
	() => /* webpackChunkName: 'VideoPlayer' */import('../../components/VideoPlayer'),
	{
		ssr: false,
		loading: () => <div className="w-100 h-100 bg-black white content-box" style={{'paddingTop': '56.25%'}} />
	}
);

import {connect} from 'react-redux';

import NextHead from 'next/head';

import * as actions from '../../actions';

import log from '../../utils/log';

const STREAMING_SERVER = 'eu';
class EmbedPage extends Component {
	static async getInitialProps({store, isServer, pathname, query, req}){
		const { channel } = store.getState()
		log('info', 'Channel', query.name);
		//if(channel.loading){
			await store.dispatch(actions.fetchChannel(query.name));
		//}
		return {...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})};
	}

    renderStream = () => {
		const {
			channel
		} = this.props;
		let stream = channel.data;

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
				// Prefer FLV if available, it has lower latency
				let flvUrl = stream.servers[STREAMING_SERVER] + stream.urls.flv;
				if(stream.urls.flv){
					videoJsOptions.sources.push({
						src: typeof window === 'object' && 'WebSocket' in window
							? `${window.location.protocol === 'https:' ? 'wss' : 'ws'}:${flvUrl}`
							: flvUrl,
						type: 'video/x-flv',
						label: STREAMING_SERVER + `(FLV)`
					});
				}
				// Only HLS has quality options
				Object.keys(stream.qualities).forEach((key) => {
					let urlKey = stream.qualities[key];
					videoJsOptions.sources.push({
						src: stream.servers[STREAMING_SERVER] + `/live/${stream.user.name}/index${urlKey}.m3u8`,
						type: 'application/x-mpegURL',
						label: STREAMING_SERVER + `(${key})`
					});
				});
			}
		}

    	return (
			<div class="player-embed">
                <VideoPlayer { ...videoJsOptions } live={stream.live} fill={true}></VideoPlayer>
            </div>
    	);
    }

	render() {
		const {
            channel
		} = this.props;

		if(channel.loading) return null;
		if(!channel.data) return null;
        if(channel.error) throw channel.error;

		const meta = [
			{name: 'og:title', hid: 'og:title', content: `${channel.data.name} &middot; guac.live`},
			{name: 'og:description', hid: 'og:description', content: (channel.data.name || '').substring(0, 200)},
			{name: 'og:image', hid: 'og:image', content: '//guac.live/img/header-logo.png'},
			{name: 'author', content: channel.data.name},
			{name: 'description', hid: 'description', content: (channel.data.name || '').substring(0, 200)},
			{name: 'profile:username', content: channel.data.name},
			{name: 'twitter:card', content: 'summary_large_image'},
			{name: 'twitter:site', content: '@GuacLive'},
			{name: 'twitter:title', content: (channel.data.title || '').substring(0, 70)},
			{name: 'twitter:description', content: (channel.data.name || '').substring(0, 200)},
			{name: 'twitter:image', content: '//guac.live/img/header-logo.png'},  
        ];
		// Add meta noindex, nofollow if channel is private
		if(channel.data && channel.data.private){
			meta.push({
				name: 'robots',
				content: 'noindex, nofollow, noarchive'
			})
		}

		return (
			<Fragment>
                <NextHead>
                    <title>{channel.data.name} &middot; guac.live</title>
                    { meta && meta.map((m) => {
                        return (
                            <meta name={m.name} content={m.content} key={m.name} />
                        )
                    })}
                </NextHead>
                {this.renderStream()}
			</Fragment>
		)
	}
}
export default connect(state => state)(EmbedPage)