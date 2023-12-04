import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/styles';

function Button({ children, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 50,
    borderRadius: 6,
    marginTop: 15,
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.accent500,
    borderColor: Colors.primary400
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: 'center',
    alignItems: 'center',
    paddingTop:6,
    color: Colors.primary800,
    fontSize: 20,
    fontWeight: 'bold'
  },
});
