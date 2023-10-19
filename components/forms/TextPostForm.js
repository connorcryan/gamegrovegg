import { db } from '../../firebase-config';
import { ref, onValue, push, remove } from 'firebase/database';
import { useState, useEffect } from "react";
import { StyleSheet, TextInput, View, Text, Button, SafeAreaView } from "react-native";
import { Colors } from "../../constants/styles";

function TextPostForm() {
  const [posts, setPosts] = useState({});
  const [presentPostTitle, setPresentPostTitle] = useState("");
  const [presentPostText, setPresentPostText] = useState("");

  useEffect(() => {
    const unsubscribe = onValue(ref(db, 'posts'), (querySnapShot) => {
      if (querySnapShot.exists()) {
        let data = querySnapShot.val() || {};
        setPosts(data);
      } else {
        console.log('⛔️ Object is falsy');
      }
    });

    return () => {
      // Cleanup the listener when the component unmounts
      unsubscribe();
    };
  }, []);

  function addNewPost() {
    const newPostRef = push(ref(db, 'posts')); // Create a reference to the new post
    update(newPostRef, { // Update the new post's data
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
    <SafeAreaView>
      <View style={styles.container}>
        {Object.keys(posts).length > 0 ? (
          Object.keys(posts).map((key) => (
            <View key={key}>
              <Text style={styles.title}>{posts[key].title}</Text>
              <Text style={styles.text}>{posts[key].text}</Text>
            </View>
          ))
        ) : (
          <Text>No posts created...</Text>
        )}
      </View>
      <Text>Create your post!</Text>
      <TextInput
        placeholder="Post Title"
        value={presentPostTitle}
        style={styles.input}
        keyboardType="default"
        onChangeText={(text) => {
          setPresentPostTitle(text);
        }}
      />
      <TextInput
        placeholder="Post content..."
        value={presentPostText}
        style={styles.input}
        keyboardType="default"
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
      width: '100%',
      borderRadius: 12,
      backgroundColor: Colors.primary50,
      elevation: 2,
      shadowColor: 'white',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    title: {
      fontSize: 20,
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
      color: Colors.primary800,
  },
    input: {
        backgroundColor: 'white',
        padding: 10,
        width: "80%",
        marginTop: 15,
        color: "#000",
    },
});