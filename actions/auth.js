import { callApi } from '../services/api';

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
		} else {
			dispatch({
				type: 'AUTHENTICATE_FAILURE',
				error: new Error(json && json.statusMessage)
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

export const register = (username, password) => async (dispatch) => {
	dispatch({
		type: 'AUTHENTICATE_REQUEST'
	})
	return callApi('/register', {
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
		} else {
			dispatch({
				type: 'AUTHENTICATE_FAILURE',
				error: new Error(json && json.statusMessage)
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

// gets the token from the cookie, request user data, and save it in the store
export const reauthenticate = (token) => async (dispatch) => {
	if(!token) throw new Error('reauthenticate: no token provided')
	/* TODO: Find out why this is required to make initialize work in dashboard */
	dispatch({
		type: 'AUTHENTICATE_SUCCESS',
		statusCode: 200,
		jwtToken: token
	});
	dispatch({
		type: 'AUTHENTICATE_REQUEST'
	});
	return callApi('/tokenAuth', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		accessToken: token
	})
	.then(response => response.json())
	.then((json) => {
		if (json.statusCode == 200) {
			dispatch({
				type: 'AUTHENTICATE_SUCCESS',
				statusCode: 200,
				jwtToken: json.token,
				user: json.user
			});
			setCookie('token', json.token);
		} else {
			dispatch({
				type: 'AUTHENTICATE_FAILURE',
				error: new Error('Invalid reauthenticate json result: ' + JSON.stringify(json))
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

// removing the token
export const deauthenticate = () => async (dispatch) => {
	removeCookie('token');
	dispatch({
		type: 'DEAUTHENTICATE'
	});
};