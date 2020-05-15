import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';

import io from 'socket.io-client';

import SimpleBar from 'simplebar-react';

import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete';
import AutoTextarea from 'react-autosize-textarea';

import format from 'date-fns/format';

import { Trans, t } from '@lingui/macro';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import EmojiSelector from './EmojiSelector';
import GifSelector from './GifSelector';
import SettingsMenu from './SettingsMenu';

import UrlEmbedder from '../../utils/UrlEmbedder';

import Image from '../Image';

import { ToggleFeature } from '@flopflip/react-redux';

import log from '../../utils/log';

import * as actions from '../../actions';

import useLocalStorage from 'react-use/lib/useLocalStorage';

import { callApi } from '../../services/api';

import commands from './commands';
import ViewerList from './ViewerList';
var socket = null;
var users = new Map();
var me = null;
var privileged = [];
var hasPrivilege = false;
function ChatComponent(props){
	const dispatch = useDispatch();
	const [connectedStatus, setConnectedStatus] = useState(false);
	const [lastMessage, setLastMessage] = useState('');
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [customPickerEmotes, setCustomPickerEmotes] = useState(false);
	const [emotesStatus, setEmotesStatus] = useState(false);
	const [hydrated, setHydrated] = useState(false);

	const [showFAB, setShowFAB] = useState(false);
  
	const lastMessageRef = useRef();
	const messageContainerRef = useRef();

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
			}, 1000);
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

	// Redux
	const authentication = useSelector(state => state.authentication);
	const channel = useSelector(state => state.channel);
	const emotes = useSelector(state => state.emotes.data);
	const darkMode = useSelector(state => state.site.mode === 'dark');
	
	var [showTimestamps] = useLocalStorage('showTimestamps', true);
	var chatSettings = {
		showTimestamps
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
				me = authentication.user;
				if(
					channel.data.user.name === me.name
					|| (privileged && privileged.indexOf(me.id) > -1)
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
			setLastMessage(event.target.value);
			sendMessage();
			event.preventDefault();
			return false;
		}
	}

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

	const handleViewers = (viewers) => {
		log('info', 'Chat', 'Chatters: ' + viewers);
	}

	const handleMessage = (user, msgID, messages) => {
		let self = this;
		let entry;
		let writeMessage = ((message) => {
			setMessage(message);
		}).bind(self);
		if(!user || !messages) return;
		// Create new instance of urlembedder
		// Use username as parameter because we also use this for highlighting
		const embed = new UrlEmbedder(me && me.name ? me.name : null);
		//let emoteOnly = messages && memessagessages.filter(m => m.content.length > 0).length === 1;
		// Assume this is an emote-only  by default
		let emoteOnly = true;
		let output = messages.map((msg, i) => {
			if(!msg.type) return null;
			if(!msg.content.trim()) return null;
			switch(msg.type){
				case 'emote':
					if(Object.keys(emotes).indexOf(msg.content) == -1) return null;
					let emote = emotes[msg.content];
					return (
						<React.Fragment key={'c-' + i + '-' + (new Date).getTime()}><Image className="chat-message-content__emote dib" data-emote-code={msg.content} src={emote.url} alt={'Emote: ' + msg.content} title={msg.content + ' by ' + emote.provider} />{i !== messages.length -1 && '\u00A0'}</React.Fragment>
					);
				case 'text':
					// Text is found, set emoteOnly to false
					if(emoteOnly && msg.content) emoteOnly = false;

					return (
						<React.Fragment key={'u-' + i + '-'  + (new Date).getTime()}>{embed.format(msg.content)}{i !== messages.length -1 ? '\u00A0' : ''}</React.Fragment>
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
		let showModTools = hasPrivilege &&
			(me && me.name !== user.name) &&
			(privileged && privileged.indexOf(user.id) === -1);
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
									<span 
										className="chat-message-badges__badge"
										data-badge={badge.id}
										title={badge.label}
										key={'b-' + user.id + '-' + badge.id + (new Date).getTime()}
									>
									</span>
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
					<span className="chat-message-user b dib">
						<a onClick={() => {
							setMessage(`${message} @${user.name}`);
							setLastMessage(`${message} @${user.name}`);
						}} href="#" className="link color-inherit" style={{color: `#${user.color}`}}>{user.name}</a>{'\u00A0'}
					</span>
					<span className={`chat-message-content db ${emoteOnly ? 'chat-message-content__emote-only' : 'chat-message-content__with-text'}`}>{output}</span>
				</>
			)
		};
		setMessages(messages => messages.concat(entry));
		cleanup();
	}

	const writeMessage = (event) => {
		setMessage(event.target.value);
		if(event.target.value) setLastMessage(event.target.value);
	}

	const sendMessage = () => {
		let self = this;
		let msg = message;

		// If this is a command
		if(msg.slice(0,1) === '/'){
			let args = msg.split(' ');
			let command = args.shift().slice(1);
			let commandClass;
			log('info', 'Chat', 'We got a command', args, command);
			if(commandClass = commands.get(command)){
				let command = new commandClass(socket, channel, me, authentication.token, hasPrivilege, users);
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
		setMessage('');
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
						handleMessage(msg.user, msg.id, msg.msgs);
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
				'reconnection': true,
				'reconnectionDelay': 1000,
				'reconnectionDelayMax': 5000,
				'reconnectionAttempts': 5,
				'forceNew': true,
				'transports': ['websocket']
			});
			socket.on('join', userJoin);
			socket.on('leave', userLeave);
			socket.on('msgs', handleMessage);
			socket.on('users', handleUsers);
			socket.on('sys', handleSys);
			socket.on('privileged', handlePriv);
			socket.on('viewers', handleViewers);
			socket.on('delete', handleDelete);
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
				socket.emit('disconnect');
				socket.removeAllListeners();
				socket.off('connect');
				socket.off('disconnect');
				//socket.leave();
				socket.disconnect();
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
			<div className="chat-input pr4 pl4 pb4">
					<div className="relative">
						<ReactTextareaAutocomplete
							value={message}
							onChange={writeMessage}
							className="w-100 pa2 br2 input-reset ba db outline-transparent bg-transparent primary"
							loadingComponent={() => <Trans>Loading...</Trans>}
							style={{
								'paddingRight': '6rem'
							}}
							ref={rta => {
								rta = rta;
							}}
							innerRef={textarea => {
								textarea = textarea;
							}}
							onKeyDown={event => lastMessageHandler(event)}
							onCut={event => lastMessageHandler(event)}
							textAreaComponent={{ component: AutoTextarea, ref: "innerRef" }}
							minChar={2}
							rows={1}
							disabled={!connectedStatus}
							trigger={{
								'@': {
									dataProvider: token => {
										if(!token || !token.length){
											return [...users.values()]
											.map((user) => {
												return {
													name: user.name,
													char: user.name
												}
											});
										}
										return [...users.values()]
										.filter(user => {
											if(user
												&& user.name
												&& user.name.search(new RegExp(token, "i")) !== -1
												&& !user.anon){
												return user.name;
											}
											return null;
										})
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
										if(!token || !token.length){
											return Object.keys(emotes)
											.map((name) => {
												return {
													name,
													char: name,
													img: `<Image src=${emotes[name].url} />`
												}
											});
										}
										return Object.keys(emotes)
										.filter(name => {
											if(name.search(new RegExp(token, "i")) !== -1){
												return name;
											}
											return null;
										})
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
								}
							}}
						/>
						<div className="chat-input__buttons absolute bottom-0 right-0 primary">
							<div className="flex flex-row pr2 pb2">
								<div className="relative">
									{
										customPickerEmotes &&
										customPickerEmotes.length > 0 &&
										<EmojiSelector
											emotes={customPickerEmotes} 
											darkMode={darkMode}
											onSelect={emoji => {
												// Select text to type - if it is custom type the id, otherwise type emoji.
												const text = emoji.custom ? emoji.id : emoji.native;
										
												setMessage(`${message} ${text}`);
												setLastMessage(`${message} ${text}`);
											}}
										/>
									}
									<ToggleFeature
										flag='gifSelector'
									>
									{
										<GifSelector
											darkMode={darkMode}
											onEntrySelect={entry => {
													log('info', 'Chat', 'GifSelector entry', entry);
													setMessage(`${entry.images.original.url}`);
													setLastMessage(`${entry.images.original.url}`);
												}}
										/>
									}
									</ToggleFeature>
								</div>
							</div>
						</div>
					</div>
					<div className="flex justify-between">
						<div className="flex flex-row">
							<SettingsMenu chatSettings={chatSettings} />
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
							<input type="submit" value="Chat" onClick={sendMessage} disabled={!connectedStatus} className="white dib pv2 ph3 nowrap lh-solid pointer br2 ba b--transparent bg-green" />
						</div>
					</div>
				</div>
			</>
		);
	return (
		<>
			<div className="flex flex-column flex-grow-1 flex-nowrap overflow-hidden">
				{
					!isOverlay ?
					(
					<div className="chat-header items-center bb b--white-05 bg-black-50 flex flex-shrink-0 w-100 justify-center pl3 pr3">
						<div className="items-center flex primary">
							<h5 className="f6 b ttu tracked"><Trans>Stream Chat</Trans></h5>
						</div>
						<div className="absolute mr3 right-0 primary">
							<ViewerList users={users} darkMode={darkMode} />
						</div>
					</div>
					)
					: null
				}
				<SimpleBar ref={messageContainerRef} className="chat-messages flex-grow-1" style={{ height: '78vh' }}>
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
				<div className="flex justify-center relative pointer" style={{height: '0'}}>
				{
					showFAB ?
							<div className="absolute br2 bottom-0 flex justify-center items-center pv3 ph4 mb3 bg-black-50 white b" onClick={goToBottom}>
								<div><Trans>More messages below.</Trans></div>
							</div> 
						: null
				}
				</div>
			</div>
			{ !isOverlay ? ChatInput : null}
		</>
	);
}
export default ChatComponent;