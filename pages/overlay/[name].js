import React, {Component, Fragment} from 'react'

import {connect} from 'react-redux';

import NextHead from 'next/head';

import * as actions from '../../actions';

import log from '../../utils/log';

import Chat from '../../components/Chat';

class OverlayPage extends Component {
	static async getInitialProps({store, isServer, pathname, query, req}){
		const { channel } = store.getState()
		log('info', 'Channel', query.name);
		//if(channel.loading){
			await store.dispatch(actions.fetchChannel(query.name));
		//}
		return {...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})};
	}

	render() {
		const {
            channel
		} = this.props;

		if(channel.loading) return null;
		if(!channel.data) return null;
        if(channel.error) throw channel.error;

		const meta = [
			{name: 'og:title', hid: 'og:title', content: `${channel.data.name} &middot; guac.live`},
			{name: 'og:description', hid: 'og:description', content: (channel.data.name || '').substring(0, 200)},
			{name: 'og:image', hid: 'og:image', content: '//guac.live/img/header-logo.png'},
			{name: 'author', content: channel.data.name},
			{name: 'description', hid: 'description', content: (channel.data.name || '').substring(0, 200)},
			{name: 'profile:username', content: channel.data.name},
			{name: 'twitter:card', content: 'summary_large_image'},
			{name: 'twitter:site', content: '@GuacLive'},
			{name: 'twitter:title', content: (channel.data.title || '').substring(0, 70)},
			{name: 'twitter:description', content: (channel.data.name || '').substring(0, 200)},
			{name: 'twitter:image', content: '//guac.live/img/header-logo.png'},  
        ];
		// Add meta noindex, nofollow if channel is private
		if(channel.data && channel.data.private){
			meta.push({
				name: 'robots',
				content: 'noindex, nofollow, noarchive'
			})
		}

		return (
			<Fragment>
                <NextHead>
                    <title>{channel.data.name} &middot; guac.live</title>
                    { meta && meta.map((m) => {
                        return (
                            <meta name={m.name} content={m.content} key={m.name} />
                        )
                    })}
                </NextHead>
                <div className="h-100 overlay-wrapper">
                    <Chat channel={channel.data.name} overlay={true} />
                </div>
			</Fragment>
		)
	}
}
export default connect(state => state)(OverlayPage)