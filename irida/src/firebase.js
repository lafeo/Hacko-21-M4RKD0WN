import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

var firebaseConfig = {
    apiKey: "AIzaSyDnFMvqkULMTKi83QrG_QyietKYoiah6sI",
    authDomain: "ek-database.firebaseapp.com",
    projectId: "ek-database",
    storageBucket: "ek-database.appspot.com",
    messagingSenderId: "503059163051",
    appId: "1:503059163051:web:2b85294379d4e4fadc94ee"
  };

export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();