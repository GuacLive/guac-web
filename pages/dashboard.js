import React, {Component} from 'react'
import {connect} from 'react-redux';
import dynamic from 'next/dynamic'

import withAuth from '../utils/withAuth';
import * as actions from '../actions';


let VideoPlayer = dynamic(
	() => /* webpackChunkName: 'VideoPlayer' */import('../components/VideoPlayer'),
	{
		ssr: false,
		loading: () => <div className="w-100 h-100 bg-black white content-box" style={{'paddingTop': '56.25%'}} />
	}
);
class DashboardPage extends Component {
	constructor(props){
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	static async getInitialProps({store, isServer, pathname, query, req}){
		const { streaming, channel, authentication } = store.getState()
		if(streaming.loading){
			await store.dispatch(actions.fetchStreaming(authentication.token));
			await store.dispatch(actions.fetchCategories(authentication.token));
		}
		if(channel.loading){
			await store.dispatch(actions.fetchChannel(authentication.user.name));
		}
    }

	componentDidMount(){
	}


	handleSubmit(e){
		const {streaming} = this.props;
		e.preventDefault();
		// yay uncontrolled forms!
		console.log(this.refs);
		if(streaming.category !== this.refs.category.value){
			this.props.dispatch(
				actions.setCategory(this.props.authentication.token, this.refs.category.value)
			);
		}
		if(streaming.title !== this.refs.title.value){
			this.props.dispatch(
				actions.setTitle(this.props.authentication.token, this.refs.title.value)
			);
		}
		if(streaming.private !== this.refs.private.checked){
			this.props.dispatch(
				actions.setPrivate(this.props.authentication.token, this.refs.private.checked)
			);
		}
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
			<div class="w-100 h-100 flex flex-column flex-grow-1 overflow-hidden relative">
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
		if(auth && auth.user && !auth.user.can_stream) return <p>You do not have permission to stream</p>;
		return (
			<div className="flex flex-row flex-wrap w-100">
				<div className="w-50 pa3">
					<h2 className="f2 tracked mt0 mb3">Stream preview</h2>
					{ this.renderStream() }
				</div>
				<div className="w-50 pa3">
					<h2 className="f2 tracked mt0 mb3">Stream settings</h2>
					<form className="measure" onSubmit={this.handleSubmit}>
						<label htmlFor="title">Title:</label>
						<input name="title" type="text" className="input-reset bn pa3 w-100 bg-white br2" ref="title" defaultValue={streaming.title} placeholder="Title" />
						{
							categories.data &&
							<>
								<label htmlFor="category">Category:</label>
								<select 
									name="category"
									className="input-reset bn pa3 w-100 bg-white br2" 
									ref="category"
									placeholder="Select category"
									value={streaming.category}
								>
									{
										categories.data.map((category) => {
											return (
												<option 
													key={`category_${category.category_id}`}
													value={category.category_id}
												>
												{category.name}
												</option>
											);
										})
									}
								</select>
							</>
						}
						<label htmlFor="private">Private (don't show in categories, frontpage or search):</label>
						<input  
							name="private"
							type="checkbox"
							className="pa3 br2" 
							ref="private"
							defaultChecked={streaming.private}
						>
						</input>
						<input type="submit" value="Edit stream" className="link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--green bg-green ml1" />
					</form>
				</div>
				<div className="w-50 pa3">
					<h2 className="f2 tracked mt0 mb3">Get started with streaming</h2>
					<ol>
						<li>
							<p>First, choose the streaming server closest to you:</p>
							<ul className="list">
								<li><b>London, Europe:</b> rtmp://stream.guac.live:1935/live</li>
								{/*<li><b>Oslo, Europe:</b> rtmp://osl1.stream.guac.live:1935/live</li>
								<li><b>London, Europe:</b> rtmp://lon1.stream.guac.live:1935/live</li>*/}
							</ul>
						</li>
						<li>
							{streaming && streaming.key ? <p>Now, use the following stream key: <b>{auth.user.name}?token={streaming.key}</b></p> : <p style={{color: 'red'}}>No streaming key found, please contact an admin.</p>}
						</li>
						<li>
							<p>At last, make sure keyframe interval is set to <b>2</b>.</p>
						</li>
					</ol>
				</div>
				<div className="w-50 pa3">
					<h2 className="f2 tracked mt0 mb3">Chat commands:</h2>
					<ul>
						<li><b>/help</b> - Show help command</li>
						<li><b>/users</b> - Show user list</li>
						<li><b>/mod <i>user</i></b></li>
						<li><b>/unmod <i>user</i></b></li>
						<li><b>/timeout <i>user</i> <i>seconds</i></b> - Time out user for x seconds</li>
						<li><b>/timeout <i>user</i> <i>0</i></b> - Remove timeout for user</li>
						<li><b>/ban <i>user</i> <i>message</i></b> - Permanently ban user</li>
						<li><b>/unban <i>user</i></b> - Unban user</li>
					</ul>
				</div>
			</div>
		)
	}
}

export default connect(state => state)(withAuth(DashboardPage))