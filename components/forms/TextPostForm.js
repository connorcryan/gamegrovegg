import { db } from '../../firebase-config';
import { ref, push, remove, set } from 'firebase/database';
import { useState } from "react";
import { StyleSheet, TextInput, View, Text, SafeAreaView, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { Colors } from "../../constants/styles";
import Button from '../ui/Button';

function TextPostForm({onClose}) {
  
  const [presentPostTitle, setPresentPostTitle] = useState("");
  const [presentPostText, setPresentPostText] = useState("");

  const handleAddNewPost = () => {
    if (presentPostTitle.trim() !== '' && presentPostText.trim() !== '') {
      // Both fields are not empty, proceed with adding the post
      addNewPost({ title: presentPostTitle, text: presentPostText });
      // Close the modal
      onClose();
    } else {
      Alert.alert('Please ensure both input are not empty');
      console.log('THIS IS NOT WOKRING');
    }
  };

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
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
        <Button onPress={onClose}></Button>
          <Text style={styles.title}>Create your post!</Text>
          <TextInput
            placeholder="Post Title"
            value={presentPostTitle}
            style={[styles.inputTitle, styles.text]}
            keyboardType="default"
            multiline={true}
            onChangeText={(text) => {
              setPresentPostTitle(text);
            }}
          />
          <TextInput
            placeholder="Post content..."
            value={presentPostText}
            style={[styles.inputText, styles.text]}
            keyboardType="default"
            multiline={true}
            onChangeText={(text) => {
              setPresentPostText(text);
            }}
          />
        </View>
      </TouchableWithoutFeedback>
      <View>
        <View>
        <Button onPress={handleAddNewPost}> Create Post </Button>
        </View>
        {/* <View style={styles.button}>
          <Button
            title="Remove Post"
            onPress={removePost}
            color={'red'}
            style={{ marginTop: 20 }}
          />
        </View> */}
      </View>
    </SafeAreaView>
  );
}

export default TextPostForm;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      maxHeight: "90%",
      //justifyContent: 'center',
      alignItems: 'center', 
      marginTop: 50,
      marginHorizontal: 10,
      backgroundColor: Colors.accent500,
      borderRadius: 12,
      // elevation: 2,
      // shadowColor: 'white',
      // shadowOffset: { width: 1, height: 1 },
      // shadowOpacity: 0.25,
      // shadowRadius: 4,
    },
    title: {
      //alignItems: 'center',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 40,
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
      minWidth: '80%',
      maxWidth: '80%',
      maxHeight: 100,
      color: Colors.primary800,
  },
    inputTitle: {
        backgroundColor: Colors.accent400,
        flexWrap: 'wrap',
        padding: 10,
        borderRadius: 12,
        width: "90%",
        marginTop: 15,
    },
    inputText: {
      backgroundColor: Colors.accent400,
      flexWrap: 'wrap',
      padding: 10,
      borderRadius: 12,
      minHeight: 200,
      width: "90%",
      marginTop: 15,
      //color: "#000",
  },
    button: {
      borderRadius: 12,
      padding: 5,
      marginTop: 10,
      marginBottom: 30,
    }
});