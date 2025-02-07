import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; 

const firebaseConfig = {
  apiKey: "AIzaSyD57J8wLPaNQqltEFzYhSVBdyINueyJYTE",
  authDomain: "meelmasterauth.firebaseapp.com",
  projectId: "meelmasterauth",
  storageBucket: "meelmasterauth.appspot.com", 
  messagingSenderId: "850883916884",
  appId: "1:850883916884:web:5778e88d1e3b257891a9c1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 