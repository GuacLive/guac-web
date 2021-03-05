import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import format from 'date-fns/format';

import Link from 'next/link'

import Image from '../Image';

import { Trans } from '@lingui/macro';

import * as actions from 'actions';
function ReplaysList(props){
	const dispatch = useDispatch();
	const channel = useSelector(state => state.channel);

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
					<div className="flex w-33 flex-grow-1 flex-nowrap pa1 bg-near-black white">
						<Link href={replay.stream}>
							<a><Image src={replay.thumbnail} shape="rounded" fit="contain" flexible lazyload /></a>
						</Link>
						<div className="pa2">
							<span className="f5 db link green">
								<Link href={replay.stream}>
									<a className="link color-inherit">{format(stream.time, 'LLLL')}</a>
								</Link>
							</span>
							<GuacButton url={replay.stream} color="dark-green">Watch replay</GuacButton>
						</div>	
					</div>
				})
				: (<Trans>No replays available.</Trans>)
			}
		</>
	);
}
export default ReplaysList;