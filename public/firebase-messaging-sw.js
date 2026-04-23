importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCZTj7QKK07GlbxOcbRmllVR8ToG8RSms8",
  authDomain: "shinetech-88274.firebaseapp.com",
  projectId: "shinetech-88274",
  storageBucket: "shinetech-88274.appspot.com",
  messagingSenderId: "358070557084",
  appId: "1:358070557084:web:3bc107cc9a9dda0cf3d059"
});

const messaging = firebase.messaging();

// 배경에서 메시지를 받았을 때 처리
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] 배경 메시지 수신:', payload);
  // 시스템이 자동으로 알림을 띄우므로 여기서는 로그만 확인합니다.
});
