import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux';

import {useDispatch, useSelector} from 'react-redux';

import { Trans } from '@lingui/macro';

import * as actions from '../../actions';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

function Brand(props){
	const dispatch  = useDispatch();
	
	const {streaming, channel} = props;
	const auth = props.authentication;
	if(auth.loading) return null;
	if(auth.error) throw auth.error;
	if(streaming.loading) return null;
	if(channel.loading) return null;
    if(streaming.error) throw streaming.error;
	if(auth && auth.user && !auth.user.can_stream) return <p><Trans>You do not have permission to stream</Trans></p>;
	return (
        <div className="flex flex-row flex-wrap w-100">
            <AvatarUpload user={auth.user} />
        </div>
	);
}
export default connect(state => state)(Brand)