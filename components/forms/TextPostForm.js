import { db } from '../../firebase-config';
import { ref, push, remove, set } from 'firebase/database';
import { useState } from "react";
import { StyleSheet, TextInput, View, Text, Button, SafeAreaView } from "react-native";
import { Colors } from "../../constants/styles";

function TextPostForm() {
  
  const [presentPostTitle, setPresentPostTitle] = useState("");
  const [presentPostText, setPresentPostText] = useState("");

  function addNewPost() {
    const newPostRef = push(ref(db, 'posts')); // Create a reference to the new post
    set(newPostRef, { // Update the new post's data
      title: presentPostTitle,
      text: presentPostText,
    });
    setPresentPostTitle("");
    setPresentPostText("");
  }

  function removePost() {
    // This is a remove function to be implemented later 
    remove(ref(db, `posts/${postKey}`));
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create your post!</Text>
      <TextInput
        placeholder="Post Title"
        value={presentPostTitle}
        style={[styles.input, styles.text]}
        keyboardType="default"
        multiline={true}
        onChangeText={(text) => {
          setPresentPostTitle(text);
        }}
      />
      <TextInput
        placeholder="Post content..."
        value={presentPostText}
        style={styles.input}
        keyboardType="default"
        multiline={true}
        onChangeText={(text) => {
          setPresentPostText(text);
        }}
      />
      <View>
        <View>
          <Button
            title="Create Post"
            onPress={addNewPost}
            color={'blue'}
            disabled={presentPostTitle === ''}
          />
        </View>
        <View>
          <Button
            title="Remove Post"
            onPress={removePost}
            color={'red'}
            style={{ marginTop: 20 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default TextPostForm;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center', 
      marginHorizontal: 10,
      backgroundColor: Colors.accent600,
      borderRadius: 12,
      elevation: 2,
      shadowColor: 'white',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    title: {
      alignItems: 'center',
      fontSize: 24,
      fontWeight: 'bold',
      paddingHorizontal: 10,
      paddingTop: 10,
      paddingBottom: 5,
      color: Colors.primary700,
    },
    text: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingTop: 5,
      paddingBottom: 10,
      maxWidth: 400,
      maxHeight: 100,
      color: Colors.primary800,
  },
    input: {
        backgroundColor: Colors.accent400,
        flexWrap: 'wrap',
        padding: 10,
        borderRadius: 12,
        width: "80%",
        marginTop: 15,
        color: "#000",
    },
});