import React, {Component} from 'react'
import {connect} from 'react-redux';

import initialize from '../utils/requireAuth';
import * as actions from '../actions';

class DashboardPage extends Component {
	static async getInitialProps({store, isServer, pathname, query, req}){
		initialize({store, isServer, pathname, query, req});
		const { streaming, authentication } = store.getState()
		if(streaming.loading){
			await store.dispatch(actions.fetchStreaming(authentication.token));
		}
    }


	componentDidMount(){
	}

	render(){
		const auth = this.props.authentication;
		const streaming = this.props.streaming;
		if(auth.loading) return null;
		if(auth.error) throw auth.error;
		if(streaming.loading) return null;
		if(streaming.error) throw streaming.error;
		if(auth && auth.user && !auth.user.can_stream) return <p>You do not have permission to stream</p>;
		return (
			<>
				<div className="w-100">
					<h2 className="f2 tracked mt0 mb3">Get started with streaming</h2>
					<ol>
						<li>
							<p>First, choose the streaming server closest to you:</p>
							<ul className="list">
								<li><b>Oslo, Europe:</b> rtmp://osl1.stream.guac.live:1935/app</li>
								<li><b>London, Europe:</b> rtmp://lon1.stream.guac.live:1935/app</li>
							</ul>
						</li>
						<li>
							{streaming && streaming.key ? <p>Now, use the following stream key: <b>{streaming.key}</b></p> : <p style={{color: 'red'}}>No streaming key found, please contact an admin.</p>}
						</li>
						<li>
							<p>At last, make sure keyframe interval is set to <b>2</b>.</p>
						</li>
					</ol>
				</div>
			</>
		)
	}
}

export default connect(state => state)(DashboardPage)