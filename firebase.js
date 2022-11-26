import {initializeApp} from 'firebase/app';
import {getDatabase} from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyAlS_XbiO8BqkpWkdHezOeau2kogTrm8So",
    authDomain: "soppa-7f7ae.firebaseapp.com",
    databaseURL: "https://soppa-7f7ae-default-rtdb.firebaseio.com",
    projectId: "soppa-7f7ae",
    storageBucket: "soppa-7f7ae.appspot.com",
    messagingSenderId: "79437693015",
    appId: "1:79437693015:web:23aa2c101a063f84b92312"
  };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;