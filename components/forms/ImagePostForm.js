import { db } from '../../firebase-config';
import { ref, push, remove, set } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useState } from "react";
import { StyleSheet, TextInput, View, Text, SafeAreaView, TouchableWithoutFeedback, Keyboard, Alert, Image } from "react-native";
import { Colors } from "../../constants/styles";
import * as ImagePicker from 'expo-image-picker';
import Button from '../ui/Button';

function ImagePostForm({onClose}) {
  
  const [presentPostTitle, setPresentPostTitle] = useState("");
  const [presentPostParty, setPresentPostParty] = useState("");
  const [presentPostImage, setPresentPostImage] = useState("");
  const [presentPostText, setPresentPostText] = useState("");

  const handleAddNewPost = () => {
    if (presentPostTitle.trim() !== '' && presentPostText.trim() !== '' && presentPostParty.trim() !== '' && presentPostImage.trim() !== '') {
      // All fields are not empty, proceed with adding the post
      addNewPost({ title: presentPostTitle, text: presentPostText, party: presentPostParty, image: presentPostImage });
      // Close the modal
      onClose();
    } else {
      Alert.alert('Please ensure all inputs are not empty');
      console.log('THIS IS NOT WOKRING');
    }
  };

  async function addNewPost() {
    const newPostRef = push(ref(db, 'posts')); // Create a reference to the new post
    const imageFileName = `post_${Date.now()}.jpg`; //unique file name for the image 

    //upload the image to firebase storage
    const storage = getStorage();
    const imageRef = storageRef(storage, imageFileName);

    //upload the image file
    try{

        const response = await fetch(presentPostImage);
        const blob = await response.blob();

        await uploadBytes(imageRef, blob);
        const imageUrl = await getDownloadURL(imageRef);

        set(newPostRef, { // Update the new post's data
            title: presentPostTitle,
            text: presentPostText,
            party: presentPostParty,
            image: imageUrl,
            timestamp: { '.sv': 'timestamp'}
          });

        setPresentPostTitle("");
        setPresentPostText("");
        setPresentPostParty("");
        setPresentPostImage("");

        onClose();
    } catch (error) {
        console.error('Error uploading image', error);
    }
  }

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if(permissionResult.granted === false) {
        console.log('Permission to access the media library is required');
        return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
        if (result.assets && result.assets.length > 0) {
            const selectedAsset = result.assets[0];
            setPresentPostImage(selectedAsset.uri);
            //console.log("Selected Image URI: ", selectedAsset.uri);
        }
    }
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
            placeholder="Party"
            value={presentPostParty}
            style={[styles.inputTitle, styles.text]}
            keyboardType="default"
            multiline={true}
            onChangeText={(text) => {
              setPresentPostParty(text);
            }}
          />
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
          {presentPostImage ? (
            <Image source={{ uri: presentPostImage }} style={styles.selectedImage}/>
          ) : null}
          <Button title="Select Image" onPress={handleImagePicker} />         
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

export default ImagePostForm;

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
      minHeight: 50,
      width: "90%",
      marginTop: 15,
      //color: "#000",
  },
  selectedImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginVertical: 10,
  },
    button: {
      borderRadius: 12,
      padding: 5,
      marginTop: 10,
      marginBottom: 30,
    }
});