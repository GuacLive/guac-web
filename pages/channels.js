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
			await store.dispatch(actions.fetchChannels(true));
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
                    <div className="site-component-channels flex flex-row flex-wrap w-80" style={{flexGrow: 1}}>
                        {channels.data && channels.data.map((channel) => {
                            return (
                                <div className="site-component-channels__channel w-33 pa2" key={`channel_${channel.id}`}>
                                    <Link href={`/c/${channel.name}`}>
                                        <a><Image src={channel.thumbnail} shape="rounded" fit="contain" flexible lazyload /></a>
                                    </Link>
                                    <div className="pa2">
                                        <span className="f5 db link green">
                                            <Link href={`/c/${channel.name}`}>
                                                <a className="link color-inherit">{channel.title}</a>
                                            </Link>
                                        </span>
                                        <span className="f6 gray mv1">
                                            <p>
                                                    <Link href={`/c/${channel.name}`}>
                                                        <a className="link color-inherit b">{channel.name}</a>
                                                    </Link>
                                                    <br />
                                                    is playing&nbsp;
                                                    <Link href={`/category/${channel.category_id}`}>
                                                    <a className="link color-inherit b">{channel.category_name}</a>
                                                </Link>
                                            </p>
                                        </span>
                                        <Link href={`/c/${channel.name}`}>
                                            <a className="link tc ph3 pv1 db bg-animate bg-dark-green hover-bg-green white f6 br1">Watch</a>
                                        </Link>
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