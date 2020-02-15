import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';

import io from 'socket.io-client';

import SimpleBar from 'simplebar-react';

import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete';
import AutoTextarea from "react-autosize-textarea";
import moment from 'moment';

import { withI18n } from '@lingui/react';
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

import commands from './commands';
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
	const ref = useRef();

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

	let maxlines = 250;

	let rta;
	let textarea;

	const CHAT_URL = process.env.CHAT_URL;

	function createEmoteMarkup(name, img){
		return {
			__html: `${name}: ${img}`
		};
	}

	const checkIfBottom = (el) => {
		if(messages.length === 0) return true;
		const scrollTop = el.scrollTop;
		const clientHeight = el.clientHeight; // or offsetHeight
		const scrollHeight = el.scrollHeight;
		return scrollHeight - clientHeight <= scrollTop + 100;
		//scrollTop + clientHeight >= scrollHeight
		//return scrollHeight - scrollTop === clientHeight;
	};
	  
	const handleUsers = (users) => {
		log('info', 'Chat', 'We got users', users);
		users.forEach(function(user){
			log('info', 'Chat', 'user', user, user.name);
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
		log('info', 'Chat', 'Viewers: ' + viewers);
		dispatch({
			type: 'SET_CHANNEL_VIEWERS',
			viewers
		});
	}

	const handleMessage = (user, msgID, messages) => {
		let self = this;
		let entry;
		let writeMessage = ((message) => {
			setMessage(message);
		}).bind(self);
		if(!user || !messages) return;
		const embed = new UrlEmbedder;
		let output = messages.map((msg, i) => {
			if(!msg.type) return null;
			if(!msg.content.trim()) return null;
			switch(msg.type){
				case 'emote':
					if(Object.keys(emotes).indexOf(msg.content) == -1) return null;
					let emote = emotes[msg.content];
					return (
						<React.Fragment key={'c-' + i + '-' + (new Date).getTime()}><Image className="chat-message-content__emote dib" src={emote.url} alt={'Emote: ' + msg.content} title={msg.content + ' by ' + emote.provider} />{i !== messages.length -1 && '\u00A0'}</React.Fragment>
					);
				break;
				case 'text':
					// Add username highlighting
					if(me && me.name){
						const pattern = new RegExp(`@${me.name}\\b`, 'gi');
						msg.content = msg.content.replace(pattern, `<span class="b green highlight">$&</span>`);
					}

					return (
						<React.Fragment key={'u-' + i + '-'  + (new Date).getTime()}>{embed.format(msg.content)}{i !== messages.length -1 ? '\u00A0' : ''}</React.Fragment>
					);
				break;
				default:
					return false;
				break;
			}
		});
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
							{moment(new Date(user.lastMessage)).format( 'HH:mm:ss' )}
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
							(users.get(user.name) && !users.get(user.name).banned) &&
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
						<a href={'/c/' + user.name} className="link color-inherit">{user.name}</a>:{'\u00A0'}
					</span>
					<span className="chat-message-content">
						{output}
					</span>
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
				return {
					type: Object.keys(emotes).indexOf(msg) > -1 ? 'emote' : 'text',
					content: msg
				};
			});
			socket.emit('message', msgs);
		}
		
		// empty the message box
		setMessage('');
	}

	const handleDelete = (msgID) => {
		setMessages(messages => {
			console.log(messages);
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
		dispatch(actions.fetchEmotes(channel && channel.data && channel.data.user.name));
	}, []);

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
	}, [emotes]);
	// Handle chat connection
	useUpdateEffect(() => {
		let didCancel = false;
		if(!didCancel){
			socket = io(CHAT_URL, {
				'reconnection': true,
				'reconnectionDelay': 1000,
				'reconnectionDelayMax': 5000,
				'reconnectionAttempts': 5,
				'forceNew': true
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
			socket.on('reconnect', () => {
				log('info', 'Chat', 'reconnect');
				setConnectedStatus(true);
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
	// If token changes, join with the new one
	// Is this really necessary? I just added because it might fix some issues
	useEffect(() => {
		if(socket && connectedStatus) socket.emit('join', authentication.token || null);
	}, [authentication.token, connectedStatus]);

	// Handle simplebar calculation
	if(process.browser){
		useLayoutEffect(() => {
			if(ref && ref.current) ref.current.recalculate();
			if(typeof document !== 'undefined'){
				if(ref && ref.current){
					if(!checkIfBottom(ref.current.getScrollElement())) return;
					// Scroll to last message
					const contentEl = ref.current.getContentElement();
					const lastMsg = contentEl.querySelector('div:last-child');
					if(lastMsg && lastMsg.scrollIntoView){
						lastMsg.scrollIntoView({
							behavior: 'smooth',
							block: 'nearest',
							inline: 'start'
						});
					}
					setTimeout(function(){
						ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight;
					}, 500);			  
				}
			}
		}, [messages.length]);
	}

	const ChatInput = (
		<>
			<div className="chat-input pr4 pl4 pb4">
					<div className="relative">
						<ReactTextareaAutocomplete
							value={message}
							onChange={writeMessage}
							className="w-100 pa2 br2 input-reset ba db outline-transparent"
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
										console.log('token', [...users.values()]);
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
											console.log('user', user);
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
										console.log('itæm', item); 
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
						<div className="chat-input__buttons absolute bottom-0 right-0">
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
						<div className="items-center flex white">
							<h5 className="f6 b ttu tracked"><Trans>Stream Chat</Trans></h5>
						</div>
						<div className="absolute mr3 right-0 white">
							<a
								href="#"
								onClick={(e) => {
									e&&e.preventDefault();
									let commandClass;
									if(commandClass = commands.get('users')){
										let command = new commandClass(socket, channel, me, authentication.token, hasPrivilege, users);
										command.run();
									}
								}} 
								className="link color-inherit ph2 br2 bg-animate hover-bg-dark-gray outline-none" 
								title="Users in chat"
							>
								<FontAwesomeIcon icon='user' />
							</a>
						</div>
					</div>
					)
					: null
				}
				<SimpleBar ref={ref} className="chat-messages flex-grow-1" style={{ height: '78vh' }}>
				{
					messages
					&&
					messages
					.sort((a,b) => {
						return a.time > b.time;
					})
					.map((data, i) => {
						return (
							<div className="chat-message" key={'chat-message' + i}>{data.message}</div>
						);
					})
				}
				</SimpleBar>
			</div>
			{ !isOverlay ? ChatInput : null}
		</>
	);
}
export default withI18n()(ChatComponent);