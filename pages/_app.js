// pages/_app.js
import React from 'react';

import {Provider} from 'react-redux';
import App, {Container} from 'next/app';
import withRedux from 'next-redux-wrapper';

import configureStore from '../store/configureStore';

import PageLayout from '../components/layout/PageLayout';

import { getCookie } from '../utils/cookie';
export default withRedux(configureStore)(class MyApp extends App {
	static async getInitialProps({Component, ctx}) {
		let mode = getCookie('site-mode', ctx.req) === 'dark' ? 'SET_DARK_MODE' : 'SET_LIGHT_MODE';
		ctx.store.dispatch({
			type: mode
		});
		return {
			pageProps: {
				// Call page-level getInitialProps
				...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
				// Some custom thing for all pages
				pathname: ctx.pathname
			}
		};
	}

	render() {
		const {Component, pageProps, store} = this.props;
		return (
			<Container>
				<Provider store={store}>
					<PageLayout>
						<Component {...pageProps} />
					</PageLayout>
				</Provider>
			</Container>
		);
	}

});