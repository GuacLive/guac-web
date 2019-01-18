import React from 'react';

import classNames from 'classnames'

import ChatMessage from '../ChatMessage';

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
const { CHAT_URL } = publicRuntimeConfig;
export default class Chat extends React.Component {
	constructor(props){
		super(props);
		this.props = {
			channel: props.channel,
			message: props.message
		};
		this.props.messages = [];
		this.users = {};

		this.writeMessage = this.writeMessage.bind(this);
	}
	componentDidMount() {
		const socket = socketIOClient(CHAT_URL + `/${this.props.channel}`);
		socket.on('connection', (socket) => {
			socket.on('join', this.userJoin);
			socket.on('leave', this.userLeave);
			socket.on('msgs', this.handleMessage);
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
	handleMessage(user, messages) {
		let output = messages.forEach((msg) => {
			if(!msg.type) return;
			switch(msg.type){
				case 'emote':
					return (
						<span className="chat-message-line">
							<img src="/emotes/{msg.content}" alt={msg.content} />
						</span>
					);
				break;
				case 'text':
					return (
						<span className="chat-message-line">
						{msg.content}
						</span>
					);
				break;
			}
		});
		this.props.messages.push({
			user,
			messages: output
		});
	}
	writeMessage(message){
		this.setState({
			message
		});
	}
	render() {
		return (
			<div className="chat-messages">
				{
					this.props.messages
					.sort((a,b) => {
						return a.time > b.time;
					})
					.forEach((msg) => {
						return (
							<div className="chat-message">{msg}</div>
						);
					})
				}
			</div>
			<div className="chat-input">
				<textarea value={this.state.message} onChange={writeMessage} />
			</div>
		);
	}
}