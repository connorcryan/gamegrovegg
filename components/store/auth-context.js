import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

//create a context for Authcontext that has default values
export const AuthContext = createContext({
    token: '',
    isAuthenticated: false,
    userData: null,
    authenticate: () => {},
    logout: () => {},
});

function AuthContextProvider({children}) {
    //states for auth token and user data 
    const [authToken, setAuthToken] = useState();
    const [userData, setUserData] = useState(null);
    //useeffect hook
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
    //function to update token and userdata states
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
    //when logout clears the token and useData states
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
    //provide context valu to children
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContextProvider;