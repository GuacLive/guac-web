import React, {Component} from 'react';
import * as Sentry from '@sentry/node';

export default class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = {hasError: false};
	}
	componentDidCatch(error, errorInfo) {
		Sentry.withScope((scope) => {
			Object.keys(errorInfo).forEach((key) => {
				scope.setExtra(key, errorInfo[key]);
			});

			Sentry.captureException(error);
		});

		super.componentDidCatch(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
		  return <h1>Something went wrong.</h1>;
		}
		return this.props.children;
	}
}