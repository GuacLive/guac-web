import { Fragment, useState, useRef, useEffect, useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';

import io from 'socket.io-client';

import SimpleBar from 'simplebar-react';

import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete';
import TextareaAutosize from 'react-textarea-autosize';

import format from 'date-fns/format';

import { useLingui } from "@lingui/react"
import { Trans, t } from '@lingui/macro';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
	Tooltip
} from 'react-tippy'

import dynamic from 'next/dynamic';

const EmojiSelector = dynamic(() => import('./EmojiSelector'));
const GifSelector = dynamic(() => import('./GifSelector'));
import SettingsMenu from './SettingsMenu';
import UserCard from './UserCard';

import UrlEmbedder from 'utils/UrlEmbedder';

import log from 'utils/log';

import * as actions from 'actions';

import useLocalStorage from 'react-use/lib/useLocalStorage';

import { callApi } from 'services/api';

import commands from './commands';
import ViewerList from './ViewerList';

import FeaturesService from 'utils/FeaturesService';

var socket = null;

var privileged = [];
var hasPrivilege = false;
const MAX_MESSAGE_LENGTH = 240;
function ChatComponent(props){
	const { i18n } = useLingui();
	const dispatch = useDispatch();
	const [connectedStatus, setConnectedStatus] = useState(false);
	const [lastMessage, setLastMessage] = useState('');
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [customPickerEmotes, setCustomPickerEmotes] = useState(false);
	const [emotesStatus, setEmotesStatus] = useState(false);
	const [hydrated, setHydrated] = useState(false);
	const [visible, setVisible] = useState(true);

	const [showFAB, setShowFAB] = useState(false);
	const [userCard, setUserCard] = useState(false);
  
	const lastMessageRef = useRef();
	const messageContainerRef = useRef();

	// CC0 public domain sound from http://www.freesound.org/people/pan14/sounds/263133/
	const notificationSound = typeof Audio == 'undefined' ? null : new Audio();
	
	if(notificationSound){
		notificationSound.src = '/sounds/notification.wav';
		notificationSound.volume = 1;
		notificationSound.muted = false;
	}
	  
	const [users, setUsers] = useState(new Map());

	const [me, setMe] = useState(null);

	const goToBottom = useCallback(() => {
		if(
			lastMessageRef && lastMessageRef.current
			&& messageContainerRef && messageContainerRef.current
		){
			messageContainerRef.current.recalculate();
			messageContainerRef.current.getScrollElement().scrollTop = messageContainerRef.current.getScrollElement().scrollHeight - messageContainerRef.current.getScrollElement().clientHeight + lastMessageRef.current.offsetHeight;
			setTimeout(() => {
				if(
					lastMessageRef
					&& lastMessageRef.current
				){
					if(lastMessageRef.current.scrollIntoViewIfNeeded){
						lastMessageRef.current.scrollIntoViewIfNeeded(false);
					}else if(lastMessageRef.current.scrollIntoView){
						lastMessageRef.current.scrollIntoView(false);
					}
					setShowFAB(false);
				}
			}, 250);
		}
	}, [
		lastMessageRef, messageContainerRef
	]);

	const scrollOrShowMessage = useCallback(() => {
		if(
			lastMessageRef && lastMessageRef.current
			&& messageContainerRef && messageContainerRef.current
		){
			const diff = Math.abs(
				messageContainerRef.current.getScrollElement().scrollTop - lastMessageRef.current.offsetTop);
			const scrolledRatio = diff / messageContainerRef.current.getScrollElement().offsetHeight;
			if(scrolledRatio < 1.8){
				goToBottom();
			} else {
				setShowFAB(true);
			}
		}
	}, [messages, lastMessageRef]);

	const onScroll = useCallback(() => {
		if(!messageContainerRef || !messageContainerRef.current) return;
		const scrollTop = messageContainerRef.current.getScrollElement().scrollTop;
		const clientHeight = messageContainerRef.current.getScrollElement().clientHeight; // or offsetHeight
		const scrollHeight = messageContainerRef.current.getScrollElement().scrollHeight;
		if(scrollHeight - clientHeight <= scrollTop + 100){
			setShowFAB(false);
		}else{
			setShowFAB(true);
		}
	}, [messages]);

	if(process.browser){
		useEffect(() => {
			if(messageContainerRef && messageContainerRef.current){
				messageContainerRef.current.getScrollElement().addEventListener('scroll', onScroll);
			}

			return () => {
				window.removeEventListener('scroll', onScroll)
			}
		}, [messageContainerRef]);
	}

	const setLastMessageRef = (r, i) => {
		if(!r){
			return;
		}
		if(
			i === (messages.length - 1)
			&& (!lastMessageRef.current || lastMessageRef.current.dataset.id !== r.dataset.id)
		) {
			lastMessageRef.current = r;
			scrollOrShowMessage();
		}
	};
	const useChatHydration = true;

	const isOverlay = props.overlay ? true : false;
	const isPopout = props.popout ? true : false;

	// Redux
	const authentication = useSelector(state => state.authentication);
	const channel = useSelector(state => state.channel);
	const emotes = useSelector(state => state.emotes.data);
	const darkMode = useSelector(state => state.site.mode === 'dark');

	var featuresService = new FeaturesService(
		props.featuresService &&
			props.featuresService.features
			?
			props.featuresService.features
			: {}
	);
	
	var [showTimestamps] = useLocalStorage('showTimestamps', true);
	var [notifySound] = useLocalStorage('notifySound', true);
	var chatSettings = {
		showTimestamps,
		notifySound
	};

	let maxlines = 100;

	const CHAT_URL = process.env.CHAT_URL;

	function createEmoteMarkup(name, img){
		return {
			__html: `${name}: ${img}`
		};
	}
	  
	const handleUsers = (users) => {
		log('info', 'Chat', 'We got users', users);
		users.forEach(function(user){
			log('info', 'Chat', 'user', user);
			if(user && user.name) userJoin(user);
		}.bind(this));
	}

	const handlePriv = (args) => {
		let user = args[0];
		if(typeof privileged !== 'object') return;
		if(privileged.indexOf(user) === -1) privileged.push(user);
		// In case privilege has been added or removed for your user
		if(
			authentication
			&&
			authentication.user
			&&
			privileged.indexOf(authentication.user.id) > -1
		){
			hasPrivilege = true;
		}
	}

	const userJoin = (user) => {
		if(!user.name) return;
		if(!user.anon){
			users.set(user.name, user);
			if(typeof privileged !== 'object') return;
			if(authentication.user && user.name === authentication.user.name){
				setMe(authentication.user);
				if(
					channel.data.user.name === authentication.user.name
					|| (privileged && privileged.indexOf(authentication.user.id) > -1)
				){
					hasPrivilege = true;
				}
			}
		}
	}

	const userLeave = (user) => {
		if(!user.name) return;
		if(!user.anon){
			users.delete(user.name);
		}
	}

	const lastMessageHandler = (event) => {
		if(!event) return;
		if(event.target && !event.target.value){
			if(event.keyCode == 38){
				setMessage(lastMessage);
			}else{
				setMessage('');
			}
		}
		if(event.type === 'cut'){
			setTimeout(() => {
				if(!event.srcElement.value){
					setMessage('');
				}
			}, 20);
		}
		if(event.key == 'Enter' && event.target.value){
			if(event.target.value.trim() != ''){
				setLastMessage(event.target.value);
				sendMessage();
				event.preventDefault();
				return false;
			}
		}
	}
	
	const setFormattedMessage = text => {
		text && text.length > MAX_MESSAGE_LENGTH ? setMessage(text.slice(0, MAX_MESSAGE_LENGTH)) : setMessage(text);
	};	

	const handleSys = (msg) => {
		let entry = {
			user: null,
			message: (
				<>
					<span className="chat-message-user green b">
						SYSTEM MESSAGE:{'\u00A0'}
					</span>
					<span className="chat-message-content green">
						{msg}
					</span>
				</>
			)
		};
		setMessages(messages => messages.concat(entry));
		cleanup();
	}

	const handleWelcome = () => {
		if(!channel?.data?.user?.name) return null;
		let entry = {
			user: null,
			message: (
				<>
					<span className="chat-message-user"></span>
					<span className="chat-message-content green">
						<Trans>Hi! Welcome to {channel?.data?.user?.name}'s channel~</Trans>
					</span>
				</>
			)
		};
		setMessages(messages => messages.concat(entry));
		cleanup();
	}

	const handleViewers = (viewers) => {
		log('info', 'Chat', 'Chatters: ' + viewers);
	}

	const handleMessage = (user, msgID, messages) => {
		let self = this;
		let entry;
		let writeMessage = ((message) => {
			setFormattedMessage(message);
		}).bind(self);
		if(!user || !messages) return;
		// Create new instance of urlembedder
		// Use username as parameter because we also use this for highlighting
		const embed = new UrlEmbedder(authentication.user && authentication.user.name ? authentication.user.name : null);

		// Assume this is an emote-only  by default
		let emoteOnly = true;
		let output = messages.map((msg, i) => {
			if(!msg) return null;
			if(!msg.type) return null;
			if(!msg.content.trim()) return null;
			switch(msg.type){
				case 'emote':
					if(Object.keys(emotes).indexOf(msg.content) == -1) return null;
					let emote = emotes[msg.content];
					return (
						<Fragment key={'c-' + i + '-' + (new Date).getTime()}>
							<Tooltip
								// options
								title={`${msg.content} ${i18n._(t`by`)} ${emote.provider}`}
								position="top"
								trigger="mouseenter"
							>
									<img className="GuacImage chat-message-content__emote dib" data-emote-code={msg.content} src={emote.url} alt={'Emote: ' + msg.content} />
							</Tooltip>
							{i !== messages.length -1 && '\u00A0'}
						</Fragment>
					);
				case 'text':
					// Text is found, set emoteOnly to false
					if(emoteOnly && msg.content) emoteOnly = false;
					// If me and not a hydrated message
					if(authentication.user && authentication.user.name && !messages.time){
						var USER_REGEX = new RegExp(`@${authentication.user.name}\\b`, 'gi');
						if(notifySound){
							if(USER_REGEX.test(msg.content.trim())){
								if(notificationSound){
									notificationSound.currentTime = 0;
									notificationSound.play().then();
								}
							}
						}
					}
					return (
						<Fragment key={'u-' + i + '-'  + (new Date).getTime()}>{embed.format(msg.content)}{i !== messages.length -1 ? '\u00A0' : ''}</Fragment>
					);
				default:
					return false;
			}
		});
		if(hydrated){
			// If hydrated and user does not exist in users list
			if(user && user.name && !users.get(user.name)){
				// Add it to the list
				users.set(user.name, user);
			}
		}
		// This will show mod icons if the following conditions are true:
		// 1) The user has privileges
		// 2) The message is not your own
		// 3) The sender of the message does not have privileges
		// 4) The sender of the message is not the broadcaster
		let showModTools = hasPrivilege &&
			(authentication.user && authentication.user.name !== user.name) &&
			(privileged && privileged.indexOf(user.id) === -1) &&
			channel.data.user.id !== user.id;
		entry = {
			user,
			msgID,
			message: (
				<>
					{
						chatSettings.showTimestamps &&
						<span className="chat-message-time">
							{format(new Date(messages.time ? messages.time : user.lastMessage), 'HH:mm:ss' )}
						</span>
					}
					<span className="chat-message-badges">
						{
							user.badges &&
							user.badges.map((badge) => {
								return (
									<Tooltip
										// options
										title={badge.label}
										position="top"
										trigger="mouseenter"
										key={'b-' + user.id + '-' + badge.id + (new Date).getTime()}
									>
										<span
											className="chat-message-badges__badge"
											data-badge={badge.id}
											onClick={() => {
												if(badge.url){
													if(typeof window !== 'undefined'){
														window.open(badge.url, '_ blank');
													}
												}
											}}
											style={{'cursor': badge.url ? 'pointer' : 'default'}}
										>
										</span>
									</Tooltip>
								);
							})
						}
					</span>
					<span className="chat-message-mod">
						{
							showModTools &&
							(users.get(user.name) && !users.get(user.name).banned) &&
							<span className="mr2">
								<a 
									href="#" 
									className="link color-inherit" 
									title="Ban user"
									onClick={() => {writeMessage(`/ban ${user.name}`)}}
								>
									<FontAwesomeIcon icon='ban' />
								</a>
							</span>
						}
						{
							showModTools &&
							(users.get(user.name) && users.get(user.name).banned) &&
							<span className="mr2">
								<a 
									href="#" 
									className="link color-inherit" 
									title="Unban user"
									onClick={() => {writeMessage(`/unban ${user.name}`)}}
								>
									<FontAwesomeIcon icon='check' />
								</a>
							</span>
						}
						{
							showModTools &&
							(users.get(user.name) && !users.get(user.name).banned) &&
							<span className="mr2">
								<a
									href="#" 
									className="link color-inherit"
									title="Timeout user"
									onClick={() => {writeMessage(`/timeout ${user.name} 600`)}}
								>
									<FontAwesomeIcon icon='hourglass' />
								</a>
							</span>
						}
						{
							showModTools &&
							<span className="mr2">
								<a
									href="#" 
									className="link color-inherit"
									title="Delete message"
									onClick={() => {
										console.log('emit delete', msgID);
										console.log(socket);
										socket.emit('delete', msgID);
									}}
								>
									<FontAwesomeIcon icon='trash' />
								</a>
							</span>
						}
					</span>
					<span className="chat-message-user fw6 inline-flex word-wrap items-center">
						<a onClick={() => {
							setUserCard({
								user,
								msgID,
								onClose: () => {setUserCard(null)},
								mention: () => {
									setFormattedMessage(`${message} @${user.name}`);
									setLastMessage(`${message} @${user.name}`);
								}
							});
						}} href="#" className="link color-inherit truncate" style={{color: `#${user.color}`}}>{user.name}</a>{'\u00A0'}
					</span>
					<span className={`chat-message-content db ${emoteOnly ? 'chat-message-content__emote-only' : 'chat-message-content__with-text'}`}>{output}</span>
				</>
			)
		};
		setMessages(messages => messages.concat(entry));
		cleanup();
	}

	const writeMessage = (event) => {
		setFormattedMessage(event.target.value);
		if(event.target.value) setLastMessage(event.target.value);
	}

	const sendMessage = () => {
		let self = this;
		let msg = message;

		if(!msg) return;

		// If this is a command
		if(msg.slice(0,1) === '/'){
			let args = msg.split(' ');
			let command = args.shift().slice(1);
			let commandObj;
			log('info', 'Chat', 'We got a command', args, command);
			if(commandObj = commands.get(command)){
				let command = new commandObj.func(socket, channel, me, authentication.token, hasPrivilege, users);
				command.run(args);
			}
		}else{
			let msgs = msg && msg.split(' ');
			if(!msg) return;
			msgs = msgs.map((msg) => {
				if(!msg || !msg.trim()) return;
				return {
					type: Object.keys(emotes).indexOf(msg) > -1 ? 'emote' : 'text',
					content: msg
				};
			});
			if(msgs.length > 0){
				socket.emit('message', msgs);
			}
		}
		
		// empty the message box
		setFormattedMessage('');
	}

	const handleDelete = (msgID) => {
		setMessages(messages => {
			return messages.filter(
				entry => entry.msgID !== msgID
			);
		});
		cleanup();
	}

	const cleanup = () => {
		const lines = messages;
		if(lines.length >= maxlines){
            setMessages(lines.slice(-maxlines));
		}
	}

	useEffect(() => {
		if(!emotesStatus){
			dispatch(actions.fetchEmotes(channel && channel.data && channel.data.user.name)).then(() => setEmotesStatus(true));
		}
	}, [channel.data]);

	useEffect(() => {
		if(!emotesStatus) return;
		if(hydrated) return;
		// Set initial privileged (to not break mod tools when hydrated)
		if(channel.data && privileged.length === 0){
			privileged = channel.data.mods;
			// Add channel owner to privileged
			privileged.push(channel.data.user.id);
		}
		// Set hasPrivilege
		if(authentication.user){;
			if(
				channel.data.user.name === authentication.user.name
				|| (privileged && privileged.indexOf(authentication.user.id) > -1)
			){
				hasPrivilege = true;
			}
		}
		if(useChatHydration){
			callApi(`/messages/${channel && channel.data && channel.data.user.name}`)
			.then(res => res.json())
			.then((res) => {
				if(res.data){
					let msgs = res.data;
					msgs
					.sort((a,b) => {
						return a.time > b.time;
					}).forEach((msg) => {
						msg.msgs.time = msg.time;
						handleMessage(msg.user, msg.id, Object.freeze(msg.msgs));
					});
				}
				setHydrated(true);
			}).catch(()=>{setHydrated(true);});
		}
	}, [emotesStatus]);

	// If chat has just been hydrated, go to bottom
	useEffect(() => {
		goToBottom();
	}, [hydrated]);

	useEffect(() => {
		setCustomPickerEmotes(Object.keys(emotes).map(
			(name) => ({
				key: name,
				name,
				imageUrl: emotes[name].url,
				text: name,
				short_names: [name],
				keywords: [name],
				customCategory: emotes[name].provider
			})
		));
	}, [emotesStatus]);
	// Handle chat connection
	useUpdateEffect(() => {
		let didCancel = false;
		if(!didCancel){
			socket = io(CHAT_URL, {
				'timeout': 2000,
				'reconnection': true,
				'reconnectionDelay': 2000,
				'reconnectionDelayMax': 5000,
				'reconnectionAttempts': 5,
				'forceNew': true,
				'transports': ['websocket'],
				withCredentials: true
			});
			socket.on('join', userJoin);
			socket.on('leave', userLeave);
			socket.on('msgs', handleMessage);
			socket.on('users', handleUsers);
			socket.on('sys', handleSys);
			socket.on('privileged', handlePriv);
			socket.on('viewers', handleViewers);
			socket.on('delete', handleDelete);
			socket.on('me', handleWelcome)
			socket.on('connect', () => {
				setConnectedStatus(true);
			});
			socket.on('disconnect', () => {
				setConnectedStatus(false)
			})
			socket.on('reconnect', (attemptNumber) => {
				if(attemptNumber > 5){
					socket.disconnect();
				}else{
					log('info', 'Chat', 'reconnect');
					setConnectedStatus(true);
				}
			});
		}
			
		// Cleanup
		return function cleanup(){
      		didCancel = true;
			if(socket){
				socket.disconnect();
				socket.removeAllListeners();
				socket.off('connect');
				socket.off('disconnect');
				//socket.leave();
				//users = new Map();
				privileged = [];
				hasPrivilege = false;
				setConnectedStatus(false);
			}
		};
	}, [emotes]);
	const connect = () => {
		if(socket && connectedStatus) socket.emit('join', authentication.token || null, channel.data && channel.data.user && channel.data.user.name);
	};
	// If token or connected status changes, join with the new one
	useEffect(connect, [authentication.token, connectedStatus]);

	const ChatInput = (
		<>
			<div className="chat-input pa2">
					<div className="relative">
						<ReactTextareaAutocomplete
							placeholder={i18n._(t`Send a message`)}
							value={message}
							onChange={writeMessage}
							className="w-100 pa2 br2 input-reset ba db outline-transparent bg-transparent primary"
							loadingComponent={() => <Trans>Loading...</Trans>}
							style={{
								'height': 'auto',
								'flex': '1 1',
								'paddingRight': '6rem',
							}}
							ref={rta => {
								rta = rta;
							}}
							innerRef={textarea => {
								textarea = textarea;
							}}
							autoCorrect="off"
							autoCapitalize="off"
							spellCheck="true"
							onChange={event => setFormattedMessage(event.target.value)}
							onKeyDown={event => lastMessageHandler(event)}
							onCut={event => lastMessageHandler(event)}
							textAreaComponent={{ component: TextareaAutosize, ref: 'ref'}}
							movePopupAsYouType={true}
							minChar={0}
							rows={1}
							disabled={!connectedStatus}
							dropdownClassName="chat-dropdown"
							trigger={{
								'@': {
									dataProvider: token => {
										return [...users.values()]
										.filter(user => {
											if(!token) return true;
											if(
											  user.name !== undefined &&
											  user.name.toLowerCase().indexOf(token.toLowerCase()) !== -1
											){
											  return true;
											}else{
											  return false;
											}
										})
										.slice(0, 10)
										.map(user => {
											return {
												name: user.name,
												char: user.name
											};
										});
									},
									component: ({ entity: {name} }) => <div>{name}</div>,
									output: (item) => {
										if(item && item.name){
											return {
												key: item.name,
												text: `@${item.char}`,
												caretPosition: 'next',
											};
										}
										return null;
									}
								},
								':': {
									dataProvider: token => {
										return Object.keys(emotes)
										.filter(name => {
											if(!token) return true;
											if(name.search(new RegExp(token, "i")) !== -1){
												return true;
											}
											return false;
										})
										.slice(0, 10)
										.map(name => {
											return {
												name,
												char: name,
												img: `<Image src=${emotes[name].url} />`
											};
										});
									},
									component: ({ entity: {name, img} }) => <div dangerouslySetInnerHTML={createEmoteMarkup(name, img)}></div>,
									output: (item) => {
										if(item && item.name){
											return {
												key: item.name,
												text: `${item.char}`,
												caretPosition: 'next',
											};
										}
										return null;
									}
								},
								'/': {
									dataProvider: (token) => {
										// Only show autocomplete for commands if / is first character
										if(message &&
											message.indexOf('/') !== 0){
											return [];
										}

										const selectedCommands = [...commands.keys()].filter(
											(c) => c.indexOf(token) !== -1,
										);

										// sort alphabetically unless the you're matching the first char
										selectedCommands.sort((a, b) => {
											let nameA = a.toLowerCase();
											let nameB = b.toLowerCase();
											if(nameA.indexOf(token) === 0){
												nameA = `0${nameA}`;
											}
											if(nameB.indexOf(token) === 0){
												nameB = `0${nameB}`;
											}
											if(nameA < nameB){
												return -1;
											}
											if(nameA > nameB){
												return 1;
											}

											return 0;
										});

										return selectedCommands.slice(0, 10)
										.map(name => {
											let c = commands.get(name);
											let usage = c && c.usage;
											let description = c && c.description;
											return {
												name,
												usage,
												c,
												description, 
												char: name
											};
										})
										.filter((obj) => {
											if(obj.c && obj.c.privileged){
												return hasPrivilege;
											}else{
												return true;
											}
										});
									},
									component: ({ entity }) => <div>
										<div><b>/{entity.name}</b> {entity.usage}</div>
										<div>{entity.description}</div>
									</div>,
									output: (item) => {
										if(item && item.name){
											return {
												key: item.name,
												usage: item.usage,
												description: item.description,
												text: `/${item.name}`,
												caretPosition: 'next',
											};
										}
										return null;
									}
								},
							}}
						/>
						<div className="chat-input__buttons absolute bottom-0 right-0 primary">
							<div className="flex flex-row pr2 pb2">
								<div className="relative">
									{
										customPickerEmotes &&
										customPickerEmotes.length > 0 &&
										<EmojiSelector
											channel={channel && channel.data && channel.data.user && channel.data.user.name}
											emotes={customPickerEmotes} 
											darkMode={darkMode}
											onSelect={emoji => {
												// Select text to type - if it is custom type the id, otherwise type emoji.
												const text = emoji.custom ? emoji.id : emoji.native;
										
												setFormattedMessage(`${message} ${text}`);
												setLastMessage(`${message} ${text}`);
											}}
										/>
									}
									{
										<GifSelector
											darkMode={darkMode}
											onEntrySelect={entry => {
													log('info', 'Chat', 'GifSelector entry', entry);
													setFormattedMessage(`${entry.images.original.url}`);
													setLastMessage(`${entry.images.original.url}`);
												}}
										/>
									}
								</div>
							</div>
						</div>
					</div>
					<div className="flex flex-row">
						<span className="f7 primary order-2 ml-auto mr2">{message.length}/{MAX_MESSAGE_LENGTH}</span>
					</div>
					<div className="flex justify-between">
						<div className="flex flex-row">
							<SettingsMenu channel={props.channel} darkMode={darkMode} chatSettings={chatSettings} />
						</div>
						{
							!connectedStatus &&
							customPickerEmotes &&
							customPickerEmotes.length > 0 &&
							<div className="flex flex-row center">
								<span className="primary"><Trans>Not connected to chat.</Trans></span>
								<button className="link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--green bg-green ml1" onClick={connect}><Trans>Reconnect</Trans></button>
							</div>
						}
						<div className="flex flex-row content-center items-center">
							<button type="submit" onClick={sendMessage} disabled={!connectedStatus} className="white dib pv2 ph3 nowrap lh-solid pointer br2 ba b--transparent bg-green" >
								<FontAwesomeIcon icon={['far', 'paper-plane']}></FontAwesomeIcon>
							</button>
						</div>
					</div>
				</div>
			</>
		);
	return (
		<div className={`w-100 ${!isOverlay && !isPopout && 'w-30-ns'} h-100 flex flex-column flex-grow-1 flex-shrink-1 flex-nowrap`}>	
			{
				!isOverlay ?
					(
						<div className={`chat-header relative ${visible ? 'items-center bb b--white-05 bg-black-50 flex flex-shrink-0 w-100 justify-center pl3 pr3' : ''}`}>
							<div className={`${visible ? 'flex' : 'dn'} items-center primary`}>
								<h5 className="f6 b ttu tracked"><Trans>Stream Chat</Trans></h5>
							</div>
							<div className={`absolute left-0 primary ${isPopout && 'dn'}`} style={{
								'left': visible ? '0' : '-3.5rem',
								'top': visible ? 'auto' : '1rem',
								'zIndex': '2'
							}}>
								<div className="inline-flex items-center justify-center mr2">
									<a
										href="#"
										onClick={(e) => {
											e && e.preventDefault();
											setVisible(!visible);
										}}
										className="link color-inherit ph2 br2 bg-animate hover-bg-dark-gray outline-none"
										title={i18n._(visible ? t`Collapse` : t`Expand`)}
									>
										<FontAwesomeIcon icon={visible ? 'caret-square-left' : 'caret-square-right'} fixedWidth />
									</a>
								</div>
							</div>
							<div className={`${visible ? 'db' : 'dn'} absolute mr3 right-0 primary`}>
								<ViewerList users={users} darkMode={darkMode} />
							</div>
						</div>
					)
					: null
			}
			<div className={`${visible ? 'flex' : 'dn'} flex flex-column flex-grow-1 flex-nowrap overflow-hidden`}>
				{
					!connectedStatus
					&&
					<div className="flex ph3 f4 tc relative h-100 w-100 white">
						<div className="absolute justify-center items-center">
							<p className="pa0 ma0"><Trans>Loading</Trans>&hellip;</p>
						</div>
					</div>
				}
				<SimpleBar ref={messageContainerRef} className={`chat-messages flex-grow-1 z-initial h-100 ${featuresService && featuresService.checkOnFeaturesDate('christmas') ? 'snow-bg' : 'test'} ${visible ? '' : 'dn'}`}
				style={{height: '0', flex: '1 1 auto'}}>
				{
					messages
					&&
					messages
					.sort((a,b) => {
						return a.time > b.time;
					})
					.map((data, i) => {
						return (
							<div className="chat-message" key={'chat-message' + i} data-id={data.msgID} ref={r => setLastMessageRef(r, i)}>{data.message}</div>
						);
					})
				}
				</SimpleBar>
			</div>
			{userCard && <UserCard darkMode={darkMode} {...userCard} />}
			<div className={`${visible ? 'flex' : 'dn'} justify-center relative pointer`} style={{height: '0'}}>
				{
					showFAB ?
						<div className="absolute br2 bottom-0 flex justify-center items-center pv3 ph4 mb3 bg-black-50 white b" onClick={goToBottom}>
							<div><Trans>More messages below.</Trans></div>
						</div> 
					: null
			}
			</div>
			{ !isOverlay && visible ? ChatInput : null}
		</div>
	);
}
export default ChatComponent;