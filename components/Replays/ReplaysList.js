import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import moment from 'moment';

import Image from '../Image';

import * as actions from '../../actions';
function ReplaysList(props){
	const dispatch = useDispatch();

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
				replays.data.map((replay, i) => {
					<div className="flex w-33 flex-grow-1 flex-nowrap pa1 bg-near-black white">
						<Link href={replay.stream}>
							<a><Image src={replay.thumbnail} shape="rounded" fit="contain" flexible lazyload /></a>
						</Link>
						<div className="pa2">
							<span className="f5 db link green">
								<Link href={replay.stream}>
									<a className="link color-inherit">{moment(stream.time).format('LLLL')}</a>
								</Link>
							</span>
							<GuacButton url={replay.stream} color="dark-green">Watch replay</GuacButton>
						</div>	
					</div>
				})
			}
		</>
	);
}
export default ReplaysList;