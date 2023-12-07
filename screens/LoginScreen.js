import { useContext, useState } from 'react';

import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { login } from '../util/auth';
import { Alert } from 'react-native';
import { AuthContext } from '../components/store/auth-context';

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function loginHandler({email, password}) {
    setIsAuthenticating(true);
    try {
      await login(authCtx, email, password);
      authCtx.authenticate(token);
    } catch (error) {
      console.error('Login error:', error);
      //Alert.alert('Authentication failed, please check your credentials!');
    } finally {
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message='Creating user...'/>
  }
  return <AuthContent isLogin onAuthenticate={loginHandler}/>;
}

export default LoginScreen;
