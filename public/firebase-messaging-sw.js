importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyA_I5eJvU9FwRbbAuuL9nQOnbPfCTEj2Bc",
  authDomain: "notificationweb-b7d04.firebaseapp.com",
  projectId: "notificationweb-b7d04",
  storageBucket: "notificationweb-b7d04.appspot.com",
  messagingSenderId: "679753326272",
  appId: "1:679753326272:web:8de5157d2945f74a7f5725",
  measurementId: "G-P57QEV8BZZ"
};

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});