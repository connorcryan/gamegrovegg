import { ref, onValue, push, update, remove } from 'firebase/database';
import { db } from '../../firebase-config';
import { useState, useEffect } from "react";
import { StyleSheet, TextInput, View, Text, Button, SafeAreaView } from "react-native";
import { Colors } from "../../constants/styles";

function TextPostForm() {
    const [posts, setPosts] = useState();
    const [presentPostTitle, setPresentPostTitle] = useState();
    const [presentPostText, setPresentPostText] = useState();

    useEffect(() => {
      return onValue(ref(db, '/posts'), querySnapShot => {
        let data = querySnapShot.val() || {};
        let postItems = {...data};
        setPosts(postItems);
      });
    }, []);

    /*const [title, setTitle] = useState();
    const [text, setText] = useState();*/

    function addNewPost() {
      push(ref(db, '/posts'), {
        title: presentPostTitle,
        text: presentPostText,
      });
      setPresentPostTitle("");
      setPresentPostText("");
    }
  
    function removePost() {
      remove(ref(db, '/posts'));
    }

    return (
      <SafeAreaView>
        <Text>Create you post!</Text>
        <TextInput
          placeholder="Post Title"
          value={presentPostTitle}
          style={styles.input}
          keyboardType="default"
          onChangeText={(text) => {setPresentPostTitle(text)}}
          onSubmitEditing={addNewPost}
        />
        <TextInput
          placeholder="Post content..."
          value={presentPostText}
          style={styles.input}
          keyboardType="default"
          onChangeText={(text) => {setPresentPostText(text)}}
          onSubmitEditing={addNewPost}
        />

        <View>
          <View>
            <Button 
              title="Create Post"
              onPress={addNewPost}
              color={'blue'}
              disabled={presentPostTitle == ''}
            />
          </View>
          <View>
            <Button 
              title="Remove Post"
              onPress={removePost}
              color={'red'}
              style={{marginTop: 20}}
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