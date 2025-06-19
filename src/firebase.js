import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyC4yATgsxqJoJUQ6DUTV6-sgThxHMnUjbk",
  authDomain: "entend-me.firebaseapp.com",
  projectId: "entend-me",
  storageBucket: "entend-me.firebasestorage.app",
  messagingSenderId: "61100224720",
  appId: "1:61100224720:web:edda31da37196e779feed5",
  measurementId: "G-45N920VW5Y"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
