import { Component } from 'react';
import Switch from 'react-switch';

import { Trans } from '@lingui/macro';
import { connect } from 'react-redux';
import { setCookie } from 'utils/cookie';
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
			<div className="flex items-center tw-relative pa2 relative w-100 link b white ph3 pointer" onClick={() => {this.handleChange(!this.state.checked)}}>
				<div className="items-center flex flex-shrink-0 pr2">
					<div className="items-center inline-flex">
						<i className="fas fa-fw fa-moon"></i>
					</div>
				</div>
				<div className="flex-grow-1 mr2"><Trans>Dark Mode</Trans></div>
				<div className="flex flex-column">
					<label className="flex flex-row self-center">
						<Switch
							onChange={this.handleChange}
							onColor="#19a974"
							checked={this.state.checked}
						/>
					</label>
				</div>
			</div>
		);
	}
}
export default connect(state => state)(DarkModeToggle);