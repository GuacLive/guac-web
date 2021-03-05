import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import format from 'date-fns/format';

import Image from '../Image';

import { Trans } from '@lingui/macro';

import * as actions from 'actions';
function ReplaysList(props){
	const dispatch = useDispatch();
	const channel = useSelector(state => state.channel);
	const darkMode = useSelector(state => state.site.mode === 'dark');

	useEffect(() => {
		dispatch(actions.fetchReplays(channel && channel.data && channel.data.name));
	}, []);

	// Redux
	const replays = useSelector(state => state.replays);
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
					<div className={`flex w-33 flex-grow-1 flex-nowrap pa1 ${darkMode ? 'bg-near-black' : 'bg-white'} white`}>
						<a href={replay.stream}>
							<a><Image src={replay.thumbnail} shape="rounded" fit="contain" flexible lazyload /></a>
						</a>
						<div className="pa2">
							<span className="f6 db link primary-50">
								<a href={replay.stream} className="link color-inherit">{format(new Date(replay.time), 'PPPP')}</a>
							</span>
							<span className="f4 db link green">
								<a href={replay.stream} className="link color-inherit">{replay.streamName}</a>
							</span>
							<a href={replay.stream} className="link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--dark-green bg-dark-green guac-btn">Watch replay</a>
						</div>	
					</div>)
				})
				: (<Trans>No replays available.</Trans>)
			}
		</>
	);
}
export default ReplaysList;