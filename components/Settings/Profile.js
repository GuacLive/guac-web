import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLingui } from '@lingui/react';
import { Trans, t } from '@lingui/macro';
import * as actions from '../../actions';
function ProfileComponent(props){
	const { i18n } = useLingui();
	const dispatch = useDispatch();
	const auth = useSelector(state => state.authentication);
	const password = useRef();

	function handleSubmit(e){
		e.preventDefault();
		dispatch(
			actions.setPassword(auth.token, password.current.value)
		);
	}

	return (
		<>
			{auth.error &&
				<div className="red"><Trans>Error</Trans>: {auth.error.message}</div>
			}
			<div className="primary"><span className="b"><Trans>E-mail</Trans></span>: {auth.user.email || 'None'}</div>
			<div className="primary"><span className="b"><Trans>Color</Trans></span>: <span style={{color: auth.user.color}}>{auth.user.color || 'Default'}</span></div>
			<div className="primary f7"><Trans>Want to customize your color? <a target="_blank" href="https://www.patreon.com/join/guaclive" className="primary b"><Trans>Join our Patreon!</Trans></a></Trans></div>
			<form className="measure" onSubmit={handleSubmit}>
				<label htmlFor="password" className="b"><Trans>New password:</Trans></label>
				<input name="password" type="password" className="input-reset bn pa3 w-100 bg-white br2" ref={password} placeholder={i18n._(t`Password`)} />
				<input type="submit" value={i18n._(t`Edit user`)} className="link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--green bg-green ml1" />
			</form>
		</>
	);
}
export default ProfileComponent;