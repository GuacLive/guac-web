import React, { Component } from 'react';
import Switch from 'react-switch';

import { connect } from 'react-redux';
import { setCookie } from '../../utils/cookie';
class DarkModeToggle extends Component {
	constructor(props) {
		super();
		this.state = { checked: props.mode === 'dark' };
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (this.props.mode !== prevProps.mode) {
			this.setState({
				checked: this.props.mode === 'dark'
			});
		}
	}

	handleChange(checked) {
		this.setState({ checked });
		this.props.dispatch({
			type: checked ? 'SET_DARK_MODE' : 'SET_LIGHT_MODE'
		})
		setCookie('site-mode', checked ? 'dark' : 'light');
	}

	render() {
		return (
			<label>
				<Switch
					onChange={this.handleChange}
					checked={this.state.checked}
					offColor="#212121"
					onColor="#F1F1F1"
					onHandleColor="#212121"
					offHandleColor="#F1F1F1"
					uncheckedIcon={<span>☀️</span>}
					checkedIcon={<span>🌙</span>}
				/>
			</label>
		);
	}
}
export default connect(state => state)(DarkModeToggle);