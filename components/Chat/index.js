import React from 'react';

import classNames from 'classnames'

import io from 'socket.io-client';

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
const { CHAT_URL } = publicRuntimeConfig;
export default class Chat extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			message: '',
			messages: []
		};
		this.users = {};
		this.socket = null;

		this.sendMessage  = this.sendMessage.bind(this);
		this.handleSys = this.handleSys.bind(this);
		this.writeMessage = this.writeMessage.bind(this);
	}
	componentDidMount() {
		const socket = this.socket = io(CHAT_URL);
		socket.on('connect', () => {
			socket.on('join', this.userJoin);
			socket.on('leave', this.userLeave);
			socket.on('msgs', this.handleMessage);
			socket.on('sys', this.handleSys);
			socket.emit('join');
		});
	}
	userJoin(user){
		if(!user.id) return;
		if(!user.anon){
			this.users[user.id] = user;
		}
	}
	userLeave(user){
		if(!user.id) return;
		if(!user.anon){
			delete this.users[user.id];
		}
	}
	handleSys(msg){
		let entry = {
			user: null,
			message: (
				<>
					<span className="chat-message-user red b">
						<span>SYSTEM MESSAGE: </span>
					</span>
					<span className="chat-message-content red">
						{msg}
					</span>
				</>
			)
		};
		this.setState({ messages: this.state.messages.concat(entry) });
	}
	handleMessage(user, messages) {
		let entry;
		let output = messages.forEach((msg) => {
			if(!msg.type) return;
			switch(msg.type){
				case 'emote':
					return (
						<span><img src="/emotes/{msg.content}" alt={msg.content} /></span>
					);
				break;
				case 'text':
					return (
						<span>{msg.content}</span>
					);
				break;
			}
		});
		entry = {
			user,
			message: (
				<>
					<span className="chat-message-user b">
						<span>{user.name}: </span>
					</span>
					<span className="chat-message-content">
						{output.join('')}
					</span>
				</>
			)
		};
		this.setState({ messages: this.state.messages.concat(entry) });
	}
	writeMessage(event){
		this.setState({
			message: event.target.value
		});
	}
	sendMessage(){
		this.socket.emit('message', this.state.message);
	}
	render() {
		return (
			<>
				<div className="chat-messages">
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
				</div>
				<div className="chat-input">
					<textarea value={this.state.message} onChange={this.writeMessage} />
					<input type="button" value="Chat" onClick={this.sendMessage} />
				</div>
			</>
		);
	}
}