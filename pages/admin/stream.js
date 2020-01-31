import React, {Component} from 'react'
import {connect} from 'react-redux';

import Link from 'next/link';

import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import withAuth from '../../utils/withAuth';
import * as actions from '../../actions';

class AdminStreamPage extends Component {
	constructor(props){
		super(props);
	}

	static async getInitialProps({store, isServer, pathname, query, req}){
		const { authentication, streams } = store.getState()
		if(streams.loading){
			await store.dispatch(actions.fetchStreams(authentication.token));
		}
	}


	render(){
		const { streams } = this.props;
		const auth = this.props.authentication;
		if(auth.loading) return null;
		if(auth.error) throw auth.error;
		if(
			auth
			&&
			auth.user
			&& 
			(auth.user.type !== 'admin' && auth.user.type !== 'staff')
		){
			return <p>You do not have permission to view this page</p>;
		}
		if(streams.error) throw streams.error;
		if(streams.loading) return null;

		return (
			<>
				<div className="w-100">
					<h2 className="f2 tracked mt0 mb3"><Link href="/admin"><a className="link underline primary">Admin</a></Link> &middot; Stream Manager</h2>
					<div className="pa1">
						<div className="h-100">
							<table className="f6 w-100 mw8" cellSpacing="0">
								<thead>
									<tr className="stripe-dark">
										<th rowSpan="2">
											<span className="fw6 tl pa3 bg-primary">App</span>
										</th>
										<th rowSpan="2">
											<span className="fw6 tl pa3 bg-primary">Name</span>
										</th>
										<th rowSpan="2">
											<span className="fw6 tl pa3 bg-primary">ID</span>
										</th>
										<th rowSpan="2">
											<span className="fw6 tl pa3 bg-primary">IP</span>
										</th>
										<th colSpan="3">
											<span className="fw6 tl pa3 bg-primary">Audio</span>
										</th>
										<th colSpan="4">
											<span className="fw6 tl pa3 bg-primary">Video</span>
										</th>
										<th rowSpan="2">
											<span className="fw6 tl pa3 bg-primary">Time</span>
										</th>
										<th rowSpan="2">
											<span className="fw6 tl pa3 bg-primary">Clients</span>
										</th>
										<th rowSpan="2">
											<span className="fw6 tl pa3 bg-primary">Actions</span>
										</th>
									</tr>
									<tr className="stripe-dark">
										<th>
											<span className="fw6 tl pa3 bg-primary">Codec</span>
										</th>
										<th>
											<span className="fw6 tl pa3 bg-primary">Frequency</span>
										</th>
										<th>
											<span className="fw6 tl pa3 bg-primary">Channel</span>
										</th>
										<th>
											<span className="fw6 tl pa3 bg-primary">Codec</span>
										</th>
										<th>
											<span className="fw6 tl pa3 bg-primary">Size</span>
										</th>
										<th>
											<span className="fw6 tl pa3 bg-primary">Bitrate</span>
										</th>
										<th>
											<span className="fw6 tl pa3 bg-primary">FPS</span>
										</th>
									</tr>
								</thead>
								<tbody className="lh-copy">
									{
										streams
										&&
										streams.data
										&&
										streams.data.live
										&&
										Object.entries(streams.data.live).map((d, i) => {
											let stream = d[0];
											let publisher = d[1] && d[1].publisher;
											let subscribers = [];
											if(d[1] && d[1].subscribers){
												subscribers = d[1].subscribers.filter((sub) => {
													// Ignore clients that are likely to be FFMPEG transcoding processes
													//return sub && sub.ip !== '::ffff:127.0.0.1';
													return sub && sub.protocol == 'ws';
												})
											}
											// Show FLV clients
											let subscriberCount = (subscribers && subscribers.length) || 0;
											let duration = Math.ceil((Date.now() - new Date(publisher.connectCreated).getTime()) / 1000);
											let bitrate = duration > 0 ? Math.ceil(publisher.bytes * 8 / duration / 1024) : 0;
											console.log(stream, publisher);
											return (
												<tr className={`stripe-dark`} key={stream + '_' + i}>
													<td className="pa3">{publisher.app}</td>
													<td className="pa3">{publisher.stream}</td>
													<td className="pa3">{publisher.clientId}</td>
													<td className="pa3">{publisher.ip}</td>
													<td className="pa3">{publisher.audio.codec}</td>
													<td className="pa3">{publisher.audio.samplerate}</td>
													<td className="pa3">{publisher.audio.channels}</td>
													<td className="pa3">{publisher.video.codec}</td>
													<td className="pa3">{publisher.video.width}x{publisher.video.height}</td>
													<td className="pa3">{bitrate}</td>
													<td className="pa3">{publisher.video.fps}</td>
													<td className="pa3">{
														publisher.connectCreated
														&&
														<span>{moment(publisher.connectCreated).fromNow(true)}</span>
													}
													</td>
													<td className="pa3">{subscriberCount}</td>
													<td className="pa3">
														<span className="mr2">
															<a
																href="#"
																className="link color-inherit"
																title="Stop stream"
																onClick={() => {
																	this.props.dispatch(actions.stopStream(auth.token, stream));
																}}
															>
																<FontAwesomeIcon icon='minus-circle' />
															</a>
														</span>
														<span className="mr2">
															<a
																href="#"
																className="link color-inherit"
																title="Ban user"
																onClick={() => {
																	this.props.dispatch(actions.banUser(auth.token, stream));
																}}
															>
																<FontAwesomeIcon icon='ban' />
															</a>
														</span>
													</td>
												</tr>
											)
										})
									}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</>
		)
	}
}

export default connect(state => {
	return {
		authentication: state.authentication,
		streams: state.streams,
	}
})(withAuth(AdminStreamPage))