import { callApi } from 'services/api';

import { setCookie, removeCookie } from 'utils/cookie';

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
				type: 'AUTHENTICATE_SUCCESS',
				token: json.jwtToken
			}, json));
			setCookie('token', json.jwtToken);
		} else {
			dispatch({
				type: 'AUTHENTICATE_FAILURE',
				error: new Error(json && json.error)
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

export const register = (username, email, password) => async (dispatch) => {
	dispatch({
		type: 'REGISTER_REQUEST'
	})
	return callApi('/register', {
		method: 'POST',
		body: JSON.stringify({
			username,
			email,
			password
		})
	})
	.then(response => response.json())
	.then((json) => {
		if (json.statusCode == 200) {
			dispatch(Object.assign({
				type: 'REGISTER_SUCCESS'
			}, json));
			setCookie('token', json.jwtToken);
		} else {
			dispatch({
				type: 'REGISTER_FAILURE',
				error: new Error(json && json.statusMessage)
			});
		}
	})
	.catch(error => {
        dispatch({
          type: 'REGISTER_FAILURE',
          error
        });
	});
};

// gets the token from the cookie, request user data, and save it in the store
export const reauthenticate = (token) => async (dispatch) => {
	if(!token) throw new Error('reauthenticate: no token provided')
	/* TODO: Find out why this is required to make initialize work in dashboard */
	await Promise.all([
		dispatch({
			type: 'AUTHENTICATE_SUCCESS',
			statusCode: 200,
			token: token
		}),
		dispatch({
			type: 'AUTHENTICATE_REQUEST'
		})
	]);
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
				token: json.token,
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


export const setPassword = (token, password) => async (dispatch) => {
	dispatch({
	  type: 'CHANGE_PASSWORD_REQUEST'
	});
	return callApi('/user/password', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		accessToken: token,
		body: JSON.stringify({
			password
		})
	})
	.then(response => response.json())
	.then((json) => {
		if (json.statusCode == 200) {
			dispatch(Object.assign({
				type: 'CHANGE_PASSWORD_SUCCESS'
			}, json));
		} else {
			dispatch({
				type: 'CHANGE_PASSWORD_FAILURE',
				error: new Error(json && json.statusMessage)
			});
		}
	})
	.catch(error => {
        dispatch({
          type: 'CHANGE_PASSWORD_FAILURE',
          error
        });
	});
};

export const setColor = (token, color) => async (dispatch) => {
	dispatch({
	  type: 'CHANGE_COLOR_REQUEST'
	});
	return callApi('/user/color', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		accessToken: token,
		body: JSON.stringify({
			color
		})
	})
	.then(response => response.json())
	.then((json) => {
		if (json.statusCode == 200) {
			dispatch(Object.assign({
				type: 'CHANGE_COLOR_SUCCESS'
			}, json));
		} else {
			dispatch({
				type: 'CHANGE_COLOR_FAILURE',
				error: new Error(json && json.statusMessage)
			});
		}
	})
	.catch(error => {
        dispatch({
          type: 'CHANGE_COLOR_FAILURE',
          error
        });
	});
};