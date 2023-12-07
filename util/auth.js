import axios from 'axios';
import { getDatabase, ref, set, get } from '@firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        await AsyncStorage.setItem('token', idToken);
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

export async function login(authCtx, email, password) {
  try {
    const authData = await authenticate('signInWithPassword', email, password);
    const { token, uid } = authData;
    // log the received token
    console.log('Received Token:', token);
    const userData = await getUserDataFromDatabase(uid);
    // ensure that the token is stored
    authCtx.authenticate(token, userData);
    return { token, uid };
} catch (error) {
    // Handle login error
    throw error;
}
async function getUserDataFromDatabase(uid) {
  const db = getDatabase();
  const userRef = ref(db, `users/${uid}`);

  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      console.log('User Data from Database:', userData);
      return userData;
    } else {
      console.warn('User does not exist in the database.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data from the database:', error);
    throw error;
  }
}

}