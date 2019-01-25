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
			message: ''
		};
		this.messages = [];
		this.users = {};

		this.writeMessage = this.writeMessage.bind(this);
	}
	componentDidMount() {
		const socket = io(CHAT_URL + '/' + this.props.channel);
		socket.on('connection', (socket) => {
			socket.on('join', this.userJoin);
			socket.on('leave', this.userLeave);
			socket.on('msgs', this.handleMessage);
		});
		socket.emit('join');
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
	handleMessage(user, messages) {
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
		this.messages.push({
			user,
			message: (
				<span className="chat-message-user">
					<span>{user.name}: </span>
				</span>
				<span className="chat-message-content">
					{messages.join('')}
				</span>
			)
		});
	}
	writeMessage(message){
		this.setState({
			message
		});
	}
	render() {
		return (
			<>
				<div className="chat-messages">
					{
						this.messages
						&&
						this.messages
						.sort((a,b) => {
							return a.time > b.time;
						})
						.forEach((data) => {
							return (
								<div className="chat-message">{data.message}</div>
							);
						})
					}
				</div>
				<div className="chat-input">
					<textarea value={this.state.message} onChange={this.writeMessage} />
				</div>
			</>
		);
	}
}