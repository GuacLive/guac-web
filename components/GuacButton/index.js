import React from 'react';

import classNames from 'classnames'
export default class extends React.Component {

	render() {
		const isActive = this.props.isActive;
		// dib pv2 ph3 nowrap lh-solid pointer br2 ba b--transparent
		const buttonClass = classNames(`link black dib pv2 ph3 nowrap lh-solid pointer br2 ba hover-b--blue bg-${this.props.color || 'transparent'}`)
		return this.props.children ? (
			<a href={this.props.url || '#'} className={buttonClass} children={this.props.children} />
		) : null
	}
}