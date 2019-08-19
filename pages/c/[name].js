import React, {Component, Fragment} from 'react'

import Link from 'next/link'

import NextHead from 'next/head'

import dynamic from 'next/dynamic'

import Chat from '../../components/Chat'

import GuacButton from '../../components/GuacButton'

let VideoPlayer = dynamic(
	() => import('../../components/VideoPlayer'),
	{
		ssr: false,
		loading: () => <div className="w-100 h-100 bg-black white content-box" style={{'paddingTop': '56.25%'}} />
	}
);

import {connect} from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as actions from '../../actions';

import log from '../../utils/log';

const STREAMING_SERVER = 'eu';
class ChannelPage extends Component {
	static async getInitialProps({store, isServer, pathname, query, req}){
		const { channel, site } = store.getState()
		log('info', 'Channel', query.name);
		if(channel.loading){
			await store.dispatch(actions.fetchChannel(query.name));
		}
		return {};
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
    		<Fragment key={stream.user.id}>
				<div className="site-component-channel__player">
					<VideoPlayer { ...videoJsOptions } live={stream.live}></VideoPlayer>
				</div>
				<div className="site-component-channel__info dib w-100 bg-light-green">
					<h2 className='f2 tracked ma0 dib'>
					{stream.user.name}
					{stream.live ? <span className="ph2 bg-red f6 tc inline-flex white mh3">LIVE</span> : ''}
					</h2>
					<div className="inline-flex align-items-center ph2 red f6">
					{stream.live
						?
							<>
							<span className="">
								<FontAwesomeIcon icon='user' />
							</span>
							&nbsp;
							{this.props.channel.viewers !== null ? this.props.channel.viewers : '?'}
							</>
						: ''
					}
					</div>

					{stream.isFollowed && !stream.isMe && <GuacButton color="white">Unfollow</GuacButton>}
					{!stream.isFollowed && && !stream.isMe && <GuacButton color="white">Follow</GuacButton>}
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
			channel,
			site,
			authentication
		} = this.props;
		if(channel.loading) return (<p>Loading...</p>);
		//if(channel.error) throw channel.error;
		if(!channel.data) return (<p>Channel not found</p>);

		let followed = site.myFollowed && site.myFollowed.find((u) => {
			return u && u.to_id === channel.data.user.id;
		});

		let isFollowed = followed && followed.to_id === channel.data.user.idM
		let isMe = authentication.user.id && channel.data.user.id === authentication.user.id;
		channel.data.isFollowed = isFollowed;
		channel.data.isMe = isMe;

		return (
			<Fragment>
				<NextHead>
					<title>{channel.data.name} &middot; guac.live</title>
				</NextHead>
				<div className="w-100 min-vh-100 flex flex-nowrap black">
					<div className="site-component-channel w-70 w-100-m h-100 flex flex-column flex-grow-1 overflow-hidden relative">
					{this.renderStream(channel.data)}
					</div>
					<aside className="site-component-chat w-30 w-100-m h-100 flex-l dn-m flex-column flex-grow-1 flex-shrink-1 flex-nowrap">
						<Chat channel={channel.data.name} />
					</aside>
				</div>
			</Fragment>
		)
	}
}
export default connect(state => state)(ChannelPage)