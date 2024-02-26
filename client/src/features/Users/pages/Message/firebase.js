import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA9bxBt6ZfBwUqs4Lc8KfyhxyeMs21aI8o',
  authDomain: 'doctor-message-bd0eb.firebaseapp.com',
  projectId: 'doctor-message-bd0eb',
  storageBucket: 'doctor-message-bd0eb.appspot.com',
  messagingSenderId: '1074129357727',
  appId: '1:1074129357727:web:1337171b6493c1ffc70baa',
  measurementId: 'G-MM8YTBM5LY'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage();
export const db = getFirestore();
export const auth = getAuth();
