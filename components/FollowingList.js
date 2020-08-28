import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { callApi } from 'services/api';

import { Trans } from '@lingui/macro';

function FollowingList(props){
	const dispatch = useDispatch();
    const channel = useSelector(state => state.channel);
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState([]);

    var users = [];

    const fetchFollowing = async (id) => {
        await callApi(`/follows`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from_id: id
            })
        })
        .then(response => response.json())
        .then((res) => {
            if(res.data){
                res.data.forEach((user, i) => {
                    users.push({
                        ...user
                    });

                    if(i == res.data.length - 1){
                        setFollowing(users);
                        setLoading(false);
                    }
                });
                if(res.data.length === 0){
                    setLoading(false);
                }
            }
        })
        .catch((err) => {
            console.error(err);
        });
    }

	useEffect(() => {
		if(channel && channel.data && channel.data.user) fetchFollowing(channel.data.user.id);
		//
	}, []);

	return loading
            ?
            (<span>Loading...</span>)
            :
            (<div className="flex flex-column bb b--gray pb4">
                <span className="f5 b tracked mt0 mb3"><Trans>Following:</Trans></span>
                <span className="f6 b tracked mt0 mb3 gray"><Trans>Page</Trans> 1 <Trans>of</Trans> 1</span>
                <ul className="pa0 ma0 list">
                    {
                        following &&
                        following.map((u) => {
                            return (
                                <li key={`users_${u.username}`} className="flex flex-grow-1">{u.username}</li>
                            );
                        })
                    }
                    {
                        following &&
                        following.length == 0 &&
                        <span><Trans>This streamer is not following anyone :)</Trans></span>
                    }
                </ul>
            </div>);
}
export default FollowingList;