import {connect} from 'react-redux';

import React, {useEffect} from 'react'

import { Trans } from '@lingui/macro';

import { useDispatch, useSelector } from 'react-redux';

import * as actions from 'actions/';

import dynamic from 'next/dynamic';
const AvatarUpload = dynamic(() => import('components/AvatarUpload'));
const BannerUpload = dynamic(() => import('components/BannerUpload'));

function Brand(props){
	const dispatch = useDispatch();

	useEffect(() => {
		const {authentication} = props;
		dispatch(actions.fetchStreaming(authentication.token));
	}, []);
	
	const {streaming} = props;
	const auth = props.authentication;
	if(auth.loading) return null;
	if(auth.error) throw auth.error;
	if(streaming.loading) return null;
    if(streaming.error) throw streaming.error;
	if(auth && auth.user && !auth.user.can_stream) return <p><Trans>You do not have permission to stream</Trans></p>;
	return (
        <div className="flex flex-row flex-wrap w-100">
            <div className="w-100"><AvatarUpload user={auth.user} /></div>
            <div className="w-100"><BannerUpload user={auth.user} streaming={streaming} /></div>
        </div>
	);
}
export default connect(state => state)(Brand)