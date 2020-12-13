import React, {Component, Fragment} from 'react'

import Chat from 'components/Chat';

import {connect} from 'react-redux';

import NextHead from 'next/head';

import * as actions from '../../actions';

import log from '../../utils/log';

class ChatPage extends Component {
	static async getInitialProps({store, isServer, pathname, query, req}){
		log('info', 'Channel', query.name);
		await store.dispatch(actions.fetchChannel(query.name));
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
			{property: 'og:title', hid: 'og:title', content: `${channel.data.name} &middot; guac.live`},
			{property: 'og:description', hid: 'og:description', content: `Watch ${channel.data.name} stream ${channel.data.category_name} on guac`},
			{property: 'og:image', hid: 'og:image', content: channel.data.user.avatar || '//guac.live/img/header-logo.png'},
			{name: 'author', content: channel.data.name},
			{name: 'description', hid: 'description', content: `Watch ${channel.data.name} stream ${channel.data.category_name} on guac`},
			{name: 'profile:username', content: channel.data.name},
			{property: 'twitter:card', content: 'summary_large_image'},
			{property: 'twitter:site', content: '@GuacLive'},
			{property: 'twitter:title', content: (channel.data.title || '').substring(0, 70)},
			{property: 'twitter:description', content: `Watch ${channel.data.name} stream ${channel.data.category_name} on guac`},
			{property: 'twitter:image', content: channel.data.user.avatar || '//guac.live/img/header-logo.png'},  
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
				<main class="w-100 h-100 flex flex-column flex-nowrap justify-between items-start page-wrapper">
					<div className="w-100 min-vh-100 flex flex-nowrap black">			
						<div className="site-component-chat w-100 h-100 min-vh-100 flex flex-nowrap flex-column flex-grow-1 overflow-hidden relative">
							<Chat featuresService={this.props.featuresService} channel={channel.data.name} popout={true} />
						</div>
					</div>
				</main>
			</Fragment>
		)
	}
}
export default connect(state => state)(ChatPage)