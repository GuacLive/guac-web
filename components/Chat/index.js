import React from 'react';

import {connect} from 'react-redux';

import classNames from 'classnames'

import io from 'socket.io-client';

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.css';

import fetch from 'cross-fetch';

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
const { CHAT_URL } = publicRuntimeConfig;
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
			socket.on('sys', this.handleSys.bind(this));
			socket.emit('join', this.props.authentication.token || null);
		});
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
		await fetch('//api.betterttv.net/2/emotes')
		.then(async response => {
			const data = await response.json();

			for (const emote of data.emotes) {
				emotes[emote.code] = {
					provider: 'betterttv',
					url: `//cdn.betterttv.net/emote/${emote.id}/1x`,
				};
			}
		})
		.catch(() => {});

		await fetch('//api.frankerfacez.com/v1/set/global')
		.then(async response => {
			const data = await response.json();

			for (const set of Object.values(data.sets)) {
				for (const emote of set.emoticons) {
					emotes[emote.name] = {
						provider: 'frankerfacez',
						url: `${emote.urls['1']}`,
					};
				}
			}
		})
		.catch(() => {});
		self.emotes = emotes;
		console.log('EMOTES', self.emotes);
	}
	userJoin(user){
		if(!user.id) return;
		if(!user.anon){
			this.users.set(user.name, user);
		}
	}
	userLeave(user){
		if(!user.id) return;
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
						<span>SYSTEM MESSAGE: </span>
					</span>
					<span className="chat-message-content red">
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
		if(!user || !messages) return;
		let output = messages.map((msg) => {
			if(!msg.type) return null;
			switch(msg.type){
				case 'emote':
					if(Object.keys(self.emotes).indexOf(msg.content) == -1) return null;
					let emote = self.emotes[msg.content];
					return (
						<span key={'c'+(new Date).getTime()}><img src={emote.url} alt={msg.content + ' by ' + emote.provider} /></span>
					);
				break;
				case 'text':
					return (
						<span key={'c'+(new Date).getTime()}>{msg.content}</span>
					);
				break;
				default:
					return false;
				break;
			}
		});
		entry = {
			user,
			message: (
				<>
					<span className="chat-message-user b">
						<span><a href={'/c/' + user.name} className="link color-inherit">{user.name}</a>: </span>
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
		let msgs = msg && msg.split(' ');
		if(!msg) return;
		msgs = msgs.map((msg) => {
			return {
				type: Object.keys(self.emotes).indexOf(msg) > -1 ? 'emote' : 'text',
				content: msg
			};
		});
		this.socket.emit('message', msgs);
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
				<SimpleBar className="chat-messages" style={{ height: '560px' }}>
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
				<div className="chat-input">
					<textarea value={this.state.message} onChange={this.writeMessage} />
					<input type="button" value="Chat" onClick={this.sendMessage} />
				</div>
			</>
		);
	}
}
export default connect(state => state)(Chat);