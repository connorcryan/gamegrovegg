import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {

    apiKey: "AIzaSyDGxkft3tFTX-OtHdQoBEALytG3LOyBOx8",
    authDomain: "gamegrove.firebaseapp.com",
    databaseURL: "https://gamegrove-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "gamegrove",
    storageBucket: "gamegrove.appspot.com",
    messagingSenderId: "539184911817",
    appId: "1:539184911817:web:436908566d083fe9d00418",
    measurementId: "G-L2885MGSXQ"

  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  export { db };
  