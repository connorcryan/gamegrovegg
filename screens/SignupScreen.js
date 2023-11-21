import { useContext, useState } from 'react';
import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { createUser } from '../util/auth';
import { Alert } from 'react-native';
import { AuthContext } from '../components/store/auth-context';

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function signupHandler({ username, email, password}) {
    setIsAuthenticating(true);
    try {
      const {token, userData } = await createUser( username, email, password);
      console.log("Received token:", token);
      console.log("Received userData:", userData);
      
      authCtx.authenticate(token, userData);
    } catch (error) {
      console.error('Error during signup:', error)
      Alert.alert('Authentication failed, could not create user.');
      setIsAuthenticating(false);
    } 
  }

  if (isAuthenticating) {
    return <LoadingOverlay message='Creating user...'/>
  }

  return <AuthContent onAuthenticate={signupHandler}/>;
}

export default SignupScreen;
