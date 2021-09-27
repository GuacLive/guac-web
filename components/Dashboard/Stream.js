import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux';
import dynamic from 'next/dynamic'

import { useDispatch } from 'react-redux';

import { Trans } from '@lingui/macro';

import * as actions from '../../actions';

import EditStreamPanel from '../EditStreamPanel';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

let VideoPlayer = dynamic(
	() => /* webpackChunkName: 'VideoPlayer' */import('../VideoPlayer'),
	{
		ssr: false,
		loading: () => <div className="w-100 h-100 bg-black white content-box" style={{'paddingTop': '56.25%'}} />
	}
);

const STREAMING_SERVER = 'eu';

const handleFocus = (event) => event.target.select();

function Stream(props){
	const dispatch  = useDispatch();
	const [showStreamkey, setShowStreamkey] = useState(false);

	useEffect(() => {
		const {authentication} = props;
		dispatch(actions.fetchCategories());
		dispatch(actions.fetchStreaming(authentication.token));
		dispatch(actions.fetchChannel(authentication.user.name));
	}, [dispatch, props]);

	function renderStream(){
		const {
			channel
		} = props;
		let stream = channel.data;

		let videoJsOptions = {
			autoplay: false,
			controls: true,
			sources: [],
			streamInfo: {
				username: stream.user.name
			}
		};

		if (stream.live) {
			if (stream.urls) {
				// Prefer FLV if available, it has lower latency
				let flvUrl = `${stream.streamServer}${stream.urls.flv}`;
				if (stream.urls.flv) {
					videoJsOptions.sources.push({
						src: typeof window === 'object' && 'WebSocket' in window
							? `wss:${flvUrl}`
							: flvUrl,
						type: 'video/x-flv',
						label: 'Source (FLV)'
					});
				}
				if (stream.urls.hls) {
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
			<div className="w-100 h-100 flex flex-column flex-grow-1 overflow-hidden relative">
				<VideoPlayer { ...videoJsOptions } live={stream.live}></VideoPlayer>
			</div>
		);
	}

	const {streaming, categories, channel} = props;
	const auth = props.authentication;
	if(auth.loading) return null;
	if(auth.error) throw auth.error;
	if(streaming.loading) return null;
	if(channel.loading) return null;
	if(categories.error) throw categories.error;
	if(streaming.error) throw streaming.error;
	if(auth && auth.user && !auth.user.can_stream) return <p><Trans>You do not have permission to stream</Trans></p>;
	const streamkey = `${auth.user.name}?token=${streaming.key}`;
	return (
		<div className="flex flex-row flex-wrap w-100">
			<div className="w-100 w-50-ns pa3">
				<h2 className="f2 tracked mt0 mb3"><Trans>Stream preview</Trans></h2>
				{ renderStream() }
			</div>
			<div className="w-100 w-50-ns pa3">
				<h2 className="f2 tracked mt0 mb3"><Trans>Stream settings</Trans></h2>
				<EditStreamPanel />
			</div>
			<div className="w-100 w-50-ns pa3">
				<h2 className="f2 tracked mt0 mb3"><Trans>Get started with streaming</Trans></h2>
				<ol>
					<li>
						<p><Trans>First, choose the streaming server closest to you:</Trans></p>
						<ul className="list">
							<li><b>London, Europe:</b> rtmp://lon.stream.guac.live:1935/live</li>
							{/*<li><b>Oslo, Europe:</b> rtmp://osl1.stream.guac.live:1935/live</li>
							<li><b>London, Europe:</b> rtmp://lon1.stream.guac.live:1935/live</li>*/}
						</ul>
					</li>
					<li>
						{streaming && streaming.key ?
							<>
							<p><Trans>Now, use the following stream key:</Trans></p>
							<div className="db">
								<input 
									className="input-reset bn pa3 w-80 bg-white br2"
									type={showStreamkey ? 'text' : 'password'}
									readOnly
									value={streamkey || undefined}
									onFocus={handleFocus}
								/>
								<span className="link inline-flex flex-nowrap ph3 pv2 hover-bg-dark-gray bg-animate color-inherit" onClick={() => setShowStreamkey(!showStreamkey)}><FontAwesomeIcon icon={showStreamkey ? 'eye' : 'eye-slash'} /></span>
							</div>
							</>
							:
							<p style={{color: 'red'}}><Trans>No streaming key found, please contact an admin.</Trans></p>
						}
					</li>
					<li>
						<p><Trans>At last, make sure keyframe interval is set to <b>1</b>.</Trans></p>
					</li>
				</ol>
			</div>
			<div className="w-100 w-50-ns pa3">
				<h2 className="f2 tracked mt0 mb3"><Trans>Chat commands:</Trans></h2>
				<ul>
					<li><b>/help</b> - <Trans>Show help command</Trans></li>
					<li><b>/users</b> - <Trans>Show user list</Trans></li>
					<li><b>/mod <i><Trans>user</Trans></i></b></li>
					<li><b>/unmod <i><Trans>user</Trans></i></b></li>
					<li><b>/timeout <i><Trans>user</Trans></i> <i><Trans>seconds</Trans></i></b> - <Trans>Time out user for x seconds</Trans></li>
					<li><b>/timeout <i><Trans>user</Trans></i> <i>0</i></b> - <Trans>Remove timeout for user</Trans></li>
					<li><b>/ban <i><Trans>user</Trans></i> <i><Trans>message</Trans></i></b> - <Trans>Permanently ban user</Trans></li>
					<li><b>/unban <i><Trans>user</Trans></i></b> - <Trans>Unban user</Trans></li>
				</ul>
			</div>
		</div>
	);
}
export default connect(state => state)(Stream)