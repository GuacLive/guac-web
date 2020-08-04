import React, {Component} from 'react'
import {connect} from 'react-redux';
import dynamic from 'next/dynamic'

import { Trans } from '@lingui/macro';

import withAuth from '../utils/withAuth';
import * as actions from '../actions';

import EditStreamPanel from '../components/EditStreamPanel';

let VideoPlayer = dynamic(
	() => /* webpackChunkName: 'VideoPlayer' */import('../components/VideoPlayer'),
	{
		ssr: false,
		loading: () => <div className="w-100 h-100 bg-black white content-box" style={{'paddingTop': '56.25%'}} />
	}
);

const STREAMING_SERVER = 'eu';
class DashboardPage extends Component {
	constructor(props){
		super(props);
	}

	static async getInitialProps({store, isServer, pathname, query, req}){
		const { streaming, channel, authentication } = store.getState()
		if(streaming.loading){
			await store.dispatch(actions.fetchStreaming(authentication.token));
		}
		if(channel.loading){
			await store.dispatch(actions.fetchChannel(authentication.user.name));
		}
    }

	componentDidMount(){
	}

    renderStream(){
		const {
			channel
		} = this.props;
		let stream = channel.data;

		let videoJsOptions = { 
			autoplay: false,
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
			<div className="w-100 h-100 flex flex-column flex-grow-1 overflow-hidden relative">
                <VideoPlayer { ...videoJsOptions } live={stream.live}></VideoPlayer>
            </div>
		);
	}

	render(){
		const {streaming, categories, channel} = this.props;
		const auth = this.props.authentication;
		if(auth.loading) return null;
		if(auth.error) throw auth.error;
		if(streaming.loading) return null;
		if(channel.loading) return null;
		if(categories.error) throw categories.error;
		if(streaming.error) throw streaming.error;
		if(auth && auth.user && !auth.user.can_stream) return <p><Trans>You do not have permission to stream</Trans></p>;
		return (
			<div className="flex flex-row flex-wrap w-100">
				<div className="w-50 pa3">
					<h2 className="f2 tracked mt0 mb3"><Trans>Stream preview</Trans></h2>
					{ this.renderStream() }
				</div>
				<div className="w-50 pa3">
					<h2 className="f2 tracked mt0 mb3"><Trans>Stream settings</Trans></h2>
					<EditStreamPanel />
				</div>
				<div className="w-50 pa3">
					<h2 className="f2 tracked mt0 mb3"><Trans>Get started with streaming</Trans></h2>
					<ol>
						<li>
							<p><Trans>First, choose the streaming server closest to you:</Trans></p>
							<ul className="list">
								<li><b>London, Europe:</b> rtmp://stream.guac.live:1935/live</li>
								{/*<li><b>Oslo, Europe:</b> rtmp://osl1.stream.guac.live:1935/live</li>
								<li><b>London, Europe:</b> rtmp://lon1.stream.guac.live:1935/live</li>*/}
							</ul>
						</li>
						<li>
							{streaming && streaming.key ? <p><Trans>Now, use the following stream key:</Trans> <b>{auth.user.name}?token={streaming.key}</b></p> : <p style={{color: 'red'}}><Trans>No streaming key found, please contact an admin.</Trans></p>}
						</li>
						<li>
							<p><Trans>At last, make sure keyframe interval is set to <b>1</b>.</Trans></p>
						</li>
					</ol>
				</div>
				<div className="w-50 pa3">
					<h2 className="f2 tracked mt0 mb3"><Trans>Chat commands:</Trans></h2>
					<ul>
						<li><b>/help</b> - <Trans>Show help command</Trans></li>
						<li><b>/users</b> - <Trans>Show user list</Trans></li>
						<li><b>/mod <i><Trans>user</Trans></i></b></li>
						<li><b>/unmod <i><Trans>user</Trans></i></b></li>
						<li><b>/timeout <i><Trans>user</Trans></i> <i><Trans>seconds</Trans></i></b> - <Trans>Time out user for x seconds</Trans></li>
						<li><b>/timeout <i><Trans>user</Trans></i> <i>0</i></b> - Remove timeout for user</li>
						<li><b>/ban <i><Trans>user</Trans></i> <i><Trans>message</Trans></i></b> - <Trans>Permanently ban user</Trans></li>
						<li><b>/unban <i><Trans>user</Trans></i></b> - <Trans>Unban user</Trans></li>
					</ul>
				</div>
			</div>
		)
	}
}

export default connect(state => state)(withAuth(DashboardPage))