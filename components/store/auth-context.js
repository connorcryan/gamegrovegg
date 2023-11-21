import AsyncStorage from "@react-native-async-storage/async-storage";

import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({
    token: '',
    isAuthenticated: false,
    authenticate: () => {},
    logout: () => {},
});

function AuthContextProvider({children}) {
    const [authToken, setAuthToken] = useState();
    const [userData, setUserData] = useState(null);

    function authenticate(token, userData) {
        console.log("Received token for AsyncStorage:", token);
        console.log("Received userData for AsyncStorage:", userData);
        
        setAuthToken(token);
        if (token) {
            AsyncStorage.setItem("token", token);
          } else {
            console.warn("Token is undefined, not storing in AsyncStorage.");
          }
        
          // Check if userData is not undefined and has a username before storing
          if (userData && userData.username) {
            setUserData(userData);
            AsyncStorage.setItem("userData", JSON.stringify(userData));
            console.log("Authenticated with userData:", userData);
          } else {
            console.warn("userData is undefined or does not contain a username, not storing in AsyncStorage.");
          }
    }

    function logout() {
        setAuthToken(null);
        AsyncStorage.removeItem('token');
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