import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '../../constants/styles';

function PostButton({ children, onPress }) {
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

export default PostButton;

const styles = StyleSheet.create({
  button: {
    width: 160,
    height: 150,
    borderRadius: 12,
    paddingVertical: 12,
    //paddingHorizontal: 12,
    marginHorizontal: 16,
    marginTop: 18,
    backgroundColor: Colors.primary100,
    elevation: 2,
    shadowColor: 'white',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: 'center',
    color: Colors.primary800,
    fontSize: 16,
    fontWeight: 'bold'
  },
});