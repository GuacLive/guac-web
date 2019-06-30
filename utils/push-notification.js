import firebase from 'firebase/app';
import 'firebase/messaging';
import log from './log';
import {callApi} from '../services/api';

export const initializeFirebase = (callback) => {
	firebase.initializeApp({
		messagingSenderId: '910957898129'
	});
	if(navigator.serviceWorker){
		return navigator.serviceWorker
		.register('/firebase-messaging-sw.js')
		.then((registration) => {
			firebase.messaging().useServiceWorker(registration);
		})
		.then(typeof callback === 'function' ? callback : () => {});
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
				log('info', 'Firebase', 'Error registering FCM token');
			}
		})
		.catch(error => {
			log('error', 'Firebase', 'Error registering FCM token', error);
		});
	}
};

export const initializePush = (jwtToken) => {
	const messaging = firebase.messaging();
	console.log('whoopwhoop', messaging);
	messaging
		.requestPermission()
		.then(() => {
			log('success', 'Firebase', 'Notifications are permitted');
			return messaging.getToken();
		})
		.then(fcmToken => {
			// Token already exists
			if(
				typeof localStorage !== 'undefined'
				&& localStorage.getItem
				&& localStorage.getItem('fcmToken')
			){
				log('success', 'Firebase', 'Token already sent to server, no need to resend');
				return;
			}
			localStorage.setItem('fcmToken', fcmToken);
			sendTokenToServer(fcmToken, jwtToken);
		})
		.catch(error => {
			if(error.code === 'messaging/permission-blocked'){
				log('info', 'Firebase', 'Notifications are blocked');
			}else{
				log('error', 'Firebase', 'Error', error);
			}
		});
		messaging.onTokenRefresh(() => {
			let fcmToken = messaging.getToken();
			localStorage.setItem('fcmToken', fcmToken);
			sendTokenToServer(fcmToken, jwtToken);
		});
}
