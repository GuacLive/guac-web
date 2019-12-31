import React from 'react';
import Link from 'next/link'

import classNames from 'classnames'
export default class extends React.Component {

	render() {
		const isActive = this.props.isActive;
		// dib pv2 ph3 nowrap lh-solid pointer br2 ba b--transparent
		const buttonClass = classNames(`link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--${this.props.border || this.props.color || 'transparent'} bg-${this.props.color || 'transparent'} guac-btn`)
		return this.props.children ? (
			<Link href={this.props.url || '#'}><a className={buttonClass} children={this.props.children} onClick={this.props.onClick} /></Link>
		) : null
	}
}