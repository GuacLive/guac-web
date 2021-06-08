import {Component, createRef, useState} from 'react';

import Link from 'next/link';

import {useDispatch, useSelector} from 'react-redux';

import {useLingui} from '@lingui/react';
import {Trans, t} from '@lingui/macro';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import GuacButton from '../../components/GuacButton';

import withAuth from '../../utils/withAuth';

import * as actions from '../../actions';

const API_URL = process.env.API_URL;
function AdminBanPage(props) {
	const dispatch = useDispatch();
	const {i18n} = useLingui();
	const auth = useSelector(state => state.authentication);
	const [message, setMessage] = useState('');

	const username = createRef();
	const reason = createRef();

	if (auth.loading) return null;
	if (auth.error) throw auth.error;
	if (
		auth
		&&
		auth.user
		&&
		(auth.user.type !== 'admin' && auth.user.type !== 'staff')
	) {
		return <p>You do not have permission to view this page</p>;
	}

	const getUserId = async (username) => {
		var data;
		await fetch(`${API_URL}/auth/username/${username}`, {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		})
		.then(response => response.json())
		.then(r => {
			data = r;
		});
		return data?.user?.user_id;
	}

	const banUser = async () => {
		var id = await getUserId(username?.current?.value);
		dispatch(actions.banUser(auth.token, id, reason?.current?.value));
		setMessage(`${username?.current?.value} is now banned`);
	};
	const unbanUser = async () => {
		var id = await getUserId(username?.current?.value);
		dispatch(actions.unbanUser(auth.token, id));
		setMessage(`${username?.current?.value} is now unbanned`);
	};

	const {bans} = props;
	return (
		<>
			<div className="w-100">
				<h2 className="f2 tracked mt0 mb3"><Link href="/admin"><a className="link underline primary">Admin</a></Link> &middot; <Trans>Ban</Trans></h2>
				<div>{message}</div>
				<div className="flex h-100-l flex-grow-1 pa2">
					<div className="flex-column">
						<h3 className="f3 tracked primary"><Trans>User</Trans></h3>
						<form className="measure">
							<label htmlFor="username"><Trans>Username:</Trans></label>
							<input name="username" type="text" className="input-reset bn pa3 w-100 bg-white br2" ref={username} />
							<label htmlFor="reason"><Trans>Reason:</Trans></label>
							<textarea name="reason" className="input-reset bn pa3 w-100 bg-white br2 outline-0" ref={reason} />
							<input onClick={banUser} type="button" value="Ban" className="link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--red bg-red ml1" />
							<input onClick={unbanUser} type="button" value="Unban" className="link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--green bg-green ml1" />
						</form>
						<div className="pa1">
							<h3 className="f3 tracked primary"><Trans>Bans</Trans></h3>
							<div className="flex flex-wrap flex-auto flex-row-l flex-column items-stretch flex-nowrap">
								{
									bans
									&&
									bans.data
									&&
									bans.data.map((d, i) => {
										return <p key={i}>{d.username}</p>;
									})
								}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
AdminBanPage.getInitialProps = async function ({store, query}) {
	const { authentication } = store.getState();
	var bans;
	await fetch(API_URL + '/admin/bans', {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		headers: {
			authorization: `${authentication.token}`
		}
	})
		.then(response => response.json())
		.then(r => {
			bans = r;
		});
	return {
		...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
		bans
	};
}
export default withAuth(AdminBanPage)