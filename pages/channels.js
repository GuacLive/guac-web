import React, {Component, Fragment} from 'react';

import {connect} from 'react-redux';

import * as actions from '../actions';

import { Trans } from '@lingui/macro';

import Link from 'next/link';

import Switch from 'react-switch';

import GuacButton from '../components/GuacButton';

import Image from '../components/Image';

class ChannelsPage extends Component {
	_isMounted = false;
	state = {onlyLive: true};

	constructor() {
		super();
		this.handleChange = this.handleChange.bind(this);
	}

	static async getInitialProps({store}) {
		const { channels } = store.getState()
		if(channels.loading){
			await store.dispatch(actions.fetchChannels(1, ''));
		}
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
				<div className="w-100">
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
					<div className="site-component-channels flex flex-row flex-wrap w-80" style={{flexGrow: 1}}>
						{channels.data && channels.data.map((channel) => {
							return (
								<div className="site-component-channels__channel w-33 pa2" key={`channel_${channel.id}`}>
									<Link href={`/c/[name]`} as={`/c/${channel.name}`}>
										<a><Image src={channel.thumbnail} shape="rounded" fit="contain" flexible lazyload /></a>
									</Link>
									<div className="pa2">
										<span className="f5 db link green">
											<Link href={`/c/[name]`} as={`/c/${channel.name}`}>
												<a className="link color-inherit">{channel.title}</a>
											</Link>
										</span>
										<span className="f6 gray mv1">
											<p>
													<Link href={`/c/[name]`} as={`/c/${channel.name}`}>
														<a className="link color-inherit b">{channel.name}</a>
													</Link>
													<br />
													is playing&nbsp;
													<Link href={`/category/[id}`} href={`/category/${channel.category_id}`}>
														<a className="link color-inherit b">{channel.category_name}</a>
													</Link>
											</p>
										</span>
										<GuacButton url={`/c/${channel.name}`} color="dark-green">Watch</GuacButton>
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