import { db } from '../../firebase-config';
import { ref, push, set, get, query, orderByChild, equalTo } from 'firebase/database';
import { useState } from "react";
import { StyleSheet, TextInput, View, Text, SafeAreaView, TouchableWithoutFeedback, Keyboard, Alert, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Colors } from "../../constants/styles";
import Button from '../ui/Button';

function CreatePartyForm({ onClose }) {

  const [presentPartyTitle, setPresentPartyTitle] = useState("");
  const [presentPartyBio, setPresentPartyBio] = useState("");
  const [presentPartyImage, setPresentPartyImage] = useState("");

  const handleAddNewPost = async () => {
    if (presentPartyTitle.trim() !== '' && presentPartyBio.trim() !== '' && presentPartyImage.trim() !== '') {
      try {
        // Check if a party with the same title already exists
        const partyExists = await checkPartyExists(presentPartyTitle);
        if (!partyExists) {
          // If the party doesn't exist, proceed with adding the post
          addNewPost({ party: presentPartyTitle, partyBio: presentPartyBio, partyImage: presentPartyImage });
          // Close the modal
          onClose();
        } else {
          Alert.alert('Party already exists with the same title');
        }
      } catch (error) {
        console.error("Error while adding a new party:", error);
        Alert.alert('Error while adding a new party. Please try again later.');
      }
    } else {
      Alert.alert('Please ensure all inputs are not empty');
    }
  }

  async function checkPartyExists(partyTitle) {
    try {
        const partyRef = ref(db, 'parties');
        const partyQuery = query(partyRef, orderByChild('party'), equalTo(partyTitle));
        const snapshot = await get(partyQuery);
        return snapshot.exists();
      } catch (error) {
        console.error("Error while checking party existence:", error);
        throw error; // Rethrow the error to handle it in the caller function
      }
    }

    async function addNewPost(partyData) {
      try{
          const partyTitle =partyData.party;
          // Check if a party with the same title already exists
         const partyExists = await checkPartyExists(partyTitle);
         if (partyExists) {
        Alert.alert('Party already exists with the same title');
      return;
    } 

        const partyRef = ref(db, `parties/${partyTitle}`); // Create a reference to the new post

      if (partyData.partyImage) {
        // if there is an image, upload it to storage
        const storage = getStorage();
        const imageFileName = `party_${Date.now()}.jpg`; // unique file name for the image 
        const imageRef = storageRef(storage, imageFileName);

        // upload the image file
        try {
          const response = await fetch(partyData.partyImage);
          const blob = await response.blob();

          // set content to jpeg
          const metadata = {
            contentType: 'image/jpeg',
          };

          await uploadBytes(imageRef, blob, metadata);
          const imageUrl = await getDownloadURL(imageRef);

          //ppdate the new post's data withimage url
          partyData.partyImage = imageUrl;
        } catch (error) {
          console.error('Error uploading image', error);
          throw error;
        }
      }

      //update the new post's data
      await set(partyRef, {
        party: partyData.party,
        partyBio: partyData.partyBio,
        partyImage: partyData.partyImage,
        timestamp: { '.sv': 'timestamp' }
      });

      // Clear the input fields
      setPresentPartyTitle("");
      setPresentPartyBio("");
      setPresentPartyImage("");

      onClose();
    } catch (error) {
      console.error('Error while adding a new party:', error);
      Alert.alert('Error while adding a new party. Please try again later.');
    }
  }

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      console.log('Permission to access the media library is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        setPresentPartyImage(selectedAsset.uri);
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Button onPress={onClose}></Button>
          <Text style={styles.title}>Create your post!</Text>
          <TextInput
            placeholder="Party Title"
            value={presentPartyTitle}
            style={[styles.inputTitle, styles.text]}
            keyboardType="default"
            multiline={true}
            onChangeText={(text) => {
              setPresentPartyTitle(text);
            }}
          />
          <TextInput
            placeholder="Party Bio"
            value={presentPartyBio}
            style={[styles.inputText, styles.text]}
            keyboardType="default"
            multiline={true}
            onChangeText={(text) => {
              setPresentPartyBio(text);
            }}
          />
          {presentPartyImage ? (
            <Image source={{ uri: presentPartyImage }} style={styles.selectedImage}/>
          ) : null}
          <Button title="Select Image" onPress={handleImagePicker} />   
        </View>
      </TouchableWithoutFeedback>
      <View>
        <View>
          <Button onPress={handleAddNewPost}> Create Party </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default CreatePartyForm;

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