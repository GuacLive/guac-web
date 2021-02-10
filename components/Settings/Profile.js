import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLingui} from '@lingui/react';
import {Trans, t} from '@lingui/macro';
import * as actions from 'actions';

import Modal from 'react-modal';
import PhotoDropzone from 'components/PhotoDropzone';
import PhotoCropper from 'components/PhotoCropper';

import Image from 'components/Image';

const API_URL = process.env.API_URL;
function ProfileComponent(props) {
	const {i18n} = useLingui();
	const dispatch = useDispatch();
	const auth = useSelector(state => state.authentication);
	const color = useRef();
	const password = useRef();

	const [files, setFiles] = useState([]);
	const [image, setImage] = useState(null);
	const [imageType, setImageType] = useState(null);

	const [modalIsOpen, setModalIsOpen] = useState(false);

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

	function openModal(){
		setModalIsOpen(true);
	}
    
	function closeModal(){
		setModalIsOpen(false);
	}

	function updateAvatar(){
		const formData = new FormData();
		formData.append('uri', image);
		fetch(API_URL + '/avatar', {
			headers: {
				Authorization: `Bearer ${auth.user.token}`,
			},
			method: 'POST',
			body: formData
		})
		.then(response => response.json())
		.then(r => {
			console.log('updateAvatar result', r);
			closeModal();
		})
		.catch(error => console.error(error));
	}

	useEffect(() => {
		console.log('test');
		console.log('files', files);
		if(files.length !== 0){
			setImageType(files[0].type || 'image/png');
			openModal();
		}
		return () => {
			files.forEach(file => URL.revokeObjectURL(file.preview));
		};
	}, [files])

	return (
		<>
			{auth.error &&
				<div className="red"><Trans>Error</Trans>: {auth.error.message}</div>
			}
			<form className="measure" onSubmit={handleSubmit}>
				<div className="justify-center items-start flex-shrink-0 flex flex-column pv2">
					<h3 className="f3 tracked mt0 mb3">Upload Avatar</h3>
					<div className="flex flex-row">
						<div className="relative v-mid w3 h3">
							<Image
								src={auth.user.avatar || '//api.guac.live/avatars/unknown.png'}
								alt={auth.user.name}
								shape="squircle"
								fit="cover"
								className={`ba b--transparent v-mid`}
							/>
						</div>
						<PhotoDropzone setFiles={setFiles} />
					</div>
					<div className="flex-row">
						<span className="dib f7 b"><Trans>Must be JPEG, GIF or PNG, and cannot exceed 10MB.</Trans></span>
					</div>
					<Modal
						isOpen={modalIsOpen}
						onRequestClose={closeModal}
						contentLabel={i18n._(t`Update avatar`)}
						style={{
							overlay: {
								backgroundColor: 'rgba(0, 0, 0, 0.5)',
								zIndex: '9999'
							},
							content: {
								top: '50%',
								left: '50%',
								right: 'auto',
								bottom: 'auto',
								marginRight: '-50%',
								transform: 'translate(-50%, -50%)',
								background: 'var(--modal-background)',
								borderColor: 'transparent',
								borderRadius: '4px'
							}
						}}
					>
						<h3 className="f3 tracked mt0 mb3">Upload Avatar</h3>
						{files.length > 0 && (
							<PhotoCropper
								imageType={imageType}
								setImage={setImage}
								imagePreview={files[0].preview}
							/>
						)}
						<button className="link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--dark-gray bg-dark-green guac-btn" onClick={updateAvatar}>
							<span className="white">
								<Trans>Save</Trans>
							</span>
						</button>
					</Modal>
				</div>
				<div className="primary"><span className="b"><Trans>E-mail</Trans></span>: {auth.user.email || 'None'}</div>
				<label htmlFor="color" className="b"><Trans>Color</Trans>:</label>
				<input name="color" type="color" disabled={auth.user.patreon ? false : true} className="input-reset bg-white br2" ref={color} placeholder={i18n._(t`Color`)} defaultValue={auth.user.color ? `#${auth.user.color}` : null} />
				<div className="primary f7"><Trans>Want to customize your color? <a target="_blank" href="https://www.patreon.com/join/guaclive" className="primary b"><Trans>Join our Patreon!</Trans></a></Trans></div>
				<label htmlFor="password" className="b"><Trans>New password:</Trans></label>
				<input name="password" type="password" className="input-reset bn pa3 w-100 bg-white br2" ref={password} placeholder={i18n._(t`Password`)} />
				<input type="submit" value={i18n._(t`Edit user`)} className="link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--green bg-green ml1" />
			</form>
		</>
	);
}
export default ProfileComponent;