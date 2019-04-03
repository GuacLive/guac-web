export function resetSite() {
	return {
		type: 'RESET_SITE'
	};
};

export function setDarkMode() {
	return {
		type: 'SET_DARK_MODE'
	};
}

export function setLightMode() {
	return {
		type: 'SET_LIGHT_MODE'
	};
}

export const fetchMyFollowed = (from_id) => async (dispatch) => {
	dispatch({
		type: 'FETCH_MY_FOLLOWED_REQUEST'
	});
	return callApi('/follows',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				from_id,
			})
		}
	)
	.then(response => response.json())
	.then((json) => {
		if (json.statusCode == 200) {
			dispatch(Object.assign({
				type: 'FETCH_MY_FOLLOWED_SUCCESS'
			}, json));
		} else {
			dispatch({
				type: 'FETCH_MY_FOLLOWED_FAILURE',
				error: new Error('Invalid status code in follows json: ' + JSON.stringify(json))
			});
		}
	})
	.catch(error => {
        dispatch({
          type: 'FETCH_MY_FOLLOWED_FAILURE',
          error
        });
	});
};