import React, {useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLingui} from '@lingui/react';
import {Trans, t} from '@lingui/macro';
import * as actions from 'actions';

import AvatarUpload from 'components/AvatarUpload';

function ProfileComponent(props) {
	const {i18n} = useLingui();
	const dispatch = useDispatch();
	const auth = useSelector(state => state.authentication);
	const color = useRef();
	const password = useRef();

	function handleSubmit(e) {
		e.preventDefault();
		if (color.current.value) {
			dispatch(
				actions.setColor(auth.token, color.current.value)
			);
		}
		if (password.current.value) {
			dispatch(
				actions.setPassword(auth.token, password.current.value)
			);
		}
	}

	return (
		<>
			{auth.error &&
				<div className="red"><Trans>Error</Trans>: {auth.error.message}</div>
			}
			<form className="measure" onSubmit={handleSubmit}>
				<AvatarUpload user={auth.user} />
				<div className="primary"><span className="b"><Trans>E-mail</Trans></span>: {auth.user.email || 'None'}</div>
				<label htmlFor="color" className="b"><Trans>Color</Trans>:</label>
				<input name="color" type="color" disabled={auth.user.patreon ? false : true} className="input-reset bg-white br2" ref={color} placeholder={i18n._(t`Color`)} defaultValue={auth.user.color ? `#${auth.user.color}` : null} />
				<div className="primary f7"><Trans>Want to customize your color? <a target="_blank" rel="noreferrer" href="https://www.patreon.com/join/guaclive" className="primary b"><Trans>Join our Patreon!</Trans></a></Trans></div>
				<label htmlFor="password" className="b"><Trans>New password:</Trans></label>
				<input name="password" type="password" className="input-reset bn pa3 w-100 bg-white br2" ref={password} placeholder={i18n._(t`Password`)} />
				<input type="submit" value={i18n._(t`Edit user`)} className="link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--green bg-green ml1" />
			</form>
		</>
	);
}
export default ProfileComponent;