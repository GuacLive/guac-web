import React, {Component, Fragment, useEffect, useState, useMemo, useRef} from 'react'

import {useUpdateEffect} from 'react-use';

import Link from 'next/link'

import NextHead from 'next/head'

import dynamic from 'next/dynamic'

import { Trans, t } from '@lingui/macro';

import { useDispatch } from 'react-redux';

import prettyMilliseconds from 'pretty-ms';
import {
	Tooltip,
  } from 'react-tippy';
import Chat from 'components/Chat'

import GuacButton from 'components/GuacButton'

let VideoPlayer = dynamic(
	() => /* webpackChunkName: 'VideoPlayer' */import('components/VideoPlayer'),
	{
		ssr: false,
		loading: () => <div className="w-100 h-100 bg-black white content-box" style={{'paddingTop': '56.25%'}} />
	}
);

import {connect} from 'react-redux';

import io from 'socket.io-client/dist/socket.io.slim';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useRouter } from 'next/router';

import * as actions from 'actions';

import log from 'utils/log';
import Image from 'components/Image';

import Switch from 'react-switch';

import { ToggleFeature } from '@flopflip/react-redux';
import { useLingui } from '@lingui/react';

import { kFormatter } from 'utils';

import ReactMarkdown from 'components/ReactMarkdown';

const ReplaysList = dynamic(() => import('components/Replays/ReplaysList'));
const EditStreamPanel = dynamic(() => import('components/EditStreamPanel'));
const SubscriptionDialog = dynamic(() => import('components/SubscriptionDialog'));

const STREAMING_SERVER = 'eu';
const API_URL = process.env.API_URL;
const VIEWER_API_URL = process.env.VIEWER_API_URL;
function ChannelPage(props){
	const router = useRouter()
	const [tab, setTab] = useState(0);
	const [showModal, setShowModal] = useState(false);
	const [showSub, setShowSub] = useState(false);
	const [editPanelState, showEditPanel] = useState(false);

	const newPanelTitle = useRef('');
	const newPanelDescription = useRef('');

	const dispatch = useDispatch();
	const { i18n } = useLingui();

	const {
		channel,
		site,
		authentication
	} = props;
	let isMe = (authentication.user && authentication.user.id )
		&& 
		(channel.data && channel.data.user && channel.data.user.id === authentication.user.id);

	const addPanel = async (title, description) => {
		console.log('addPanel', title, description, newPanelTitle, newPanelDescription);
		await fetch(API_URL + '/panels', {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${authentication.user.token}`,
			},
			method: 'POST',
			body: JSON.stringify({
				title,
				description
			})
		})
		.then(response => response.json())
		.then(r => {
			console.log('addPanel result', r);
			dispatch(actions.fetchChannel(channel.data.name));
		})
		.catch(error => console.error(error));
	};

	const editPanel = async (i) => {
		var p = refs[i] && refs[i].current;
		var panel_id = p.dataset['id'];
	
		await fetch(API_URL + '/panels', {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${authentication.user.token}`,
			},
			method: 'POST',
			body: JSON.stringify({
				panel_id,
				title: p.title.value,
				description: p.description.value,
				delete: p.delete.checked
			})
		})
		.then(response => response.json())
		.then(r => {
			console.log('editPanel', r);
			// Remove panel
			if(p.delete.checked){
				props.channel.data.panels = props.channel.data.panels.filter(p => {
					return p.panel_id !== panel_id;
				})
			}
		})
		.catch(error => console.error(error));
	};

	useEffect(() => {
		const tabQuery = router.query.tab;
		if(!tabQuery) return;
		if(typeof tabQuery === 'string' ){
			switch(tabQuery){
				// Replays
				case 'replay':
				case 'replays':
				case 'archive':
				case 'archives':
					setTab(1);
					console.log(`replay tab`);
				break;
				// Failsafe
				default:
					setTab(0);
				break;
			}
		}
	}, [router.query])

	useEffect(() => {
		let channelAPISocket, didCancel = false;
		
		if(!didCancel){
			channelAPISocket = io(`${VIEWER_API_URL}/channel`);
			channelAPISocket.on('connect', () => {
				if(!channel || !channel.data || !channel.data.name) return;
				channelAPISocket.emit('join', {
					name: channel.data.name
				});
			});
			channelAPISocket.on('disconnect', () => {
				if(!channel || !channel.data || !channel.data.name) return;
				channelAPISocket.emit('leave', {
					name: channel.data.name
				});
			});
			channelAPISocket.on('reload', () => {
				window.location.reload();
			});
			channelAPISocket.on('redirect', (url) => {
				window.location = url;
			});
			channelAPISocket.on('live', (liveBoolean) => {
				console.log(`socket sent live: ${liveBoolean}`);
				setTimeout(async () => {
					try{
						dispatch(actions.fetchChannel(channel.data.name));
						// If no longer live, go out of theater mode
						if(!liveBoolean){
							document.documentElement.classList.remove('theater-mode');
						}
					}catch(e){}
				}, Math.floor(Math.random() * (4000 - 2500 + 1) + 2500));
			});
		}
		return function cleanup(){
			didCancel = true;
			if(channelAPISocket){
				channelAPISocket.emit('disconnect');
				channelAPISocket.removeAllListeners();
				channelAPISocket.off('connect');
				channelAPISocket.off('disconnect');
				channelAPISocket.disconnect();
			}
		};
	}, []);

	useUpdateEffect(() => {
		if(!showEditPanel){
			dispatch(actions.fetchChannel(channel.data.name));
		}
	}, [showEditPanel])
	
	const editStream = async e => {
		if(!channel || !channel.data || !channel.data.user) return false;
		setShowModal(!showModal);
		e.preventDefault();
	}

	const follow = async e => {
		e.preventDefault();
		if(!authentication || !authentication.token) return false;
		if(!channel || !channel.data || !channel.data.user) return false;
		dispatch(actions.followChannel(authentication.token, channel.data.user.id));
	}

    const renderStream = () => {
		let stream = props.channel.data;

		let videoJsOptions = { 
			autoplay: true,
			controls: true,
			sources: [],
			streamInfo: {
				viewer_user_id: authentication.user && authentication.user.id,
				title: stream.title,
				username: stream.user.name,
				isChannel: true
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
		let now = new Date().getTime();
		let liveAt = stream && stream.liveAt ? new Date(stream.liveAt) : 0;
    	return (
    		<Fragment key={stream.user.id}>
				<div className="site-component-channel__player">
					<VideoPlayer { ...videoJsOptions } live={stream.live}></VideoPlayer>
				</div>
				<div
					className="site-component-channel__info dib w-100 bt b--dark-gray"
					onMouseEnter={(e) => {
						if (e && e.target) e.target.classList.add('active');
					}}
					onMouseLeave={(e) => {
						if (e && e.target) e.target.classList.remove('active');
					}}
				>
					<div className="flex content-between">
						<div className="items-start flex flex-grow-1 flex-shrink-1 justify-start pa3">
							<div className="justify-center items-center flex-shrink-0">
								<Image
									src={stream.user.avatar || '//api.guac.live/avatars/unknown.png'}
									alt={stream.name}
									shape="squircle"
									fit="cover"
									className={`ba ${+stream.live ? 'b--red' : 'b--transparent'} v-mid w3 h3`}
								/>
							</div>
							<div className="ml2">
								<h2 className='f3 tracked ma0 dib primary items-center flex'>
									{stream.user.name}
									{stream.type == 'PARTNER' &&
										<Tooltip
											// options
											title={i18n._(t`Partnered`)}
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
										<span className="truncate b line-clamp-2" style={{wordWrap: 'break-word'}}>{stream.title}</span>
										<div>
											<Link href="/category/[id]" as={`/category/${stream.category_id}`}><a className="primary-50 hover-primary link">{stream.category_name}</a></Link>
										</div>
									</span>
								</div>
							</div>
						</div>
						<div className="flex flex-column flex-grow-0 flex-shrink-0 justify-start ma3">
							<div className="items-center flex flex-nowrap justify-end mb3">
								{stream.isFollowed && authentication.token && !stream.isMe && <GuacButton color="dark-gray" onClick={follow}><span className="white"><Trans>Following</Trans> ({kFormatter(stream.followers)})</span></GuacButton>}
								{!stream.isFollowed && authentication.token && !stream.isMe && <GuacButton color="dark-gray" onClick={follow}><span className="white"><Trans>Follow</Trans> ({kFormatter(stream.followers)})</span></GuacButton>}
								{
									!authentication.token
									&&
									<Tooltip
										// options
										title={i18n._(t`Create an account to follow this user`)}
										position="top"
										trigger="mouseenter"
										theme="transparent"
										style={{'display': 'flex !important'}}
									>
										<GuacButton color="dark-gray" onClick={follow}><span className="white"><Trans>Follow</Trans> ({kFormatter(stream.followers)})</span></GuacButton>
									</Tooltip>
								}
								<ToggleFeature flag="subscribeButton">
									{stream.subEnabled && <GuacButton color="green" onClick={(e) => {setShowSub(!showSub); e.preventDefault(); return true;}}><span className="white"><Trans>Subscribe</Trans></span></GuacButton>}
								</ToggleFeature>
								{isMe &&
									<GuacButton color="dark-gray" title="Edit stream" onClick={editStream}>
										<FontAwesomeIcon icon="edit" fixedWidth className="white" />
									</GuacButton>
								}
							</div>
							<div className="items-center flex justify-end ml3">
								<span className="inline-flex items-center mr3 red f6">
									{stream.live
										?
										<>
											<FontAwesomeIcon icon='user' fixedWidth />
											&nbsp;
											{props.channel.viewers ? props.channel.viewers.toString() : 0}
										</>
										: ''
									}
								</span>
								<span className="inline-flex items-center mr3 primary f6">
									{
									stream.live 
									&&
									stream.liveAt !== null
										?
										<>
											<FontAwesomeIcon icon='clock' />
											&nbsp;
											{
												prettyMilliseconds(now - liveAt, {
													unitCount: 3,
													formatSubMilliseconds: false,
													separateMilliseconds: false,
													secondsDecimalDigits: 0
												})
											}
										</>
										: ''
									}
								</span>
							</div>
						</div>
					</div>
				</div>
				{showSub && <SubscriptionDialog />}
				{showModal && <div className="db pa2 bg-black-50 primary"><EditStreamPanel /></div>}
				<div className="site-component-profile__tabs flex items-center" style={{height:'48px'}}>
					<a 
						href="#"
						onClick={(e) => {setTab(0);e&&e.preventDefault();return true;}}
						className={
							`flex items-center site-component-profile__tab ttu mr4 h-100 no-underline pointer bb ${tab == 0 ? 'primary b--gray' : 'gray b--transparent'} hover-primary link`
						}
					>
						<Trans>ABOUT</Trans>
					</a>
					<a 
						href="#"
						onClick={(e) => {setTab(1);e&&e.preventDefault();return true;}}
						className={
							`flex items-center site-component-profile__tab ttu mr4 h-100 no-underline pointer bb ${tab == 1 ? 'primary b--gray' : 'gray b--transparent'} hover-primary link`
						}
					>
						<Trans>REPLAYS</Trans>
					</a>
					<a 
						href="#"
						onClick={(e) => {setTab(2);e&&e.preventDefault();return true;}}
						className={
							`flex items-center site-component-profile__tab ttu mr4 h-100 no-underline pointer bb ${tab == 2 ? 'primary b--gray' : 'gray b--transparent'} hover-primary link`
						}
					>
						<span><Trans>FOLLOWERS</Trans> &middot; {channel.data.followers}</span>
					</a>
					<a 
						href="#"
						onClick={(e) => {setTab(3);e&&e.preventDefault();return true;}}
						className={
							`flex items-center site-component-profile__tab ttu mr4 h-100 no-underline pointer bb ${tab == 3 ? 'primary b--gray' : 'gray b--transparent'} hover-primary link`
						}
					>
						<span><Trans>FOLLOWING</Trans> &middot; 0</span>
					</a>
				</div>
				{
					tab == 0 &&
					<div className="site-component-panels flex flex-wrap justify-center w-100">
						{
							isMe
							&&
							<div className="db w-100 mt2 mr2 mb2 word-wrap">
								<div className="flex primary">
									<Switch
										onChange={() => showEditPanel(!editPanelState)}
										onColor="#19a974"
										checked={editPanelState}
										uncheckedIcon={<span></span>}
										className="flex-column"
									/>
									<span className="ml2"><Trans>Edit panels</Trans></span>
								</div>
							</div>
						}
						{
							stream
							&&
							stream.panels
							&&
							editPanelState
							&&
							isMe
							&&
							<form onSubmit={e => e.preventDefault()} className="db w-100 w-third-ns mr1 mb1 word-wrap">
								<label htmlFor="title" className="primary"><Trans>Title</Trans>:</label>
								<input ref={newPanelTitle} name="title" type="text" className="input-reset bn pa3 w-100 bg-white br2" placeholder={i18n._(t`Title`)} />

								<label htmlFor="description" className="primary"><Trans>Description</Trans>:</label>
								<textarea ref={newPanelDescription} name="description" rows="10" className="input-reset bn pa3 w-100 bg-white br2" placeholder={i18n._(t`Description`)} />

								<input type="submit" value={i18n._(t`Add panel`)} onClick={() => addPanel(newPanelTitle.current.value, newPanelDescription.current.value)} className="link color-inherit db pv2 ph3 nowrap lh-solid pointer br2 ba b--green bg-green ml1" />
							</form>
						}
						{
							stream
							&&
							stream.panels
							&&
							editPanelState
							&&
							isMe
							&&
							stream.panels.map((panel, i) => {
								return (
									<form key={`editpanel_${panel.panel_id}_${i}`} ref={refs[i]} data-id={panel.panel_id} onSubmit={e => e.preventDefault()} className="db w-100 w-third-ns mr1 mb1 word-wrap">
										<label htmlFor="title" className="primary"><Trans>Title</Trans>:</label>
										<input name="title" type="text" className="input-reset bn pa3 w-100 bg-white br2" defaultValue={panel.title} placeholder={i18n._(t`Title`)} />

										<label htmlFor="description" className="primary"><Trans>Description</Trans>:</label>
										<textarea name="description" rows="10" className="input-reset bn pa3 w-100 bg-white br2" defaultValue={panel.description} placeholder={i18n._(t`Description`)} />

										<label htmlFor="delete" className="primary"><Trans>Delete</Trans>:</label>
										<input name="delete" type="checkbox" />

										<input type="submit" value={i18n._(t`Edit panel`)} onClick={() => editPanel(i)} className="link color-inherit db pv2 ph3 nowrap lh-solid pointer br2 ba b--green bg-green ml1" />
									</form>
								);
							})
						}
						{
							stream
							&&
							stream.panels
							&&
							!editPanelState
							&&
							stream.panels.map((panel, i) => {
								return (
									<div key={`panel_${panel.panel_id}_${i}`} className="site-component-panels__panel db w-100 w5-l mr3 mb3">
										<span className="f2 primary tracked word-wrap">{panel.title}</span>
										<ReactMarkdown className="mt1 primary word-wrap" source={panel.description} />
									</div>
								);
							})
						}
					</div>
				}
				{
					tab == 1 &&
					<div className="site-component-replays flex flex-wrap justify-center w-100 primary">
						<ReplaysList />
					</div>
				}
				{
					tab == 2 &&
					<div className="site-component-followers flex flex-wrap justify-center w-100 primary">
					</div>
				}
				{
					tab == 3 &&
					<div className="site-component-following flex flex-wrap justify-center w-100 primary">
					</div>
				}
    		</Fragment>
    	);
	}
	
	function renderBan(){
		let stream = props.channel.data;
		return (
			<Fragment key={stream.user.id}>
				<div className="site-component-banned flex flex-column flex-wrap w-100">
					<h3 className="f3 red ma0"><Trans>User has been banned</Trans></h3>
					<img src="https://cdn.frankerfacez.com/emoticon/269642/4" className="db w4" />
					<p className="primary">
						{stream.user.name}&nbsp;<Trans>has been banned from the site.</Trans>
					</p>
				</div>
			</Fragment>
		);
	}

	var refs = useMemo(
		() => Array.from({
			length: channel.data && channel.data.panels ? channel.data.panels.length : 0
		}).map(() => React.createRef()),
		[]
	);
	if(channel.loading) return (<Trans>Loading...</Trans>);
	if(!channel.data) return (<Trans>Channel not found</Trans>);
	if(channel.error) throw channel.error;

	const meta = [
		{property: 'og:title', content: `${channel.data.name} &middot; guac.live`},
		{property: 'og:description', content: `Watch ${channel.data.name} stream ${channel.data.category_name} on guac`},
		{property: 'og:image', content: channel.data.user.avatar || '//guac.live/img/header-logo.png'},
		{name: 'author', content: channel.data.name},
		{name: 'description', content: `Watch ${channel.data.name} stream ${channel.data.category_name} on guac`},
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
		});
	}

	let followed = site.myFollowed && site.myFollowed.find((u) => {
		return u && u.to_id === channel.data.user.id;
	});

	let isFollowed;
	channel.isFollowing = followed && followed.to_id === channel.data.user.id;
	isFollowed = channel.data.isFollowed = channel.isFollowing;
	channel.data.isMe = isMe;

	return (
		<Fragment>
			<NextHead>
				<title>{channel.data.name} &middot; guac.live</title>
				{ meta && meta.map((m, i) => {
					return m.name ? 
					(
						<meta name={m.name} content={m.content} key={m.name} />
					) :
					(
						<meta property={m.property} content={m.content} key={m.property} />
					);
				})}
			</NextHead>
			<div className="w-100 min-vh-100 flex flex-nowrap black">			
				<div className="site-component-channel w-100 w-70-ns h-100 flex flex-column flex-grow-1 overflow-hidden relative">
						{
						channel 
						&&
						channel.data
						&&
						channel.data.user
						&&
						channel.data.user.banned
						?
						renderBan()
						:
						renderStream()
					}
				</div>
				<aside className="site-component-chat flex flex-nowrap">
					{
						channel
						&&
						channel.data
						&&
						channel.data.user
						&&
						channel.data.user.banned
						?
						null
						:
						(<Chat channel={channel.data.name} />)
					}
				</aside>
			</div>
		</Fragment>
	)
}
ChannelPage.getInitialProps = async ({store, query}) => {
	log('info', 'Channel', query.name);
	await store.dispatch(actions.fetchChannel(query.name));
	return {...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})};
};

export default connect(state => state)(ChannelPage)