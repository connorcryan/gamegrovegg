import { useState } from "react";
import { StyleSheet, TextInput, View, Text, Button, SafeAreaView } from "react-native";
import { Colors } from "../../constants/styles";

function TextPostForm() {
    const [title, setTitle] = useState();
    const [text, setText] = useState();

    return (
      <SafeAreaView>
        <Text>Create you post!</Text>
        <TextInput
          placeholder="Post Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
          keyboardType="default"
          style={styles.input}
        />
        <TextInput
          placeholder="Post content..."
          value={text}
          onChangeText={(text) => setText(text)}
          keyboardType="default"
          style={styles.input}
          onSubmitEditing={() => alert("Your pos has been Submitted!")}
        />
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