import React, {Fragment, useEffect, useState} from 'react'

import NextHead from 'next/head'

import { useRouter } from 'next/router'

import {connect} from 'react-redux';

import { Trans } from '@lingui/macro';

import Link from 'next/link';

import { callApi } from 'services/api';

import dynamic from 'next/dynamic';

let VideoPlayer = dynamic(
	() => /* webpackChunkName: 'VideoPlayer' */import('components/VideoPlayer'),
	{
		ssr: false,
		loading: () => <div className="w-100 h-100 bg-black white content-box" style={{'paddingTop': '56.25%'}} />
	}
);

function ReplayPage(props){
	const router = useRouter()
	const { id } = router.query;
	const [replay, setReplay] = useState(false);
	const [is404, setIs404] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			await callApi(`/getArchive/${id}`)
			.then(response => response.json())
			.then((res) => {
				if(res && res.data){
					setReplay(res.data);
				}else{
					setReplay(false);
					setIs404(true);
				}
			})
			.catch((err) => {
				console.error(err);
			});
		}
		fetchData();
	}, []);

	let videoJsOptions = {};
	if(replay){
		videoJsOptions = { 
			autoplay: true,
			banner: replay.thumbnail,
			controls: true,
			sources: replay.stream ? [{
				src: replay.stream + '?archive=true',
				type: 'application/x-mpegURL',
				label: 'HLS'
			}] : [],
			streamInfo: {
				title: replay.streamName,
				username: replay.username,
				isChannel: false
			}
		};
	}
	return (
		<>
			{
				replay
				? (
					<Fragment>
						<div className={`w-100 min-vh-100 flex flex-nowrap black`}>			
							<div className="site-component-channel w-100 h-100 flex flex-column flex-grow-1 relative">
								<div>
									<div className="site-component-channel__player">
										<VideoPlayer {...videoJsOptions} live={false}></VideoPlayer>
									</div>
									<div className="dn flex-ns content-between">
											<div className="items-start flex flex-grow-1 flex-shrink-1 justify-start pa3">
												<div className="ml2">
													<h2 className='f3 tracked ma0 dib primary items-center flex'>
														<Link href="/[channel]" as={`/${replay.username}`}><a className="primary link">{replay.username}</a></Link>
													</h2>
													<div className="flex flex-column mb3 mt2">
														<span className="f5 primary">
															<span className="truncate b line-clamp-2" style={{wordWrap: 'break-word'}} title={replay.streamName}>{replay.streamName}</span>
															<div>
																<span className="primary-50">{replay.time}</span>
															</div>
														</span>
													</div>
												</div>
											</div>
										</div>
								</div>
								<span className="primary">{JSON.stringify(replay)}</span>
							</div>
						</div>
					</Fragment>
				) : is404 ? (
					<Fragment>
						<NextHead>
							<title>guac.live &middot; Replay not found</title>
						</NextHead>
						<div className="flex flex-column justify-center items-center w-100 h-100 tc" style={{
							flex: '1',
							minHeight: '220px'
						}}>
							<em className="lh-title primary w5 f3 fw7 fs-normal"><Trans>Uh Ohhh...</Trans></em>
							<p className="lh-copy primary-80 f5 tc pv2"><Trans>The replay you were looking for does not exist.</Trans></p>
							<a className="link white inline-flex items-center justify-center tc mw4 pv2 ph3 nowrap lh-solid pointer br2 ba b--transparent bg-dark-gray guac-btn"
								href="#"
								onClick={() => router.back()}>
								<Trans>Go back</Trans>
							</a>
						</div>
					</Fragment>
				) : (<span><Trans>Loading...</Trans></span>)
			}
		</>
	);
}
export default connect(state => state)(ReplayPage)