import React, {Component, Fragment} from 'react';

import {connect} from 'react-redux';

import * as actions from '../actions';

import { Trans } from '@lingui/macro';

import Link from 'next/link';

import Switch from 'react-switch';

import GuacButton from '../components/GuacButton';
class ChannelsPage extends Component {
	_isMounted = false;
	state = {onlyLive: true};

	constructor() {
		super();
		this.handleChange = this.handleChange.bind(this);
	}

	static async getInitialProps({store}) {
		await store.dispatch(actions.fetchChannels(1, ''));
		return {
			...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})
		};
	}

	async componentDidUpdate(prevProps, prevState) {
		if(this.state.onlyLive !== prevState.onlyLive){
			await this.props.dispatch(actions.fetchChannels(this.state.onlyLive ? 1 : 0, ''));
		}
	}

	handleChange(onlyLive) {
		this.setState({ onlyLive });
	}

	render() {
		const { channels } = this.props;
		if(channels.loading) return null;
		return (
			<Fragment>
				<div className="w-100 pv3 ph3-l">
					<h2 className="f2 tracked mt0 mb3"><Trans>Channels</Trans></h2>
					<div className="live-switch">
						<label>
							<div className="primary"><Trans>Show only live</Trans></div>
							<Switch
								onChange={this.handleChange}
								checked={this.state.onlyLive}
							/>
						</label>
					</div>
					{
						channels.data &&
						channels.data.length === 0 &&
						<div className="flex flex-column justify-center items-center w-100 h-100 tc" style={{
							flex: '1',
							minHeight: '220px'
						}}>
							<img src="/img/sadge.png" className="flex pv3" />
							<em className="lh-title primary w5 f3 fw7 fs-normal"><Trans>No channels live</Trans></em>
							<p className="lh-copy primary-80 f5 tc pv2"><Trans>We can't find anyone live atm :(</Trans></p>
							{
								this.state.onlyLive &&
								<a className="link white inline-flex items-center justify-center tc pv2 ph3 nowrap lh-solid pointer br2 ba b--transparent bg-dark-gray guac-btn"
									href="#"
									onClick={() => this.handleChange()}>
									<Trans>View offline channels</Trans>
								</a>
							}
						</div>
					}
					<div className="site-component-channels flex flex-row flex-wrap w-80 h-100" style={{flexGrow: 1}}>

						{channels.data && channels.data.map((channel) => {
							return (
								<div key={`channel_${channel.id}`} className="pa2 w-third-l w-100">
									<div className="w-100 flex flex-column bg-bar">
										<div className="pa2 w-100 flex flex-row justify-between items-center">
											<div className="flex items-center">
												<div className={`w3 h3 mr3 ba bw1 ${new Boolean(+channel.live) ? 'b--green' : 'b--red'} bg-center cover br-100`} style={{'backgroundImage': `url(${channel.avatar}`}}></div>
												<div className="flex flex-column">
													<Link href={`/[channel]`} as={`/${channel.name}`}>
														<a className="link white f4">{channel.name}</a>
													</Link>
													<Link href="/category/[id]" as={`/category/${channel.category_id}`}>
														<a className="link white f5 mt2"><i className="fa fa-gamepad"></i> {channel.category_name}</a>
													</Link>
												</div>
											</div>
											<div className="flex flex-column">
												<GuacButton color="green" url={`/${channel.name}`}><Trans>Watch</Trans></GuacButton>
											</div>
										</div>
										<div className="w-100">
											<div className="aspect-ratio aspect-ratio--16x9">
												<div className="flex flex-column justify-between aspect-ratio--object bg-center cover" style={{'backgroundImage': new Boolean(+channel.live) ? `url(${channel.streamServer}/live/${channel.name}/thumbnail.jpg)` : `url(${channel.banner})`}}>
													<Link href="/[channel]" as={`/${channel.name}`}>
														<a className="link white pa2 w-100 flex justify-between f4 bg-black-70">{channel.title}</a>
													</Link>
													<div className="w-100 flex justify-between ph2 pt4 pb2 f5 grad-bot">
														{new Boolean(+channel.live) ? 
															<span className="pv1 ph2 bg-black white br2"><i className="fa fa-circle red"></i> <Trans>Live</Trans></span> : <span className="pv1 ph2 bg-black white br2"><Trans>Offline</Trans></span>
														}
														{new Boolean(+channel.live) ? <span className="pv1 ph2 bg-black white br2"><i className="fa fa-eye"></i> {channel.viewers}</span> : <></>}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</Fragment>
		)
	}
}
export default connect(state => state)(ChannelsPage)