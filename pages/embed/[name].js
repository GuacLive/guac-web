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
import useChannelSocket from 'hooks/useChannelSocket';

const STREAMING_SERVER = 'eu';
function EmbedPage(props){
	const renderStream = () => {
		const {
			channel,
			authentication
		} = props;
		let stream = channel.data;
		const channelAPISocket = useChannelSocket(channel);

		let videoJsOptions = {
			autoplay: true,
			banner: stream.banner,
			controls: true,
			sources: [],
			streamInfo: {
				viewer_user_id: authentication.user && authentication.user.id,
				title: stream.title,
				username: stream.user.name,
				isChannel: true
			}
		};


		if(stream.live){
			if(stream.urls){
				// Prefer FLV if available, it has lower latency
				let flvUrl = `${stream.streamServer}${stream.urls.flv}`;
				if(stream.urls.flv){
					videoJsOptions.sources.push({
						src: typeof window === 'object' && 'WebSocket' in window
							? `wss:${flvUrl}`
							: flvUrl,
						type: 'video/x-flv',
						label: 'Source (FLV)'
					});
				}
				if(stream.urls.hls){
					videoJsOptions.sources.push({
						src: `${stream.streamServer}${stream.urls.hls}`,
						type: 'application/x-mpegURL',
						label: 'Auto (HLS)'
					});
				}
				// Only HLS has quality options
				Object.keys(stream.qualities).forEach((key) => {
					let urlKey = stream.qualities[key];
					videoJsOptions.sources.push({
						src: stream.streamServer + `/live/${stream.user.name}/index${urlKey}.m3u8`,
						type: 'application/x-mpegURL',
						label: `${key} (HLS)`
					});
				});
			}
		}

		return (
			<div className="player-embed">
				<VideoPlayer {...videoJsOptions} live={stream.live} fill={true}></VideoPlayer>
			</div>
		);
	}

	const {
		channel
	} = props;


	if(channel.loading) return null;
	if(!channel.data) return null;
	if(channel.error) throw channel.error;

	const meta = [
		{property: 'og:title', hid: 'og:title', content: `${channel.data.name} &middot; guac.live`},
		{property: 'og:description', hid: 'og:description', content: `Watch ${channel.data.name} stream ${channel.data.category_name} on guac`},
		{property: 'og:image', hid: 'og:image', content: channel.data.user.avatar || '//guac.live/img/header-logo.png'},
		{name: 'author', content: channel.data.name},
		{name: 'description', hid: 'description', content: `Watch ${channel.data.name} stream ${channel.data.category_name} on guac`},
		{name: 'profile:username', content: channel.data.name},
		{property: 'twitter:card', content: 'summary_large_image'},
		{property: 'twitter:site', content: '@GuacLive'},
		{property: 'twitter:title', content: (channel.data.title || '').substring(0, 70)},
		{property: 'twitter:description', content: `Watch ${channel.data.name} stream ${channel.data.category_name} on guac`},
		{property: 'twitter:image', content: channel.data.user.avatar || '//guac.live/img/header-logo.png'},
	];
	// Add meta noindex, nofollow if channel is private
	if (channel.data && channel.data.private) {
		meta.push({
			name: 'robots',
			content: 'noindex, nofollow, noarchive'
		})
	}

	return (
		<Fragment>
			<NextHead>
				<title>{channel.data.name} &middot; guac.live</title>
				{meta && meta.map((m) => {
					return (
						<meta name={m.name} content={m.content} key={m.name} />
					)
				})}
				<link rel='alternate' type='application/activity+json' href={`${process.env.API_URL}/actor/${channel.data.name}`} />
				<link rel="alternate" type="application/json+oembed" href={`/api/oembed?format=json&url=https%3A%2F%guac.live%2Fc%2F${channel.data.name}`} title={channel.data.name} />
			</NextHead>
			{renderStream()}
		</Fragment>
	)
}

EmbedPage.getInitialProps = async ({store, query}) => {
	log('info', 'Channel', query.name);
	await store.dispatch(actions.fetchChannel(query.name));
	return {...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})};
};
export default connect(state => state)(EmbedPage)