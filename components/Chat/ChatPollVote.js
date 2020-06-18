import React, {useState, useRef} from 'react';

import {useLingui} from "@lingui/react"
import {Trans, t} from '@lingui/macro';

import {useClickAway, useInterval, useUnmount} from 'react-use';

import GuacButton from '../GuacButton';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

function ChatPollVote(props) {
	const {i18n} = useLingui();
	const [isRunning, toggleIsRunning] = useBoolean(true);
	const [now, setNow] = useState(new Date());
	const [showOptions, setShowOptions] = useState(true);
	const [voted, setVoted] = useState(false);

	const options = props.pollData
		&& props.pollData.options
		&& props.pollData.options.filter(option => option !== null);
	const showResults = props.pollData
		&& props.pollData.endsAt
		&& now > props.pollData.endsAt.toDate();

	const ref = useRef(null);
	useClickAway(ref, () => {
		setShowOptions(false);
	});

	useInterval(
		() => {
			onPollTick();
		},
		isRunning ? 1000 * 0.5 : null
	);

	useUnmount(() => {
		toggleIsRunning(false);
	});

	const timeLeft = () => {
		if(!props.pollData.endsAt) return;
		let seconds = (props.pollData.endsAt.toDate() - now.getTime()) / 1000;
		// if (seconds < 0) { seconds = 0; }
		// 100% = 2 minutes
		return (seconds / 1.2);
	};

	const onPollTick = () => {
		setNow(new Date);
		// Verify we are owner and the poll has finished
		if(!props.isOwner || !showResults) return;
		if(!props.pollData) return;
		// Save results if not yet saved
		if(!props.pollData.resultsSaved) {
			console.log(`Saving poll results`);
			//emit('end');
			toggleIsRunning(false);
			// clearInterval( this.pollInterval );
		}
	};

	return (
		<div ref={ref} className="chat-poll flex flex-grow-1 items-center justify-center pa2">
			<CountdownCircleTimer
				onComplete={() => {
					// do your stuff here
					return [true]
				}}
				isPlaying={!showResults}
				duration={timeLeft()}
				colors={[['#A30000']]}
			/>

			<div
				className="dib f5"
				style={{
					display: '-webkit-box',
					'-webkit-line-clamp': showOptions ? '10' : '1',
					'-webkit-box-orient': 'vertical',
					overflow: 'hidden',
					textOverflow: 'ellipsis'
				}}
			>
				{props.title || 'guac.live'}
			</div>

			<a
				href="#"
				onClick={(e) => {
					e && e.preventDefault();
					setShowOptions(!showOptions);
				}}
				className="link color-inherit ph2 br2 bg-animate hover-bg-dark-gray outline-none"
			>
				<GuacButton color="green">{isOpen ? '^' : 'V'}</GuacButton>
			</a>
			
			{
				!showResults && showOptions &&
				<div className="flex">
					{
						options.map((val, index) => {
							return (
								<button
									disabled={voted}
									key={`options-${index}`}
									className="flex link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--green bg-green ml1"
								>
									{`${index}. ${val.label}`}
								</button>
							)
						})
					}
				</div>
			}
			{
				((showResults || props.isOwner) && showOptions)
				&&
				<div className="poll-results mt3">
					{
						options.map((val, index) => {
							return (
								<div key={`options-${index}`} className="flex justify-center items-center mb3">
									<div className="flex flex-shrink-0 mr1 primary">
										{val.votes.toString().padStart(3, '0')}
									</div>

									<div className="flex-grow-1 mb2 mh1">
										<div className="caption flex mh2 mb1">
											<div className="flex-grow-1 truncate" style="width: 0;">{val.label}</div>
											<div className="flex-shrink-0 mr2">
												{Math.round(val.votes / (props.pollData.voteCount || 1) * 100)}%
											</div>
										</div>

										<div className="bg-moon-gray br-pill h1 overflow-y-hidden">
											<div
												className="bg-gray br-pill h1 shadow-1"
												style={{width: (val.votes / (props.pollData.voteCount || 1) * 100) + '%'}}
											></div>
										</div>
									</div>
								</div>
							)
						})
					}
				</div>
			}
		</div>
	);
}

export default ChatPollVote;