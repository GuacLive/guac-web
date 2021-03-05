import React, {Component, Fragment} from 'react';

import dynamic from 'next/dynamic'

import GuacButton from '../components/GuacButton'

import {connect, useDispatch} from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as actions from '../actions';

import { Trans, t } from '@lingui/macro'

import Link from 'next/link';
import Image from '../components/Image';

import FeaturesService from 'utils/FeaturesService';

let Chat = dynamic(
	() => import('../components/Chat')
);

let VideoPlayer = dynamic(
	() => import('../components/VideoPlayer'),
	{
		ssr: false,
		loading: () => <div className="w-100 h-100 bg-black white content-box" style={{'paddingTop': '56.25%'}} />
	}
);
import {
	Tooltip,
} from 'react-tippy';
function IndexPage(props){
	const dispatch = useDispatch();
    const renderStream = stream => {
		let videoJsOptions = { 
			autoplay: true,
			controls: true,
			sources: [],
			fill: true,
			streamInfo: {
				title: stream.title,
				username: stream.user.name,
				isChannel: false
			}
		};
		
		if(stream.live){
			if(stream.urls){
				// Prefer FLV if available, it has lower latency
				let flvUrl = `${stream.streamServer}${stream.urls.flv}`;
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
						src: `${stream.streamServer}${stream.urls.hls}`,
						type: 'application/x-mpegURL',
						label: 'Auto (HLS)'
					});
				}
				// Only HLS has quality options
				Object.keys(stream.qualities).forEach((key) => {
					let urlKey = stream.qualities[key];
					videoJsOptions.sources.push({
						src: stream.streamServer + `/live/${stream.user.name}/index${urlKey}.m3u8`,
						type: 'application/x-mpegURL',
						label: `${key} (HLS)`
					});
				});
			}
		}

    	return (
			<div key={'stream_' + stream.user.id} className="bg-black-50 primary flex flex-wrap justify-end w-90">
				<div className="flex-grow-1 self-center h-100 relative">
					<VideoPlayer { ...videoJsOptions } live={stream.live}></VideoPlayer>
					<div className="live-info dn flex-ns content-between">
						<div className="items-start flex flex-grow-1 flex-shrink-1 justify-start pa3">
							<Link href="/[channel]" as={`/${stream.user.name}`}>
								<a className="justify-center items-center flex-shrink-0">
									<div className="relative v-mid w3 h3">
										<Image
											src={stream.user.avatar || '//api.guac.live/avatars/unknown.png'}
											alt={stream.name}
											shape="squircle"
											fit="cover"
											className={`ba ${+stream.live ? 'b--red' : 'b--transparent'} v-mid`}
										/>
									</div>
								</a>
							</Link>
							<div className="ml2">
								<h2 className='f3 tracked ma0 dib primary items-center flex'>
									<Link href="/[channel]" as={`/${stream.user.name}`}><a className="primary link">{stream.user.name}</a></Link>
									{stream.type == 'PARTNER' &&
										<Tooltip
											// options
											title={t`Partnered`}
											position="right"
											trigger="mouseenter"
											theme="transparent"
											style={{'display': 'flex !important'}}
										>
											<FontAwesomeIcon icon='check-circle' fixedWidth className="f5" />
										</Tooltip>
									}
								</h2>
								<div className="flex flex-column mb3 mt2">
									<span className="f5 primary">
										<span className="truncate b line-clamp-2" style={{wordWrap: 'break-word'}} title={stream.title}>{stream.title}</span>
										<div>
											<Link href="/category/[id]" as={`/category/${stream.category_id}`}><a className="primary-50 hover-primary link">{stream.category_name}</a></Link>
										</div>
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="dn flex-l flex-shrink-1">
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
										<div className="w3 h3 mr3 ba bw1 b--green bg-center cover br-100" style={{'backgroundImage': `url(${channel.user.avatar}`}}></div>
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
										<GuacButton color="green" url={`/${channel.name}`}><Trans>Watch</Trans></GuacButton>
									</div>
								</div>
								<div className="w-100">
									<div className="aspect-ratio aspect-ratio--16x9">
										<div className="flex flex-column justify-between aspect-ratio--object bg-center cover" style={{'backgroundImage': `url(${channel.thumbnail}`}}>
											<Link href="/[channel]" as={`/${channel.name}`}>
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

	const renderCategories = (categories) => {
		if(categories.statusCode == 200
			&& categories.data
			&& categories.data.length > 0){
				categories.data = categories.data.slice(0, 6);
			return (
				<div className="w-100 flex flex-wrap">
					{categories.data.map((category) => {
						return (
							<Link key={`category_${category.category_id}`} href={`/category/[id}`} href={`/category/${category.category_id}`}>
								<a className="flex flex-column flex-grow-0 flex-shrink-0 overflow-hidden w5 pa2 no-underline" key={`category_${category.category_id}`}>
									<div className="item-preview aspect-ratio aspect-ratio--16x9 z-1">
										<Image alt={category.name} src={category.cover ? category.cover : `/img/categories/${category.category_id}.jpg`} width={600} height={400} className="aspect-ratio--object" shape="rounded" fit="cover" priority={true} />
									</div>
									<div className="flex flex-grow-1 flex-shrink-1 mt2">
										<span className="f3 db link green truncate">{category.name}</span>
									</div>
								</a>
							</Link>
						);
					})}
				</div>
			);
		}
		return null;
	};

	var featuresService = new FeaturesService(props.featuresService.features);
	const {categories, channel, featured } = props;
	if (featured.loading) return null;
	if (categories.loading) return null;

	/*if (channel.loading && featured.data && featured.data[0]) {
		dispatch(actions.fetchChannel(featured.data[0].name));
		return null;
	}*/
	return (
		<Fragment>
			{
				featuresService &&
				featuresService.checkOnGlobalFeatures('guacWelcome') &&
				<section className="pv3 ml-auto mr-auto db-l dn">
					<article className="flex flex-row pa2 relative bg-dark-green ba b--transparent br3">
						<div className="ph3 ph4-ns flex flex-column" style={{
							flex: '50%'
						}}>
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
								{
									(!props.authentication || !props.authentication.token)
									&&
									<div className="db v-mid white">
										<GuacButton color="black" url="/auth/login"><Trans>Join</Trans></GuacButton>
									</div>
								}
							</div>
						</div>
						<div className="ph3 ph4-ns flex flex-row justify-end self-start h-100 v-mid">
							<a href="https://discord.gg/k6MJSAj">
								<img src="https://discordapp.com/api/guilds/564909420199411732/widget.png?style=banner3" alt="Discord server invite image" />
								<span className="dn">Discord server invite</span>
							</a>
						</div>
					</article>
				</section>
			}
			{featured.statusCode == 200
				&& featured.data
				&& featured.data.length > 0
				? <div className="site-component-spotlight justify-center flex flex-row pa2 w-100">
				{renderTopStream(featured.data[0]) }
				</div>
			: null}
			<div className="site-component-popular w-100 pa2 relative bg-black-20">
				<h3 className="ma0 pa3"><Trans>Popular live channels</Trans> <Link href="/channels"><a className="ml3 ph3 pv1 link primary-80 bg-black-30 20"><Trans>More</Trans> <small className="fa fa-chevron-right"></small></a></Link></h3>
				{renderStreams(featured)}
			</div>
			<div className="site-component-popular w-100 pa2 relative">
				<h3 className="ma0 pa3"><Trans>Popular categories</Trans> <Link href="/categories"><a className="ml3 ph3 pv1 link primary-80 bg-black-30 20"><Trans>More</Trans> <small className="fa fa-chevron-right"></small></a></Link></h3>
				{renderCategories(categories)}
			</div>
		</Fragment>
	)
};
IndexPage.getInitialProps = async ({store}) => {
	// we can dispatch from here too
	//store.dispatch({type: 'SET_FEATURED'});
	const { categories, featured } = store.getState()
	console.log('featured1', featured);
	//if(categories.loading){
		await store.dispatch(actions.fetchCategories());
	//}
	//if(featured.loading){
		await store.dispatch(actions.fetchFeatured());
	//}
	try{
		await store.dispatch(actions.fetchChannel(store.getState().featured.data[0].name));
	}catch(e){}
	return {...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})};
}
export default connect(state => state)(IndexPage)