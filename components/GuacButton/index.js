import React from 'react';
import Link from 'next/link'

import classNames from 'classnames'
export default function GuacButton(props){
		const isActive = props.isActive;
		// dib pv2 ph3 nowrap lh-solid pointer br2 ba b--transparent
		const buttonClass = classNames(`link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--${props.border || props.color || 'transparent'} bg-${props.color || 'transparent'} guac-btn`)
		return props.children ? (
			<Link href={props.url || '#'}><a className={buttonClass} onClick={props.onClick}>{props.children}</a></Link>
		) : null
	}