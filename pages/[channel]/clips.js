import React, {Component, Fragment, useRef, useEffect, useCallback, useState} from 'react';

import { connect, useSelector } from 'react-redux';

import { Trans } from '@lingui/macro';

import format from 'date-fns/format';

import Spinner from 'react-svg-spinner';

import NextHead from 'next/head';

import dynamic from 'next/dynamic';

import { debounce } from 'underscore';

import Modal from 'react-modal';

import * as actions from '../../actions';

let VideoPlayer = dynamic(
	() => /* webpackChunkName: 'VideoPlayer' */import('components/VideoPlayer'),
	{
		ssr: false,
		loading: () => <div className="w-100 h-100 bg-black white content-box" style={{'paddingTop': '56.25%'}} />
	}
);

const API_URL = process.env.API_URL;

Modal.setAppElement('#__next');
function ClipsPage(props) {
	var clips = props.clips;
	var currentPage = useRef(1);
	var lastPage = clips?.pagination?.lastPage;

	const [isFetching, setIsFetching] = useState(false);
	const nextClips = useState([]);

	const authentication = useSelector(state => state.authentication);
	const darkMode = useSelector(state => state.site.mode === 'dark');
	const channel = useSelector(state => state.channel);

	let [videoJsOptions, setVideoJsOptions] = useState({});
	const [clipModalIsOpen, setClipModalIsOpen] = useState(false);
	function openClipModal(clip){
		console.log('openClipModal', clip);
		if(clip){
			setVideoJsOptions({ 
				autoplay: true,
				controls: true,
				banner: '/img/blank.png',
				sources: clip.video_url ? [{
					src: clip.video_url + '?clip=true',
					type: 'video/mp4',
					label: 'MP4'
				}] : [],
				streamInfo: {
					title: clip.clip_name,
					username: clip.name,
					isChannel: false
				}
			});
		}
		setClipModalIsOpen(true);
	}

    // Create ref to attach to the loader component
    const loader = useRef(null);

	const fetchClips = useCallback(async () => {
		setIsFetching(true);
		currentPage.current = clips.pagination.currentPage + 1;
		if(currentPage.current > lastPage){
			return null;
		}
		await fetch(`${API_URL}/clips/${channel.data.name}?page=${currentPage.current}`, {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		})
		.then(response => response.json())
		.then(r => {
			clips.pagination = r.pagination;
			r.data.forEach((c) => {
				clips.data.push(c);
			})
			setIsFetching(false);
		});
	}, [clips, channel.data.name, lastPage]);

    const loadMore = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting && nextClips) {
            !isFetching && debounce(fetchClips, 700)()
        }
    }, [isFetching, nextClips, fetchClips]);

    useEffect(() => {
		const l = loader;
        const options = {
            root: null, // window by default
            rootMargin: '0px',
            threshold: 0.25
        };

        // Create observer
        const observer = new IntersectionObserver(loadMore, options);

        // observer the loader
        if (loader && loader.current) {
            observer.observe(loader.current);
        }

        // clean up on willUnMount
        return () => {if(l && l.current) observer.unobserve(l.current);}
    }, [loader, loadMore]);

	return (
		<Fragment>
			<NextHead>
				<title>{channel?.data?.name} &middot; guac.live</title>
			</NextHead>
			<Modal
				isOpen={clipModalIsOpen}
				onRequestClose={() => setClipModalIsOpen(false)}
				contentLabel="Clip"
				style={{
					overlay: {
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
						zIndex: '9999'
					},
					content: {
						top: '50%',
						left: '50%',
						right: 'auto',
						bottom: 'auto',
						marginRight: '-50%',
						transform: 'translate(-50%, -50%)',
						background: 'var(--modal-background)',
						borderColor: 'transparent',
						borderRadius: '4px'
					}
				}}
			>
				<div style={{
					'width': '80vw'
				}}>
					<a className="link absolute primary z-4 w2 h2 pointer" style={{
						right: 0,
						top: 0
					}} onClick={() => setClipModalIsOpen(false)}>X</a>
					<div className="flex items-center justify-center">
						<VideoPlayer {...videoJsOptions} replay={true} live={false} />
					</div>
				</div>
			</Modal>
			<div className="w-100 pv3 ph3-l">
				<h2 className="f2 tracked mt0 mb3"><Trans>{channel.data.name}&apos;s Clips</Trans></h2>
				<div className="site-component-clips flex flex-row flex-wrap w-100" style={{flexGrow: 1}}>
					{clips.data && clips.data.map(clip => {
						return (
							<div key={`replay_${clip.uuid}`} className={`flex w-33 flex-grow-1 flex-nowrap pa1 ${darkMode ? 'bg-near-black' : 'bg-white'} white`}>
								<div className="pa2">
									<span className="f6 db link primary-50">
										<a onClick={() => openClipModal(clip)} className="link color-inherit">{format(new Date(clip.time), 'PPpp')}</a>
									</span>
									<span className="f4 db link green">
										<a onClick={() => openClipModal(clip)} className="link color-inherit">{clip.clip_name}</a>
									</span>
									<a onClick={() => openClipModal(clip)} className="link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--dark-green bg-dark-green guac-btn">Watch clip</a>
									{
									authentication &&
									authentication.user &&
									(
										authentication.user.id === clip.clipper_id ||
										authentication.user.name === channel?.data?.name
									) &&
									<a
										href="#"
										onClick={() => {}}
										className="link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--red bg-red guac-btn"
									>Delete clip</a>
								}
								</div>	
							</div>
						);
					})}
					{
						clips.pagination
						&&
						lastPage !== currentPage.current
						&&
						<div style={{
							'width': '100%',
							'height': '70px',
							'display': 'flex',
							'justify-content': 'center',
							'align-items': 'center',
						}} ref={loader}>{isFetching && <Spinner color="white" size="64px" thickness={2}/>}</div>
					}
				</div>
			</div>
		</Fragment>
	)
}
ClipsPage.getInitialProps = async (ctx) => {
	const { store, query } = ctx;
	let clips;
	
	if(!query || !query.channel){
		return {notfound: true};
	}
	await store.dispatch(actions.fetchChannel(query.channel));

	await fetch(`${API_URL}/clips/${query.channel}?page=1`, {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	})
	.then(response => response.json())
	.then(r => {
		clips = r;
	});
	return {...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}), clips};
};
export default connect(state => state)(ClipsPage)