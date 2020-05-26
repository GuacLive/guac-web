import React, {Component, Fragment} from 'react';

import { ToggleFeature } from '@flopflip/react-redux';

import dynamic from 'next/dynamic'

import GuacButton from '../components/GuacButton'

import {connect} from 'react-redux';

import * as actions from '../actions';

import { Trans } from '@lingui/macro'

import Link from 'next/link';

import Carousel from 'nuka-carousel';

let VideoPlayer = dynamic(
	() => import('../components/VideoPlayer'),
	{
		ssr: false,
		loading: () => <div className="w-100 h-100 bg-black white content-box" style={{'paddingTop': '56.25%'}} />
	}
);

const STREAMING_SERVER = 'eu';
class IndexPage extends Component {
	static async getInitialProps({store}){
		// we can dispatch from here too
		//store.dispatch({type: 'SET_FEATURED'});
		const { featured } = store.getState()
		console.log('featured1', featured);
		if(featured.loading){
			await store.dispatch(actions.fetchFeatured());
		}
		return {...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})};
    }

    renderStream = stream => {
		let videoJsOptions = { 
			autoplay: true,
			controls: true,
			sources: [],
			streamInfo: {
				username: stream.user.name,
				isChannel: false
			}
		};

		if(stream.live){
			if(stream.urls){
				// Prefer FLV if available, it has lower latency
				let flvUrl = stream.servers[STREAMING_SERVER] + stream.urls.flv;
				if(stream.urls.flv){
					videoJsOptions.sources.push({
						src: typeof window === 'object' && 'WebSocket' in window
							? `wss:${flvUrl}`
							: flvUrl,
						type: 'video/x-flv',
						label: STREAMING_SERVER + `(FLV)`
					});
				}
				// Only HLS has quality options
				Object.keys(stream.qualities).forEach((key) => {
					let urlKey = stream.qualities[key];
					videoJsOptions.sources.push({
						src: stream.servers[STREAMING_SERVER] + `/live/${stream.user.name}/index${urlKey}.m3u8`,
						type: 'application/x-mpegURL',
						label: STREAMING_SERVER + `(${key})`
					});
				});
			}
		}

    	return (
    		<div key={stream.user.id}>
    			<Link href="/c/[name]" as={`/c/${stream.name}`}>
    				<a className="link f4 b ma0 primary">
						<span className="i tracked b">{stream.name}</span> <Trans>is live</Trans>
					</a>
    			</Link>
				<VideoPlayer { ...videoJsOptions } live={stream.live}></VideoPlayer>
    		</div>
    	);
    }
    
    renderStreams = () => {
		if(this.props.featured.statusCode == 200
			&& this.props.featured.data
			&& this.props.featured.data.length > 0){
			return (
				<Carousel
					width="100%"
					initialSlideHeight={100}
					heightMode="max"
					className="w-100"
					slidesToShow={6}
					cellSpacing={20}
					asing="easeInQuad"
					slidesToScroll={5}
					dragging={true}
					wraparound={true}
					cellAlign={'center'}
					slideWidth={3}
					defaultControlsConfig={{
						nextButtonText: <i className="fa fa-arrow-right primary"></i>,
						prevButtonText: <i className="fa fa-arrow-left primary"></i>,
						pagingDotsStyle: {
						  fill: 'white'
						}
					  }}
				>
					{this.props.featured.data.map(this.renderStream)}
					</Carousel>
			);
		}
		return (
			<Trans>no streams are online</Trans>
		);
    }

	render() {
		const { featured } = this.props;
		if(featured.loading) return null;
		return (
			<Fragment>
				<div className="site-component-spotlight w-100 pv3 ph4-l mw9-l">
					<h3 className="f4 b ma0 mt0 mb3 ttu tracked primary"><Trans>Live streams</Trans></h3>
					{this.renderStreams()}
				</div>
				<ToggleFeature
					flag='guacWelcome'
				>
					<section className="ph4-l pv5">
						<article className="center-l br2 ba b--transparent bg-black-50">
							<div className="db w-100">
								<div className="pa3 pa4-ns db v-mid">
									<div>
										<h2 className="f2 tracked mt0 mb3"><Trans>Welcome to guac.live</Trans></h2>
										<span className="measure lh-copy mv0">
											<Trans>
											<p>
											Hi,<br/>
											Welcome to guac.live &mdash; live streaming platform. We are currently in beta.</p>
											<p>
											While we are in beta, streaming privileges will be given on a invite-only basis.
											<br />
											But, feel free to make an account and participate in the chat and general community!
											</p>
											</Trans>
										</span>
									</div>
								</div>
								{
									(!this.props.authentication.token)
									&&
									<div className="pa3 pa4-l db v-mid black">
										<GuacButton color="light-green" url="/auth/login"><Trans>Join</Trans></GuacButton>
									</div>
								}
								<div className="pa3 pa4-l db">
									<a href="https://discord.gg/k6MJSAj">
										<img src="https://discordapp.com/api/guilds/564909420199411732/widget.png?style=banner2" alt="Discord server invite image" />
										<span className="dn">Discord server invite</span>
									</a>
								</div>
							</div>
						</article>
					</section>
				</ToggleFeature>
			</Fragment>
		)
	}
}
export default connect(state => state)(IndexPage)