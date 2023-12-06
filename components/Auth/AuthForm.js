import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/styles';

import Button from '../ui/Button';
import Input from './Input';

//auth form takes three props
function AuthForm({ isLogin, onSubmit, credentialsInvalid }) {
  //useState hook to manage the states of the input fields starting as empty
  const [enteredUsername, setEnteredUsername] = useState('');
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredConfirmEmail, setEnteredConfirmEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');

  const {
    username: usernameIsInvalid,
    email: emailIsInvalid,
    confirmEmail: emailsDontMatch,
    password: passwordIsInvalid,
    confirmPassword: passwordsDontMatch,
  } = credentialsInvalid;

  //swtich statement to update the corresponding states with inputType
  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case 'username':
        setEnteredUsername(enteredValue);
        break;
      case 'email':
        setEnteredEmail(enteredValue);
        break;
      case 'confirmEmail':
        setEnteredConfirmEmail(enteredValue);
        break;
      case 'password':
        setEnteredPassword(enteredValue);
        break;
      case 'confirmPassword':
        setEnteredConfirmPassword(enteredValue);
        break;
    }
  }

  //call the onSubmit prop with the enetered values the updateInputHandler
  function submitHandler() {
    onSubmit({
      username: enteredUsername,
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword,
    });
  }

  //renders the necessary input component based on if it is Login screen
  //or sign up screen
  return (
    <View >
      <View >
      {!isLogin && (<Input
          label="Username"
          onUpdateValue={updateInputValueHandler.bind(this, 'username')}
          value={enteredUsername}
          keyboardType="email-address"
          isInvalid={usernameIsInvalid}
        />
        )}
        <Input
          label="Email Address"
          onUpdateValue={updateInputValueHandler.bind(this, 'email')}
          value={enteredEmail}
          keyboardType="email-address"
          isInvalid={emailIsInvalid}
        />
        {!isLogin && (
          <Input
            label="Confirm Email Address"
            onUpdateValue={updateInputValueHandler.bind(this, 'confirmEmail')}
            value={enteredConfirmEmail}
            keyboardType="email-address"
            isInvalid={emailsDontMatch}
          />
        )}
        <Input
          label="Password"
          onUpdateValue={updateInputValueHandler.bind(this, 'password')}
          secure
          value={enteredPassword}
          isInvalid={passwordIsInvalid}
        />
        {!isLogin && (
          <Input
            label="Confirm Password"
            onUpdateValue={updateInputValueHandler.bind(
              this,
              'confirmPassword'
            )}
            secure
            value={enteredConfirmPassword}
            isInvalid={passwordsDontMatch}
          />
        )}
        <View style={styles.buttons}>
          <Button onPress={submitHandler}>
            {isLogin ? 'Log In' : 'Sign Up'}
          </Button>
        </View>
      </View>
    </View>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  buttons: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  form: {
    flex: 1,
    backgroundColor: Colors.primary50,
  },
  inputText: {
    backgroundColor: Colors.primary800,
  },
  
});
