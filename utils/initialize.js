import Router from 'next/router';
import * as actions from '../actions';
import { getCookie } from '../utils/cookie';

// checks if the page is being loaded on the server, and if so, get auth token from the cookie:
export default function({store, isServer, pathname, query, req}) {
	if(isServer){
		if(req.headers.cookie){
			store.dispatch(actions.reauthenticate(getCookie('token', req)));
		}
	}
}