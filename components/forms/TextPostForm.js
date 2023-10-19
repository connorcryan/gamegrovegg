import { db } from '../../firebase-config';
import { ref, onValue, push, remove } from 'firebase/database';
import { useState, useEffect } from "react";
import { StyleSheet, TextInput, View, Text, Button, SafeAreaView } from "react-native";
import { Colors } from "../../constants/styles";

function TextPostForm() {
  const [posts, setPosts] = useState({});
  const [presentPostTitle, setPresentPostTitle] = useState("");
  const [presentPostText, setPresentPostText] = useState("");

  // This is not needed, and it should be removed
  // const postKeys = Object.keys(posts);

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
    // This will remove the entire 'posts' node. If you want to remove a specific post, you need to pass the post's unique key.
    // Use: remove(ref(db, `posts/${postKey}`); where postKey is the key of the post you want to remove.
    remove(ref(db, 'posts'));
  }

  // This function is not needed, as you are updating posts directly in addNewPost

  return (
    <SafeAreaView>
      <View>
        {Object.keys(posts).length > 0 ? (
          Object.keys(posts).map((key) => (
            <View key={key}>
              <Text>{posts[key].title}</Text>
              <Text>{posts[key].text}</Text>
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
        flex: 1,
        backgroundColor: Colors.primary100,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 40,
        color: Colors.primary500,
        marginBottom: 20,
        fontWeight: "bold",
    },
    input: {
        backgroundColor: 'white',
        padding: 10,
        width: "80%",
        marginTop: 15,
        color: "#000",
    },
});