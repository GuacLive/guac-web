import React, {Component, Fragment} from 'react';

import dynamic from 'next/dynamic';

import {connect} from 'react-redux';

import * as actions from '../actions';

import { Trans } from '@lingui/macro';

import Link from 'next/link';

import Image from '../components/Image';

class ChannelsPage extends Component {
	static async getInitialProps({store}){
		const { channels } = store.getState()
		if(channels.loading){
			await store.dispatch(actions.fetchChannels());
		}
		return {...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})};
    }

	render() {
		const { channels } = this.props;
		if(channels.loading) return null;
		return (
			<Fragment>
				<div className="w-100">
					<h2 className="f2 tracked mt0 mb3"><Trans>Channels</Trans></h2>
                    <div className="site-component-channels">
                        {channels.data && channels.data.map((channel) => {
                            return (
                                <div className="site-component-channels__channel">
                                      <article className="relative mw5 center">
                                        <Image src={channel.thumbnail} shape="rounded" fit="contain" flexible lazyload />
                                        <div className="pa2">
                                            <a className="f6 db link dark-green hover-green">
                                                <Link href={`/c/${channel.name}`}>
                                                    <a className="link inherit">{channel.title}</a>
                                                </Link>
                                            </a>
                                            <span className="f6 gray mv1">
                                                <Link href={`/c/${channel.name}`}>
                                                    <a className="link inherit">{channel.name}</a>
                                                </Link>
                                            </span>
                                            <span className="f6 gray mv1">
                                                <p>
                                                    playing
                                                    <Link href={`/category/${channel.category}`}>
                                                        <a className="link inherit b">{channel.category}</a>
                                                    </Link>
                                                </p>
                                            </span>
                                            <Link href={`/c/${channel.user.name}`}>
                                                <a className="link tc ph3 pv1 db bg-animate bg-dark-green hover-bg-green white f6 br1">Watch</a>
                                            </Link>
                                        </div>
                                    </article>
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