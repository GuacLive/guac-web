import React, {Component, Fragment} from 'react';

import {connect} from 'react-redux';

import * as actions from '../actions';

import { Trans, t } from '@lingui/macro';

import Link from 'next/link';

import Switch from 'react-switch';

import GuacButton from '../components/GuacButton';

const DEFAULT_OFFLINE_POSTER = '//cdn.guac.live/offline-banners/offline-banner.png';
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
			await this.props.dispatch(actions.fetchChannels(this.state.onlyLive ? 1 : '', ''));
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
								onColor="#19a974"
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
									onClick={() => this.handleChange(false)}>
									<Trans>View offline channels</Trans>
								</a>
							}
						</div>
					}
					<div className="site-component-channels grid ga2 flex-grow-1 overflow-hidden grid-columns-2 grid-columns-3-xl h-100">
						{channels.data && channels.data.map((channel) => {
							return (
								<div key={`channel_${channel.id}`} className="relative pointer flex flex-column items-center z-1">
									<div className="pa2 w-100 flex flex-row justify-between items-center bg-bar">
										<div className="flex items-center">
											<div className={`w3 h3 mr3 ba bw1 ${+channel.live ? 'b--green' : 'b--red'} bg-center cover br-100`} style={{'backgroundImage': `url(${channel.avatar}`}}></div>
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
											<Link href="/[channel]" as={`/${channel.name}`}>
												<a className="link flex flex-column justify-between aspect-ratio--object bg-center cover" style={{'backgroundImage': +channel.live ? `url(${channel.streamServer}/live/${channel.name}/thumbnail.jpg)` : `url(${channel.banner || DEFAULT_OFFLINE_POSTER})`}}>
													<span className="link white pa2 w-100 flex justify-between f4 bg-black-70">{channel.title || t`No stream title`}</span>
													<div className="w-100 flex justify-between ph2 pt4 pb2 f5 grad-bot">
														{+channel.live ?
															<span className="pv1 ph2 bg-black white br2"><i className="fa fa-circle red"></i> <Trans>Live</Trans></span> : <span className="pv1 ph2 bg-black white br2"><Trans>Offline</Trans></span>
														}
														{+channel.live ? <span className="pv1 ph2 bg-black white br2"><i className="fa fa-eye"></i> {channel.viewers}</span> : <></>}
													</div>
												</a>
											</Link>
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