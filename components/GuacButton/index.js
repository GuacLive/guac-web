import React from 'react';

import classNames from 'classnames'
export default class extends React.Component {

	render() {
		const isActive = this.props.isActive;
		// dib pv2 ph3 nowrap lh-solid pointer br2 ba b--transparent
		const buttonClass = classNames('dib pv2 ph3 nowrap lh-solid pointer br2 ba hover-b--blue')
		return this.props.children ? (
			<div className={buttonClass} children={this.props.children} />
		) : null
	}
}