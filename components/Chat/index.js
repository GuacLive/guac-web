import React, { useState, useEffect, useLayoutEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';

import io from 'socket.io-client';

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.css';

import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete';
import '@webscopeio/react-textarea-autocomplete/style.css';
import AutoTextarea from "react-autosize-textarea";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import EmojiSelector from './EmojiSelector';
import GifSelector from './GifSelector';
import UrlEmbedder from '../../utils/UrlEmbedder';

import { ToggleFeature } from '@flopflip/react-redux';

import log from '../../utils/log';

import * as actions from '../../actions';
var socket = null;
var users = new Map();
var me = null;
var privileged = [];
var hasPrivilege = false;
function ChatComponent(props){
	const dispatch = useDispatch();
	const [connectedStatus, setConnectedStatus] = useState(false);
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [customPickerEmotes, setCustomPickerEmotes] = useState(false);

	// Redux
	const authentication = useSelector(state => state.authentication);
	const channel = useSelector(state => state.channel);
	const emotes = useSelector(state => state.emotes.data);

	let maxlines = 250;

	let rta;
	let textarea;

	const CHAT_URL = process.env.CHAT_URL;

	function createEmoteMarkup(name, img){
		return {
			__html: `${name}: ${img}`
		};
	}

	const handleUsers = (users) => {
		log('info', 'Chat', 'We got users', users);
		users.forEach((user) => {
			log('info', 'Chat', 'user', user, user.name);
			if(user && user.name) userJoin(user);
		});
	}

	const handlePriv = (args) => {
		privileged = args[0];
		if(typeof privileged !== 'array') return;
		// In case privilege has been added or removed for your user
		if(
			privileged.indexOf(me.id) > -1
		){
			hasPrivilege = true;
		}
	}

	const userJoin = (user) => {
		if(!user.name) return;
		if(!user.anon){
			users.set(user.name, user);
			if(authentication.user && user.name === authentication.user.name){
				me = authentication.user;
				if(
					channel.data.user.name === me.name
					|| privileged.indexOf(me.id) > -1
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

	const handleMessage = (user, messages) => {
		let self = this;
		let entry;
		let writeMessage = ((message) => {
			setMessage(message);
		}).bind(self);
		if(!user || !messages) return;
		log('info', 'Chat', 'We got emotes', emotes, customPickerEmotes);
		const embed = new UrlEmbedder;
		let output = messages.map((msg, i) => {
			if(!msg.type) return null;
			if(!msg.content.trim()) return null;
			switch(msg.type){
				case 'emote':
					if(Object.keys(emotes).indexOf(msg.content) == -1) return null;
					let emote = emotes[msg.content];
					return (
						<React.Fragment key={'c-' + i + '-' + (new Date).getTime()}><img className="chat-message-content__emote dib" src={emote.url} alt={'Emote: ' + msg.content} title={msg.content + ' by ' + emote.provider} />{i !== messages.length -1 && '\u00A0'}</React.Fragment>
					);
				break;
				case 'text':
					return (
						<span key={'u-' + i + '-'  + (new Date).getTime()} dangerouslySetInnerHTML={{__html: `${embed.format(msg.content)}${i !== messages.length -1 ? '\u00A0' : ''}`}}></span>
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
			message: (
				<>
					<span className="chat-message-time">
						{new Date(user.lastMessage).toLocaleTimeString()}{'\u00A0'}
					</span>
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
	}

	const sendMessage = () => {
		let self = this;
		let msg = message;

		// If this is a command
		if(msg.slice(0,1) === '/'){
			let args = msg.split(' ');
			let command = args.shift();
			log('info', 'Chat', 'We got a command', args, command);
			switch(command){
				case '/users':
					let nicks = [];
					[...users].forEach((args) => {
						let user = args[1];
						if(user && user.name) nicks.push(user.name);
					});
					handleSys('User list: ' + nicks.join(' '));
				break;
				case '/ban':
					if(!hasPrivilege) return;
					if(args && args[0]){
						let user = users.get(args[0]);
						socket.emit('ban', user && user.id);
					}
				break;
				case '/unban':
					if(!hasPrivilege) return;
					if(args && args[0]){
						let user = users.get(args[0]);
						socket.emit('unban', user && user.id);
					}
				break;
				case '/mod':
					if(!hasPrivilege) return;
					if(
						me
						&& channel.data.user.name !== me.name
					){
						return;
					}
					if(args && args[0]){
						let user = users.get(args[0]);
						socket.emit('mod', user && user.id);
					}
				break;
				case '/unmod':
					if(!hasPrivilege) return;
					if(
						me
						&& channel.data.user.name !== me.name
					){
						return;
					}
					if(args && args[0]){
						let user = users.get(args[0]);
						socket.emit('unmod', user && user.id);
					}
				break;
				case '/timeout':
					if(!hasPrivilege) return;
					if(args && args[0]){
						let user = users.get(args[0]);
						let time = typeof args[1] === 'number' ? args[1] : 600;
						socket.emit('timeout', user && user.id, time);
					}
				break;
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

	const cleanup = () => {
		const lines = messages;
		if(lines.length >= maxlines){
            setMessages(lines.slice(-maxlines));
		}
	}

	useEffect(() => {
		dispatch(actions.fetchEmotes());
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
			socket.on('connect', () => {
				setConnectedStatus(true);
				socket.emit('join', authentication.token || null);
			});
			socket.on('reconnect', () => {
				log('info', 'Chat', 'reconnect');
				//socket.emit('join', props.authentication.token || null);
			});
		}
			
		// Cleanup
		return function cleanup(){
      		didCancel = true;
			if(socket){
				socket.removeAllListeners();
				socket.off('connect');
				socket.off('disconnect');
				//socket.leave();
				socket.disconnect();
				setConnectedStatus(false);
			}
		};
	}, [emotes]);

	// Handle simplebar calculation
	if(process.browser){
		useLayoutEffect(() => {
			if(typeof document !== 'undefined'){
				let el = document.getElementsByClassName('chat-messages')[0];
				if(el && el.SimpleBar){
					el.SimpleBar.getScrollElement().scrollTop = el.SimpleBar.getScrollElement().scrollHeight;
				}
			}
		});
	}

	return (
		<>
			<div className="flex flex-column flex-grow-1 flex-nowrap overflow-hidden">
				<SimpleBar className="chat-messages flex-grow-1" style={{ height: '80vh' }}>
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
			<div className="chat-input pr4 pl4 pb4">
				<div className="db relative">
					<ReactTextareaAutocomplete
						value={message}
						onChange={writeMessage}
						className="w-100 pa2 br2 input-reset ba db"
						loadingComponent={() => <span>Loading</span>}
						style={{
							'paddingRight': '6rem'
						}}
						ref={rta => {
							rta = rta;
						}}
						innerRef={textarea => {
							textarea = textarea;
						}}
						textAreaComponent={{ component: AutoTextarea, ref: "innerRef" }}
						minChar={2}
						rows={1}
						trigger={{
							':': {
								dataProvider: token => {
									if(!token || !token.length){
										return Object.keys(emotes)
										.map((name) => {
											return {
												name,
												char: name,
												img: `<img src='${emotes[name].url}'/>`
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
											img: `<img src='${emotes[name].url}'/>`
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
				</div>
				<div className="chat-input__buttons primary flex justify-between mt1">
					<div className="flex flex-row">
						<div className="relative">
							{
								customPickerEmotes &&
								customPickerEmotes.length > 0 &&
								<EmojiSelector
									emotes={customPickerEmotes} 
									onSelect={emoji => {
										// Select text to type - if it is custom type the id, otherwise type emoji.
										const text = emoji.custom ? emoji.id : emoji.native;
								
										setMessage(`${message} ${text}`);
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
										}}
								/>
							}
							</ToggleFeature>
						</div>
					</div>
					<div className="content-center items-center flex flex-row">
						<input type="button" value="Chat" onClick={sendMessage} className="white dib pv2 ph3 nowrap lh-solid pointer br2 ba b--transparent bg-green" />
					</div>
				</div>
			</div>
		</>
	);
}
export default ChatComponent;