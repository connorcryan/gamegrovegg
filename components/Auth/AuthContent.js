import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import FlatButton from '../ui/FlatButton';
import AuthForm from './AuthForm';
import { Colors } from '../../constants/styles';

//component receives two props islogin and onauthenticate
function AuthContent({ isLogin, onAuthenticate }) {
  //usenavigation is a hook used to navigate between screens
  const navigation = useNavigation();
  //usestate hook used to manage the credantialisinvalid state 
  //which initally starts as false until input is received
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
  });
  //function that replaces the login and signup screen with one another
  //depending on what screen is currently active. This uses the navigation component
  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.replace('Signup');
    } else {
      navigation.replace('Login');
    }
  }
  //handles form submission an authentication, checks input and issues allerts
  //if inputs are invalid
  function submitHandler(credentials) {
    let { username, email, confirmEmail, password, confirmPassword } = credentials;

    username = username.trim();
    email = email.trim();
    password = password.trim();

    const usernameIsValid = username.length > 3;
    const emailIsValid = email.includes('@');
    const passwordIsValid = password.length > 6;
    const emailsAreEqual = email === confirmEmail;
    const passwordsAreEqual = password === confirmPassword;

    if (
      !usernameIsValid ||
      !emailIsValid ||
      !passwordIsValid ||
      (!isLogin && (!emailsAreEqual || !passwordsAreEqual))
    ) {
      Alert.alert('Invalid input', 'Please check your entered credentials.');
      setCredentialsInvalid({
        username: !usernameIsValid,
        email: !emailIsValid,
        confirmEmail: !emailIsValid || !emailsAreEqual,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
      });
      return;
    }
    onAuthenticate({ username, email, password });
  }

  return (
    <View style={styles.authContent}>
      <AuthForm
        isLogin={isLogin}
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />
      <View style={styles.buttons}>
        <FlatButton onPress={switchAuthModeHandler}>
          {isLogin ? 'Create a new user' : 'Log in instead'}
        </FlatButton>
      </View>
    </View>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  authContent: {
    //flex: 1,
    //marginTop: 64,
    marginHorizontal: 10,
    padding: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: Colors.primary200,
    backgroundColor: Colors.primary50,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  buttons: {
    marginTop: 8,
  },
});
