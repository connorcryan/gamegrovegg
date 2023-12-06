import AsyncStorage from "@react-native-async-storage/async-storage";

import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({
    token: '',
    isAuthenticated: false,
    userData: null,
    authenticate: () => {},
    logout: () => {},
});

function AuthContextProvider({children}) {
    const [authToken, setAuthToken] = useState();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        //retrieve token from AsyncStorage
        AsyncStorage.getItem('token')
          .then((token) => {
            //set empty string if token is null
            setAuthToken(token || ''); 
          })
          .catch((error) => {
            console.error('Error retrieving token from AsyncStorage:', error);
          });
    
        //retrieve userData from AsyncStorage
        AsyncStorage.getItem('userData')
          .then((userDataString) => {
            const parsedUserData = JSON.parse(userDataString);
             //set null if userData is null
            setUserData(parsedUserData || null);
          })
          .catch((error) => {
            console.error('Error retrieving userData from AsyncStorage:', error);
          });
      }, []); 

    function authenticate(token, userData) {
      console.log("Received token for AsyncStorage:", token);
      console.log("Received userData for AsyncStorage:", userData);

      setAuthToken(token);

      if (userData && userData.username) {
        setUserData(userData);
        AsyncStorage.setItem("userData", JSON.stringify(userData));
        console.log("Authenticated with userData:", userData);
      } else {
        console.warn(
          "userData is undefined or does not contain a username, not storing in AsyncStorage."
        );
      }

      AsyncStorage.setItem("token", token);
    }

    function logout() {
      setAuthToken("");
      setUserData(null);
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("userData");
    }
    
    const value = {
        token: authToken,
        isAuthenticated: !!authToken,
        userData: userData,
        authenticate: authenticate,
        logout: logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContextProvider;