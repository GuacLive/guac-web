import firebase from 'firebase/app';
import 'firebase/messaging';
import log from './log';
import {callApi} from '../services/api';

export const initializeFirebase = (callback) => {
	if (!firebase.apps || !firebase.apps.length){
		firebase.initializeApp({
			apiKey: "AIzaSyD3-rCPel0soeKLL5699DY3_5nQRIq5L4Y",
			authDomain: "guac-197816.firebaseapp.com",
			databaseURL: "https://guac-197816.firebaseio.com",
			projectId: "guac-197816",
			storageBucket: "guac-197816.appspot.com",
			messagingSenderId: "910957898129",
			appId: "1:910957898129:web:a63ea17f08eb6a65"
		});
	}
	if(navigator.serviceWorker){
		return navigator.serviceWorker
		.register(`/service-worker.js?${__NEXT_DATA__.buildId}`)
		.then((registration) => {
			console.log('registration', registration);
			firebase.messaging().useServiceWorker(registration);
		})
		.then(typeof callback === 'function' ? callback : () => {})
		.catch(console.error);
	}
};

const sendTokenToServer = (fcmToken, jwtToken) => {
	log('info', 'Firebase', 'FCM Token', fcmToken);
	if(fcmToken){
		callApi('/fcm', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			accessToken: jwtToken,
			body: JSON.stringify({
				fcmToken,
				deviceType: 'web'
			})
		})
		.then(response => response.json())
		.then((json) => {
			if(json.statusCode == 200){
				log('info', 'Firebase', 'FCM Token registered on server');
			}else{
				if(json.statusMessage === 'FCM token already exists'){
					log('info', 'Firebase', 'FCM token already exists, setting it in localStorage.');
					return localStorage.setItem('fcmToken', fcmToken);
				}
				log('info', 'Firebase', 'Error registering FCM token', json.statusMessage);
			}
		})
		.catch(error => {
			log('error', 'Firebase', 'Error registering FCM token', error);
		});
	}
};

export const initializePush = async(jwtToken) => {
	const messaging = firebase.messaging();
	console.log('whoopwhoop', messaging);
	if(typeof Notification === 'undefined') return;
	Notification
		.requestPermission()
		.then(() => {
			log('success', 'Firebase', 'Notifications are permitted');
		})
		.catch(error => {
			if(error.code === 'messaging/permission-blocked'){
				log('info', 'Firebase', 'Notifications are blocked');
			}else{
				log('error', 'Firebase', 'Error', error);
			}
		});
		try{
			const fcmToken = await messaging.getToken();
			if(
				typeof localStorage !== 'undefined'
				&& localStorage.getItem
				&& localStorage.getItem('fcmToken')
				&& localStorage.getItem('fcmToken') === fcmToken
			){
				log('success', 'Firebase', 'Token already sent to server, no need to resend');
				return;
			}
			localStorage.setItem('fcmToken', fcmToken);
			sendTokenToServer(fcmToken, jwtToken);
		}catch(e){}
}
