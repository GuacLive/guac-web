import { callApi } from '../services/api';

import Router from 'next/router';
import { setCookie, removeCookie } from '../utils/cookie';

// gets token from the api and stores it in the redux store and in cookie
export const authenticate = (username, password) => async (dispatch) => {
	dispatch({
		type: 'AUTHENTICATE_REQUEST'
	})
	return callApi('/auth', {
		method: 'POST',
		body: JSON.stringify({
			username,
			password
		})
	})
	.then(response => response.json())
	.then((json) => {
		if (json.statusCode == 200) {
			dispatch(Object.assign({
				type: 'AUTHENTICATE_SUCCESS'
			}, json));
			setCookie('token', json.jwtToken);
			Router.push('/');
		} else {
			dispatch({
				type: 'AUTHENTICATE_FAILURE',
				error: new Error('Invalid authenticate json result: ' + JSON.stringify(json))
			});
		}
	})
	.catch(error => {
        dispatch({
          type: 'AUTHENTICATE_FAILURE',
          error
        });
	});
};
// gets the token from the cookie and saves it in the store
export const reauthenticate = (token) => async (dispatch) => {
	dispatch({
		type: 'AUTHENTICATE_SUCCESS',
		statusCode: 200,
		jwtToken: token
	});
};

// removing the token
export const deauthenticate = () => async (dispatch) => {
	removeCookie('token');
	Router.push('/');
	dispatch({
		type: 'DEAUTHENTICATE'
	});
};