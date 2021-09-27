import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import format from 'date-fns/format';

import Image from '../Image';

import { Trans } from '@lingui/macro';

import * as actions from 'actions';

const API_URL = process.env.API_URL;
function ReplaysList(props){
	const dispatch = useDispatch();
	const authentication = useSelector(state => state.authentication);
	const channel = useSelector(state => state.channel);
	const darkMode = useSelector(state => state.site.mode === 'dark');
	const replays = useSelector(state => state.replays);

	useEffect(() => {
		dispatch(actions.fetchReplays(channel?.data?.name));
	}, [channel, dispatch]);

	const removeReplay = async (archive_id) => {	
		await fetch(API_URL + '/archive', {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${authentication.user.token}`,
			},
			method: 'DELETE',
			body: JSON.stringify({
				archive_id
			})
		})
		.then(response => response.json())
		.then(r => {
			console.log('removeReplay', r);
			replays = replays.filter(o => {
				console.log('replays filter', o);
				if(deleted){
					return parseInt(o.archive_id, 10) !== parseInt(archive_id, 10);
				}
				return true;
			});
		})
		.catch(error => console.error(error));
	};
	return (
		<>
			{
				replays
				&&
				replays.data
				&&
				replays.data.length > 0
				?
				replays.data.map((replay, i) => {
					return (
					<div key={`replay_${replay.archive_id}_${i}`} className={`flex w-33 flex-grow-1 flex-nowrap pa1 ${darkMode ? 'bg-near-black' : 'bg-white'} white`}>
						<a href={`/${channel.data.name}/replay/${replay.archive_id}`}>
							<Image src={replay.thumbnail} alt="Replay" shape="rounded" fit="contain" flexible lazyload />
						</a>
						<div className="pa2">
							<span className="f6 db link primary-50">
								<a href={`/${channel.data.name}/replay/${replay.archive_id}`} className="link color-inherit">{format(new Date(replay.time), 'PPPP')}</a>
							</span>
							<span className="f4 db link green">
								<a href={`/${channel.data.name}/replay/${replay.archive_id}`} className="link color-inherit">{replay.streamName}</a>
							</span>
							<a href={`/${channel.data.name}/replay/${replay.archive_id}`} className="link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--dark-green bg-dark-green guac-btn">Watch replay</a>
							{
							authentication &&
							authentication.user &&
							authentication.user.id === replay.user_id &&
							<a
								href="#"
								onClick={() => {removeReplay(replay.archive_id)}}
								className="link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--red bg-red guac-btn"
							>Delete replay</a>
						}
						</div>	
					</div>)
				})
				: (<Trans>No replays available.</Trans>)
			}
		</>
	);
}
export default ReplaysList;