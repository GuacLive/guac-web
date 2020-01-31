import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { withI18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import GuacButton from '../../components/GuacButton';

import withAuth from '../../utils/withAuth';

import * as actions from '../../actions';

function AdminIndexPage(props){
	const dispatch = useDispatch();
	const auth = useSelector(state => state.authentication);
	const username = useRef();
	if(auth.loading) return null;
	if(auth.error) throw auth.error;
	if(
		auth
		&&
		auth.user
		&&
		(auth.user.type !== 'admin' && auth.user.type !== 'staff')
	){
		return <p>You do not have permission to view this page</p>;
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(actions.giveStreamPermission(auth.token, username.current.value));
	};

	return (
		<>
			<div className="w-100">
				<h2 className="f2 tracked mt0 mb3">Admin</h2>
				<div className="pa1">
					<div className="flex flex-wrap flex-auto flex-row-l flex-column items-stretch flex-nowrap">
						<div className="flex flex-column flex-grow-1 flex-nowrap ph1">
							<div className="flex h-100-l flex-grow-1 pa2">
								<div className="flex-column">
									<h3 className="f3 tracked primary"><Trans>Stream Manager</Trans></h3>
									<GuacButton color="blue" url="/admin/stream"><Trans>Manage</Trans></GuacButton>
								</div>
							</div>
							<div className="flex h-100-l flex-grow-1 pa2">
								<div className="flex-column">
									<h3 className="f3 tracked primary"><Trans>Streaming permissions</Trans></h3>
									<form className="measure" onSubmit={handleSubmit}>
										<label htmlFor="username"><Trans>Username:</Trans></label>
										<input name="username" type="text" className="input-reset bn pa3 w-100 bg-white br2" ref={username} />
										<input type="submit" value="Give permission" className="link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--green bg-green ml1" />
									</form>
								</div>
							</div>
						</div>
						<div className="flex flex-column flex-grow-1 flex-nowrap ph1">
							<div className="flex h-100-l flex-grow-1 pa2">
								<div className="flex-column">
									<h3 className="f3 tracked primary"><Trans>Information</Trans></h3>
									<Trans>This page is scuffed and incomplete LOL</Trans>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default withI18n()(withAuth(AdminIndexPage))