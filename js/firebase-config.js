// ============================================================
// SETUP: Fill in your Firebase project details below
// Get these from: Firebase Console → Project Settings → Your Apps
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyCcU_6u-zNERCr5PTkau8O1TeoJcZNdo0E",
  authDomain: "tuition-scheduler-672d3.firebaseapp.com",
  projectId: "tuition-scheduler-672d3",
  storageBucket: "tuition-scheduler-672d3.appspot.com",
  messagingSenderId: "190294013358",
  appId: "1:190294013358:web:1c962d251c8bf3a82d843f"
};

// Your email address — this account gets Teacher role when registered
const TEACHER_EMAIL = "devinedward080118@gmail.com"; // e.g. "you@gmail.com"

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db      = firebase.firestore();
const auth    = firebase.auth();
const storage = firebase.storage();
