import React, {Component} from 'react';
import * as Sentry from "@sentry/nextjs";
export default class ExampleBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = {error: null};
	}
	componentDidCatch(error, errorInfo) {
		this.setState({error});
		Sentry.withScope((scope) => {
			Object.keys(errorInfo).forEach((key) => {
				scope.setExtra(key, errorInfo[key]);
			});
			Sentry.captureException(error);
		});
	}
	render() {
		if (this.state.error) {
			return (
				<div
					className="snap primary min-vh-100 flex flex-column justify-center items-center w-100 h-100 tc"
					onClick={() => Sentry.lastEventId() && Sentry.showReportDialog()}
				>
					<img src="/img/error.png" />
					<p>We're sorry — something's gone wrong.</p>
					<p>Our team has been notified, but click here fill out a report.</p>
					<p>Or refresh the page and try again.</p>
				</div>
			);
		} else {
			//when there's not an error, render children untouched
			return this.props.children;
		}
	}
}