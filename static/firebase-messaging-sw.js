importScripts('https://www.gstatic.com/firebasejs/7.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    apiKey: "AIzaSyAWpwVfaVmow4iNi25v0hI7n4Of8a71Qqo",
    authDomain: "guac-197816.firebaseapp.com",
    databaseURL: "https://guac-197816.firebaseio.com",
    projectId: "guac-197816",
    storageBucket: "guac-197816.appspot.com",
    messagingSenderId: "910957898129",
    appId: "1:910957898129:web:a63ea17f08eb6a65"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

const oldSelf = self;

let notificationPayload = null;

let notification;

self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting());
});

messaging.setBackgroundMessageHandler(payload => {
    notificationPayload = payload;

	// eslint-disable-next-line no-console
    console.log(
        '%c guac.live %c Firebase notification received',
        'background: #0FABE9; color: #e8e8e8; border-radius: 3px 0 0 3px;',
        'background: #105777; color: #e8e8e8; border-radius: 0 3px 3px 0;',
        payload
    );

    let title = payload.notification.title;
    let options = {
        body: payload.notification.body,
        icon: payload.data.icon,
        data: payload,
    };

    // Customize notification here
    notification = self.registration.showNotification(title, options);
    return notification;
});

self.addEventListener('notificationclick', function(event) {
    console.log(
        '%c guac.live %c Firebase notification clicked',
        'background: #0FABE9; color: #e8e8e8; border-radius: 3px 0 0 3px;',
        'background: #105777; color: #e8e8e8; border-radius: 0 3px 3px 0;',
        payload
    );

    event.waitUntil(
        clients.matchAll({
            type: 'window'
        })
        .then(function(clientList) {
            for(var i = 0; i < clientList.length; i++){
                var client = clientList[i];
                if(client.url == '/' && 'focus' in client)
                    return client.focus();
            }
            if(clients.openWindow){
                return clients.openWindow(`https://guac.live/c/${notificationPayload.data.username}`);
            }
        })
    );
});