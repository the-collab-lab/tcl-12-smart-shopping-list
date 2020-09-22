// NOTE: import only the Firebase modules that you need in your app... except
// for the second line, which makes both the linter and react-firebase happy
import firebase from 'firebase/app';
import 'firebase/firestore';

// Initalize Firebase.
// These details will need to be replaced with the project specific env vars at the start of each new cohort.
var firebaseConfig = {
  apiKey: 'AIzaSyACLMTP9zJPwBvu-rpuUxfA3d7ucOViqAw',
  authDomain: 'tcl-12-smart-shopping-list.firebaseapp.com',
  databaseURL: 'https://tcl-12-smart-shopping-list.firebaseio.com',
  projectId: 'tcl-12-smart-shopping-list',
  storageBucket: 'tcl-12-smart-shopping-list.appspot.com',
  messagingSenderId: '269819553541',
  appId: '1:269819553541:web:7363151b8f528beeda396c',
};

let fb = firebase.initializeApp(firebaseConfig);

export { fb };
