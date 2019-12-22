import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Image from '../Image';

import log from '../../utils/log';

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
					<div className="flex w-25 flex-grow-1 flex-nowrap pa1 bg-near-black white">
						<span className="f5 b">{replay.title}</span>
					</div>
				})
			}
		</>
	);
}
export default ReplaysList;