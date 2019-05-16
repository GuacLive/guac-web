import React from 'react';

import {connect} from 'react-redux';

import io from 'socket.io-client';

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.css';

import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete';
import '@webscopeio/react-textarea-autocomplete/style.css';
import AutoTextarea from "react-autosize-textarea";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import fetch from 'cross-fetch';

const CHAT_URL = process.env.CHAT_URL;

function createEmoteMarkup(name, img){
	return {
		__html: `${name}: ${img}`
	};
}
class Chat extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			message: '',
			messages: []
		};
		this.users = new Map();
		this.socket = null;
		this.maxlines = 250;

		this.emotes = [];
		this.me = null;
		this.privileged = [];
		this.hasPrivilege = false;

		this.sendMessage = this.sendMessage.bind(this);
		this.handleSys = this.handleSys.bind(this);
		this.writeMessage = this.writeMessage.bind(this);
	}
	componentDidMount(){
		const socket = this.socket = io(CHAT_URL);
		this.fetchEmotes();
		socket.on('connect', () => {
			socket.on('join', this.userJoin.bind(this));
			socket.on('leave', this.userLeave.bind(this));
			socket.on('msgs', this.handleMessage.bind(this));
			socket.on('users', this.handleUsers.bind(this));
			socket.on('sys', this.handleSys.bind(this));
			socket.on('privileged', this.handlePriv.bind(this));
			socket.emit('join', this.props.authentication.token || null);
		});
		socket.on('disconnect', () => {
			socket.emit('join', this.props.authentication.token || null);
		});
	}
	componentWillUnmount(){
		this.socket.removeAllListeners();
		this.socket.off('connect');
		this.socket.off('disconnect');
		this.socket.leave();
		this.socket.disconnect();
	}
	componentDidUpdate(){
		if(typeof document !== 'undefined'){
			let el = document.getElementsByClassName('chat-messages')[0];
			if(el && el.SimpleBar){
				el.SimpleBar.getScrollElement().scrollTop = el.SimpleBar.getScrollElement().scrollHeight;
			}
		}
	}
	async fetchEmotes(){
		let emotes = this.emotes;
		await fetch('/static/emotes/global.json')
		.then(async response => {
			const data = await response.json();
			for(const emote of Object.values(data)){
				emotes[emote.code] = {
					provider: 'guac',
					url: `/static/emotes/global/${emote.id}.png`,
				};
			}
		})
		.catch(() => {});

		await fetch('/static/emotes/twitch.json')
		.then(async response => {
			const data = await response.json();
			for(const emote of Object.values(data)){
				emotes[emote.code] = {
					provider: 'twitch',
					url: `//static-cdn.jtvnw.net/emoticons/v1/${emote.id}/1.0`,
				};
			}
		})
		.catch(() => {});

		await fetch('//api.betterttv.net/2/emotes')
		.then(async response => {
			const data = await response.json();

			for(const emote of data.emotes){
				emotes[emote.code] = {
					provider: 'betterttv',
					url: `//cdn.betterttv.net/emote/${emote.id}/1x`,
				};
			}
		})
		.catch(() => {});

		await fetch('https://api.frankerfacez.com/v1/set/global')
		.then(async response => {
			const data = await response.json();

			for(const set of Object.values(data.sets)){
				for(const emote of set.emoticons){
					emotes[emote.name] = {
						provider: 'frankerfacez',
						url: `${emote.urls['1']}`,
					};
				}
			}
		})
		.catch(() => {});

		//twitchemotes.com/api_cache/v3/global.json
		self.emotes = emotes;
		console.log('EMOTES', self.emotes);
	}
	handleUsers(args){
		let users = args[0];
		console.log('helllooo', users);
		users.forEach((user) => {
			console.log(user, user.name);
			if(user && user.name) this.userJoin(user);
		});
	}
	handlePriv(args){
		let privileged = args[0];
		if(typeof privileged !== 'array') return;
		this.privileged = privileged;
		// In case privilege has been added or removed for your user
		if(
			this.privileged.indexOf(this.me.id) > -1
		){
			this.hasPrivilege = true;
		}
	}
	userJoin(user){
		if(!user.name) return;
		if(!user.anon){
			this.users.set(user.name, user);
			if(this.props.authentication.user && user.name === this.props.authentication.user.name){
				this.me = this.props.authentication.user;
				if(
					this.props.channel.data.user.name === this.me.name
					|| this.privileged.indexOf(this.me.id) > -1
				){
					this.hasPrivilege = true;
				}
			}
		}
	}
	userLeave(user){
		if(!user.name) return;
		if(!user.anon){
			this.users.delete(user.name);
		}
	}
	handleSys(msg){
		let entry = {
			user: null,
			message: (
				<>
					<span className="chat-message-user orange b">
						SYSTEM MESSAGE:{'\u00A0'}
					</span>
					<span className="chat-message-content orange">
						{msg}
					</span>
				</>
			)
		};
		this.setState({ messages: this.state.messages.concat(entry) });
		this.cleanup();
	}
	handleMessage(user, messages) {
		let self = this;
		let entry;
		let writeMessage = ((message) => {
			this.setState({
				message
			});
		}).bind(this);
		if(!user || !messages) return;
		let output = messages.map((msg, i) => {
			if(!msg.type) return null;
			switch(msg.type){
				case 'emote':
					if(Object.keys(self.emotes).indexOf(msg.content) == -1) return null;
					let emote = self.emotes[msg.content];
					return (
						<React.Fragment key={'c-' + i + '-' + (new Date).getTime()}><img className="chat-message-content__emote dib" src={emote.url} alt={'Emote: ' + msg.content} title={msg.content + ' by ' + emote.provider} />{i !== messages.length -1 && '\u00A0'}</React.Fragment>
					);
				break;
				case 'text':
					return (
						<React.Fragment key={'u-' + i + '-'  + (new Date).getTime()}>{msg.content}{i !== messages.length -1 && '\u00A0'}</React.Fragment>
					);
				break;
				default:
					return false;
				break;
			}
		});
		let showModTools = this.hasPrivilege &&
			(this.me && this.me.name !== user.name) &&
			(this.privileged && this.privileged.indexOf(user.id) === -1);
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
							(this.users.get(user.name) && !this.users.get(user.name).banned) &&
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
							(this.users.get(user.name) && this.users.get(user.name).banned) &&
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
							(this.users.get(user.name) && !this.users.get(user.name).banned) &&
							<span className="mr2">
								<a
									href="#" 
									className="link color-inherit"
									title="Timeout user"
									onClick={() => {writeMessage(`/timeout ${user.name} 600`)}}
								>
									<FontAwesomeIcon icon='timeglass' />
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
		this.setState({ messages: this.state.messages.concat(entry) });
		this.cleanup();
	}
	writeMessage(event){
		this.setState({
			message: event.target.value
		});
	}
	sendMessage(){
		let self = this;
		let msg = this.state.message;

		// If this is a command
		if(msg.slice(0,1) === '/'){
			let args = msg.split(' ');
			let command = args.shift();
			console.log(args, command);
			switch(command){
				case '/users':
					let nicks = [];
					[...this.users].forEach((args) => {
						let user = args[1];
						if(user && user.name) nicks.push(user.name);
					});
					this.handleSys('User list: ' + nicks.join(' '));
				break;
				case '/ban':
					if(!this.hasPrivilege) return;
					if(args && args[0]){
						let user = this.users.get(args[0]);
						console.log('nei', user);
						this.socket.emit('ban', user && user.id);
					}
				break;
				case '/unban':
					if(!this.hasPrivilege) return;
					if(args && args[0]){
						let user = this.users.get(args[0]);
						this.socket.emit('unban', user && user.id);
					}
				break;
				case '/mod':
					if(!this.hasPrivilege) return;
					if(
						this.me
						&& this.props.channel.data.user.name !== this.me.name
					){
						return;
					}
					if(args && args[0]){
						let user = this.users.get(args[0]);
						console.log('nei', user);
						this.socket.emit('mod', user && user.id);
					}
				break;
				case '/unmod':
					if(!this.hasPrivilege) return;
					if(
						this.me
						&& this.props.channel.data.user.name !== this.me.name
					){
						return;
					}
					if(args && args[0]){
						let user = this.users.get(args[0]);
						this.socket.emit('unmod', user && user.id);
					}
				break;
				case '/timeout':
					if(!this.hasPrivilege) return;
					if(args && args[0]){
						let user = this.users.get(args[0]);
						let time = typeof args[1] === 'number' ? args[1] : 600;
						this.socket.emit('timeout', user && user.id, time);
					}
				break;
			}
		}else{
			let msgs = msg && msg.split(' ');
			if(!msg) return;
			msgs = msgs.map((msg) => {
				return {
					type: Object.keys(self.emotes).indexOf(msg) > -1 ? 'emote' : 'text',
					content: msg
				};
			});
			this.socket.emit('message', msgs);
		}
		
		// empty the message box
		this.setState({
			message: ''
		})
	}

	cleanup(){
		const lines = this.state.messages;
		if(lines.length >= this.maxlines){
            this.setState({
            	messages: lines.slice(-this.maxlines)
            });
		}
	}

	render() {
		return (
			<>
				<div className="flex flex-column flex-grow-1 flex-nowrap overflow-hidden">
					<SimpleBar className="chat-messages flex-grow-1" style={{ height: '80vh' }}>
					{
						this.state.messages
						&&
						this.state.messages
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
						value={this.state.message}
						onChange={this.writeMessage}
						className="w-100 pa2 br2 input-reset ba db"
						loadingComponent={() => <span>Loading</span>}
						style={{
							'paddingRight': '6rem'
						}}
						ref={rta => {
							this.rta = rta;
						}}
						innerRef={textarea => {
							this.textarea = textarea;
						}}
						textAreaComponent={{ component: AutoTextarea, ref: "innerRef" }}
						minChar={2}
						rows={1}
						trigger={{
							':': {
								dataProvider: token => {
									if(!token || !token.length){
										return Object.keys(this.emotes)
										.map((name) => {
											return {
												name,
												char: name,
												img: `<img src='${this.emotes[name].url}'/>`
											}
										});
									}
									return Object.keys(this.emotes)
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
											img: `<img src='${this.emotes[name].url}'/>`
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
							<div className="relative">dab</div>
						</div>
						<div className="content-center items-center flex flex-row">
							<input type="button" value="Chat" onClick={this.sendMessage} className="white dib pv2 ph3 nowrap lh-solid pointer br2 ba b--transparent bg-green" />
						</div>
					</div>
				</div>
			</>
		);
	}
}
export default connect(state => state)(Chat);