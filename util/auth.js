import axios from 'axios';
import { getDatabase, ref, set } from '@firebase/database';

const API_KEY = 'AIzaSyDGxkft3tFTX-OtHdQoBEALytG3LOyBOx8';

async function authenticate(mode, email, password) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;

    try {
        const response = await axios.post(url, {
          email: email,
          password: password,
          returnSecureToken: true
        });
        
        const { idToken, localId } = response.data;
    
        return {token: idToken, uid: localId};

      } catch (error) {
        console.error('Authentication error:', error.message);
        console.error('Request payload:', error.config.data);
        console.error('Response:', error.response.data); 
        console.error('Status Code:', error.response.status);

        if (error.response.data.error.message === 'EMAIL_EXISTS') {
            throw new Error('Email already exists. Please login or use a different email.');
          }
          
        throw error;
      }
}

export async function createUser(username, email, password) {
   const authData = await authenticate('signUp', email, password);
   const { token, uid } = authData;
  
   const userData = { uid, username };
   await storeUserDataInDatabase( uid, userData);

   return { token, userData };
}

async function storeUserDataInDatabase(uid, userData) {
  const db = getDatabase();

  try {
      const userRef = ref(db, `users/${uid}`);
      
      // chec if userData is not undefined 
      if (userData && userData.username) {
          await set(userRef, {
              uid: uid,
              username: userData.username,
          });
          console.log("User data stored in the database!");
      } else {
          console.warn("userData is undefined, not storing in the database.");
      }
  } catch (error) {
      console.error("Error storing user data: ", error);
  }
}

export function login(email, password) {
    return authenticate('signInWithPassword', email, password);
}