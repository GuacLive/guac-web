import React from 'react';

import classNames from 'classnames'
export default class extends React.Component {

	render() {
		const isActive = this.props.isActive;
		// dib pv2 ph3 nowrap lh-solid pointer br2 ba b--transparent
		const buttonClass = classNames(`link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--${this.props.border || this.props.color || 'transparent'} bg-${this.props.color || 'transparent'}`)
		return this.props.children ? (
			<a href={this.props.url || '#'} className={buttonClass} children={this.props.children} />
		) : null
	}
}