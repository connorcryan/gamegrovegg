import { ref, onValue, push, update, remove } from 'firebase/database';
import { db } from '../../firebase-config';
import { useState, useEffect } from "react";
import { StyleSheet, TextInput, View, Text, Button, SafeAreaView } from "react-native";
import { Colors } from "../../constants/styles";

function TextPostForm() {
    const [posts, setPosts] = useState();
    const [presentPost, setPresentPost] = useState();

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
        done: false,
        title: presentPost,
      });
      setPresentPost("");
    }
  
    function removePost() {
      remove(ref(db, '/posts'));
    }

    return (
      <SafeAreaView>
        <Text>Create you post!</Text>
        <TextInput
          placeholder="Post Title"
          value={presentPost}
          style={styles.input}
          keyboardType="default"
          onChangeText={(text) => {setPresentPost(text)}}
          onSubmitEditing={addNewPost}
        />

        <View>
          <View>
            <Button 
              title="Create Post"
              onPress={addNewPost}
              color={'blue'}
              disabled={presentPost == ''}
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