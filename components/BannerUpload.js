import React, {useEffect, useState} from 'react';

import Modal from 'react-modal';
import {Trans, t} from '@lingui/macro';

import { useDispatch, useSelector } from 'react-redux';

import * as actions from 'actions/';
import PhotoDropzone from 'components/PhotoDropzone';

import Image from 'components/Image';

const API_URL = process.env.API_URL;
export default function BannerUpload(props){
    const dispatch = useDispatch();
	const [files, setFiles] = useState([]);
	const [image, setImage] = useState(null);
	const [imageType, setImageType] = useState(null);

    const [currentBanner, setCurrentBanner] = useState('//cdn.guac.live/offline-banners/offline-banner.png');

	const [modalIsOpen, setModalIsOpen] = useState(false);

    const streaming = useSelector(state => state.streaming);

	useEffect(() => {
		dispatch(actions.fetchStreaming(props.user.token));
	}, []);
	
	useEffect(() => {
        setCurrentBanner(props.streaming.banner);
    }, [streaming]);

	function openModal(){
		setModalIsOpen(true);
	}
    
	function closeModal(){
		setModalIsOpen(false);
	}

	function updateBanner(){
		const formData = new FormData();
		formData.append('uri', image);
		fetch(API_URL + '/channel/banner', {
			headers: {
				Authorization: `Bearer ${props.user.token}`,
			},
			method: 'POST',
			body: formData
		})
		.then(response => response.json())
		.then(r => {
			console.log('updateBanner result', r);
            if(r.banner) setCurrentBanner(r.banner);
			closeModal();
		})
		.catch(error => console.error(error));
	}

	useEffect(() => {
		if(files.length !== 0){
            setImage(files[0]);
			setImageType(files[0].type || 'image/png');
			openModal();
		}
		return () => {
			files.forEach(file => URL.revokeObjectURL(file.preview));
		};
	}, [files]);

    return (
        <div className="justify-center items-start flex-shrink-0 flex flex-column pv2">
            <h3 className="f3 tracked mt0 mb3"><Trans>Upload Profile Banner</Trans></h3>
            <div className="flex flex-row">
                <div className="relative v-mid">
                    <Image
                        src={currentBanner}
                        alt={i18n._(t`Profile Banner for ${props.user.name}`)}
                        fit="cover"
                        width={220}
                        height={124}
                        className={`ba b--transparent br2 v-mid`}
                    />
                </div>
            </div>
            <div className="flex-row">
                <PhotoDropzone setFiles={setFiles} />
                <ul className="flex flex-column content-center f7 b">
                    <li><Trans>Must be JPEG, GIF or PNG</Trans></li>
                    <li><Trans>Up to 2MB</Trans></li>
                    <li><Trans>1920 x 1080 is preferred</Trans></li>
                </ul>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel={i18n._(t`Upload Profile Banner`)}
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
                <h3 className="f3 tracked mt0 mb3 primary"><Trans>Upload Profile Banner</Trans></h3>
                <button className="link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--dark-gray bg-dark-green guac-btn" onClick={updateBanner}>
                    <span className="white">
                        <Trans>Save</Trans>
                    </span>
                </button>
            </Modal>
        </div>
    )
}