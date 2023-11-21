import { db } from '../../firebase-config';
import { ref, push, remove, set } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useState, useContext } from "react";
import { AuthContext } from '../store/auth-context';
import { StyleSheet, TextInput, View, Text, SafeAreaView, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { Colors } from "../../constants/styles";
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import Button from '../ui/Button';

function VideoPostForm({onClose}) {
  
  const [presentPostTitle, setPresentPostTitle] = useState("");
  const [presentPostText, setPresentPostText] = useState("");
  const [presentPostParty, setPresentPostParty] = useState("");
  const [presentPostVideo, setPresentPostVideo] = useState(null);

  const authCtx = useContext(AuthContext);

  const handleAddNewPost = () => {
    if (
      presentPostTitle.trim() !== "" &&
      presentPostText.trim() !== "" &&
      presentPostParty.trim() !== "" &&
      presentPostVideo
    ) {
      // All fields are not empty, proceed with adding the post
      addNewPost({
        title: presentPostTitle,
        text: presentPostText,
        party: presentPostParty,
        video: presentPostVideo
      });
      // Close the modal
      onClose();
    } else {
      Alert.alert("Please ensure all inputs are not empty");
      console.log("THIS IS NOT WOKRING");
    }
  };

  async function addNewPost(postData) {
    const userData = authCtx.userData;

  if (userData && userData.username) {
    // Include the username in the post data
    postData.username = userData.username;

    console.log("addNewPost function is called");
    const newPostRef = push(ref(db, "posts")); // Create a reference to the new post
    const videoFileName = `post_${Date.now()}.mp4`;

    //upload the video to firebase storage
    const storage = getStorage();
    const videoRef = storageRef(storage, videoFileName);

    try {
      const response = await fetch(presentPostVideo);
      console.log("Video fetched");
      const blob = await response.blob();
      console.log("Blob created");

      const uploadTask = uploadBytes(videoRef, blob, {
        contentType: "video/mp4",
      });

      // Use the `then` method to handle the completion of the upload task
      uploadTask.then(async (snapshot) => {
        const videoUrl = await getDownloadURL(snapshot.ref);

        set(newPostRef, {
          // Update the new post's data
          title: presentPostTitle,
          text: presentPostText,
          party: presentPostParty,
          video: videoUrl,
          username: userData.username,
          timestamp: { ".sv": "timestamp" },
        });

        setPresentPostTitle("");
        setPresentPostText("");
        setPresentPostParty("");
        setPresentPostVideo(null);

        onClose();
      });
    } catch (error) {
      console.error("Error uploading video", error);
      console.log("Error occurred in addNewPost function");
    }
  } else {
    console.warn("User data is not available or does not contain a username.");
  }
  }

  const handleVideoPicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if(permissionResult.granted === false) {
        console.log('Permission to access the media library is required');
        return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    }
    );

    if (!result.canceled) {
        if (result.assets && result.assets.length > 0) {
            const selectedAsset = result.assets[0];
            setPresentPostVideo(selectedAsset.uri);
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
            placeholder="Text content..."
            value={presentPostText}
            style={[styles.inputText, styles.text]}
            keyboardType="default"
            multiline={true}
            onChangeText={(text) => {
              setPresentPostText(text);
            }}
          />
          {presentPostVideo ? (
            <Video
              source={{ uri: presentPostVideo }} // Make sure presentPostVideo is a valid video URI
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="cover"
              shouldPlay={true}
              isLooping={false}
              style={styles.selectedVideo}
            />
          ) : null}
          <Button title="Select Video" onPress={handleVideoPicker} />
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

export default VideoPostForm;

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
      //minHeight: 200,
      width: "90%",
      marginTop: 15,
      //color: "#000",
  },
    button: {
      borderRadius: 12,
      padding: 5,
      marginTop: 10,
      marginBottom: 30,
    },
    selectedVideo: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
        marginVertical: 10,
      },
});