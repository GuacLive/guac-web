import Router from 'next/router';
import * as actions from '../actions';
import { getCookie } from '../utils/cookie';

// checks if the page is being loaded on the server, and if so, get auth token from the cookie:
const initialize = function({store, pathname, query, req}) {
	const isServer = typeof window === 'undefined';

	if(isServer){
		if(req.headers.cookie){
			const token = getCookie('token', req);
			if(token) store.dispatch(actions.reauthenticate(token));
		}
	}else{
		const auth = store.getState().authentication;

		if(auth && auth.token && (pathname === '/auth/login' || pathname === '/auth/register')){
			setTimeout(function() {
				Router.push('/');
			}, 0);
		}
	}
};
export default initialize;