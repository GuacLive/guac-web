import React, {Component, Fragment} from 'react';

import { ToggleFeature } from '@flopflip/react-redux';

import dynamic from 'next/dynamic'

import GuacButton from '../components/GuacButton'

import {connect, useDispatch} from 'react-redux';

import * as actions from '../actions';

import { Trans } from '@lingui/macro'

import Link from 'next/link';

import Chat from '../components/Chat';

let VideoPlayer = dynamic(
	() => import('../components/VideoPlayer'),
	{
		ssr: false,
		loading: () => <div className="w-100 h-100 bg-black white content-box" style={{'paddingTop': '56.25%'}} />
	}
);
const STREAMING_SERVER = 'eu';
function IndexPage(props){
	const dispatch = useDispatch();
    const renderStream = stream => {
		let videoJsOptions = { 
			autoplay: true,
			controls: true,
			sources: [],
			streamInfo: {
				title: stream.title,
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
						label: 'Source (FLV)'
					});
				}
				if(stream.urls.hls){
					videoJsOptions.sources.push({
						src: `${stream.servers[STREAMING_SERVER]}${stream.urls.hls}`,
						type: 'application/x-mpegURL',
						label: 'Auto (HLS)'
					});
				}
				// Only HLS has quality options
				Object.keys(stream.qualities).forEach((key) => {
					let urlKey = stream.qualities[key];
					videoJsOptions.sources.push({
						src: stream.servers[STREAMING_SERVER] + `/live/${stream.user.name}/index${urlKey}.m3u8`,
						type: 'application/x-mpegURL',
						label: `${key} (HLS)`
					});
				});
			}
		}

    	return (
			<div key={stream.user.id} className="bg-black-50 primary flex flex-wrap justify-end w-90">
				<div className="flex-grow-1 self-center h-100">
					<div className="flex flex-row flex-grow-1">
						<Link href="/c/[name]" as={`/c/${stream.name}`}>
							<a className="link f4 b ma0 primary">
								<span className="tracked b">{stream.name}</span>
							</a>
						</Link>
					</div>
					<VideoPlayer { ...videoJsOptions } live={stream.live} fill={true}></VideoPlayer>
				</div>
				<div className="flex flex-shrink-1">
					{!channel.loading && <Chat channel={stream.name} />}
				</div>
    		</div>
    	);
    }
    
    const renderTopStream = (stream) => {
		if(stream){
			return renderStream(stream);
		}
		return (
			<Trans>no streams are online</Trans>
		);
    }
    
    const renderStreams = (streams) => {
		if(streams.statusCode == 200
			&& streams.data
			&& streams.data.length > 0){
			console.log('renderStreams', streams);
			return (
				<div className="w-100 flex flex-wrap">
					{streams.data.map((channel) => {
						return (
						<div key={`featured_streams_${channel.user.id}`} className="pa2 w-third-l w-100">
							<div className="w-100 flex flex-column bg-bar">
								<div className="pa2 w-100 flex flex-row justify-between items-center">
									<div className="flex items-center">
										<div className="w3 h3 mr3 ba bw1 b--green bg-center cover br-100" style={{'backgroundImage': `url(${channel.user.avatar || '//api.guac.live/avatars/unknown.png'}`}}></div>
										<div className="flex flex-column">
											<Link href="/c/[name]" as={`/c/${channel.name}`}>
												<a className="link white f4">{channel.name}</a>
											</Link>
											<Link href="/category/[id]" as={`/category/${channel.category_id}`}>
												<a className="link white f5 mt2"><i className="fa fa-gamepad"></i> {channel.category_name}</a>
											</Link>
										</div>
									</div>
									<div className="flex flex-column">
										<GuacButton color="green" url={`/c/${channel.name}`}><Trans>Watch</Trans></GuacButton>
									</div>
								</div>
								<div className="w-100">
									<div className="aspect-ratio aspect-ratio--16x9">
										<div className="flex flex-column justify-between aspect-ratio--object bg-center cover">
											<Link href="/c/[name]" as={`/c/${channel.name}`}>
												<a className="link white pa2 w-100 flex justify-between f4 bg-black-70">{channel.title}</a>
											</Link>
											<div className="w-100 flex justify-between ph2 pt4 pb2 f5 grad-bot">
												<span className="pv1 ph2 bg-black white br2"><i className="fa fa-circle red"></i> Live</span>
												<span className="pv1 ph2 bg-black white br2"><i className="fa fa-eye"></i> {channel.viewers}</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						);
					})}
				</div>
			);
		}
		return null
	}

	const {channel, featured} = props;
	if (featured.loading) return null;

	/*if (channel.loading && featured.data && featured.data[0]) {
		dispatch(actions.fetchChannel(featured.data[0].name));
		return null;
	}*/
	return (
		<Fragment>
			<div className="site-component-spotlight justify-center flex flex-row pa2 w-100">
				{featured.statusCode == 200
				&& featured.data
				&& featured.data.length > 0
				? renderTopStream(featured.data[0]) : null
			}
			</div>
			<div className="site-component-popular w-100 pa2 relative bg-black-20">
				<h3 className="ma0 pa3"><Trans>Popular channels</Trans> <Link href="/channels"><a className="ml3 ph3 pv1 link primary-80 bg-black-30 20"><Trans>More</Trans> <small className="fa fa-chevron-right"></small></a></Link></h3>
				{renderStreams(featured)}
			</div>
			<ToggleFeature
				flag='guacWelcome'
			>
				<section className="ph4-l pv5">
					<article className="center-l br2 ba b--transparent bg-black-40">
						<div className="db w-100">
							<div className="pa3 pa4-ns db v-mid">
								<div>
									<h2 className="f2 tracked mt0 mb3"><Trans>Welcome to guac.live</Trans></h2>
									<span className="measure lh-copy mv0">
										<Trans>
											<p>
												Hi,<br />
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
								(!props.authentication.token)
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
};
IndexPage.getInitialProps = async ({store}) => {
	// we can dispatch from here too
	//store.dispatch({type: 'SET_FEATURED'});
	const { channel, featured } = store.getState()
	console.log('featured1', featured);
	if(featured.loading){
		await store.dispatch(actions.fetchFeatured());
	}
	try{
		await store.dispatch(actions.fetchChannel(store.getState().featured.data[0].name));
	}catch(e){}
	return {...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})};
}
export default connect(state => state)(IndexPage)