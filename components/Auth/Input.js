import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../../constants/styles';

function Input({label, keyboardType, secure, onUpdateValue, value, isInvalid}) {
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, isInvalid && styles.labelInvalid]}>
        {label}
      </Text>
      <TextInput
        style={[styles.input, isInvalid && styles.inputInvalid]}
        keyboardType={keyboardType}
        secureTextEntry={secure}
        onChangeText={onUpdateValue}
        value={value}
      />
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  inputContainer: {

  },
  label: {
    color: Colors.primary800,
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 15,
  },
  labelInvalid: {
    color: Colors.error500,
  },
  input: {
    backgroundColor: Colors.primary400,
    padding: 15,
    borderWidth: 3,
    borderRadius: 12,
    borderColor: Colors.accent500,
    //width: "90%",
    marginTop: 5,
    color: Colors.primary800,
  },
  inputInvalid: {
    backgroundColor: Colors.error50,
  },
});
