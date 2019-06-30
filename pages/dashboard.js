import React, {Component} from 'react'
import {connect} from 'react-redux';

import withAuth from '../utils/withAuth';
import * as actions from '../actions';

class DashboardPage extends Component {
	constructor(props){
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	static async getInitialProps({store, isServer, pathname, query, req}){
		const { streaming, authentication } = store.getState()
		if(streaming.loading){
			await store.dispatch(actions.fetchStreaming(authentication.token));
		}
    }

	componentDidMount(){
	}


	handleSubmit(e){
		e.preventDefault();
		// yay uncontrolled forms!
		console.log(this.refs);
		this.props.dispatch(
			actions.setTitle(this.props.authentication.token, this.refs.title.value)
		);
	}

	render(){
		const {streaming} = this.props;
		const auth = this.props.authentication;
		if(auth.loading) return null;
		if(auth.error) throw auth.error;
		if(streaming.loading) return null;
		if(streaming.error) throw streaming.error;
		if(auth && auth.user && !auth.user.can_stream) return <p>You do not have permission to stream</p>;
		return (
			<>
				<div className="w-100">
					<h2 className="f2 tracked mt0 mb3">Set stream title</h2>
					<form className="measure" onSubmit={this.handleSubmit}>
						<input type="text" className="input-reset bn pa3 w-100 bg-white br2" ref="title" placeholder={streaming.title} />
						<input type="submit" value="Edit title" className="link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--green bg-green ml1" />
					</form>
					<h2 className="f2 tracked mt0 mb3">Get started with streaming</h2>
					<ol>
						<li>
							<p>First, choose the streaming server closest to you:</p>
							<ul className="list">
								<li><b>Oslo, Europe:</b> rtmp://osl1.stream.guac.live:1935/live</li>
								<li><b>London, Europe:</b> rtmp://lon1.stream.guac.live:1935/live</li>
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
			</>
		)
	}
}

export default connect(state => state)(withAuth(DashboardPage))