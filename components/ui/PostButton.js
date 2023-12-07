import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, CreatPostStyles } from '../../constants/styles';

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
  buttonContainer: {
    ...CreatPostStyles.buttonContainer,
  },
  button: {
    ...CreatPostStyles.button,
  },
  pressed: {
    ...CreatPostStyles.buttonPressed,
  },
  buttonText: {
    ...CreatPostStyles.buttonText,
  },
});