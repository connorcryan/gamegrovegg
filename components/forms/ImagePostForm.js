import { db } from '../../firebase-config';
import { ref, push, remove, set, get, onValue } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from '../store/auth-context';
import { StyleSheet, TextInput, View, Text, SafeAreaView, TouchableWithoutFeedback, Keyboard, Alert, Image, Dimensions, TouchableOpacity } from "react-native";
import { Colors } from "../../constants/styles";
import * as ImagePicker from 'expo-image-picker';
import Button from '../ui/Button';

const { width } = Dimensions.get("screen");

function ImagePostForm({onClose}) {
  
  const [presentPostTitle, setPresentPostTitle] = useState("");
  const [presentPostParty, setPresentPostParty] = useState("");
  const [presentPostImage, setPresentPostImage] = useState("");
  const [presentPostText, setPresentPostText] = useState("");
  const [selectedParty, setSelectedParty] = useState("");
  const [parties, setParties] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState(""); // State to store the search keyword
  const [partyListVisible, setPartyListVisible] = useState(true);
  const presentPostPartyInputRef = useRef(null);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const unsubscribeParties = onValue(ref(db, "parties"), (querySnapShot) => {
      if (querySnapShot.exists()) {
        let data = querySnapShot.val() || {};
        setParties(data);
      } else {
        console.log("⛔️ Object is falsy");
      }
    });

    return () => {
      // Cleanup the listener when the component unmounts
      unsubscribeParties();
    };
  }, []);

  // func to filter parties
  const filteredParties = Object.keys(parties).filter(
    (key) =>
      (searchKeyword !== "") &
      parties[key].party.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  useEffect(() => {
    if (selectedParty) {
      setPresentPostParty(selectedParty);
    }
  }, [selectedParty]);

  const handlePartyPress = (party) => {
    setSelectedParty(party.party);
    setPartyListVisible(false);

    if (presentPostPartyInputRef.current) {
      presentPostPartyInputRef.current.setNativeProps({ text: party.party });
    }
  };

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

  async function addNewPost(postData) {
    const userData = authCtx.userData;
  
    if (!userData || !userData.username) {
      console.warn('User data is not available or does not contain a username.');
      return;
    }
  
    try {
      const userPostsRef = ref(db, `users/${userData.uid}/posts`);
      const partyRef = ref(db, `parties/${presentPostParty}`);
      const partySnapshot = await get(partyRef);
  
      if (!partySnapshot.exists()) {
        console.warn('Selected party does not exist in the database.');
        return;
      }

      const newUserPostRef = push(userPostsRef);
        set(newUserPostRef, {
          ...postDataWithUsername,
          ...postData,
          timestamp: { ".sv": "timestamp" },
        });
  
      const newPostRef = push(ref(db, `parties/${presentPostParty}/posts`));
      const imageFileName = `post_${Date.now()}.jpg`;
  
      const storage = getStorage();
      const imageRef = storageRef(storage, imageFileName);
  
      const response = await fetch(presentPostImage);
      const blob = await response.blob();
  
      const metadata = {
        contentType: 'image/jpeg',
      };
  
      await uploadBytes(imageRef, blob, metadata);
      const imageUrl = await getDownloadURL(imageRef);
  
      const postDataWithUsername = { ...postData, username: userData.username };
  
      set(newPostRef, {
        ...postDataWithUsername,
        image: imageUrl,
        timestamp: { '.sv': 'timestamp' },
      });

      // Add post to the general Posts node
      const allPostsRef = ref(db, "posts");
      const newAllPostRef = push(allPostsRef);
      set(newAllPostRef, {
        ...postDataWithUsername,
        image: imageUrl,
        timestamp: { ".sv": "timestamp" },
      });
  
      setPresentPostTitle('');
      setPresentPostText('');
      setPresentPostParty('');
      setPresentPostImage('');
  
      onClose();
    } catch (error) {
      console.error('Error adding new post', error);
      // Handle error appropriately (e.g., show an error message to the user)
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
        <TextInput
            ref={presentPostPartyInputRef}  
            style={[styles.inputTitle, styles.text]}
            placeholder="Search by party"
            value={searchKeyword}
            onChangeText={(text) => {
              setSearchKeyword(text);
              setPartyListVisible(true); // Show the party list when typing
            }}
          />
          {partyListVisible && filteredParties.length > 0 && (
          <View style={styles.partiesSection}>
            <Text style={styles.sectionTitle}>Parties</Text>
            {filteredParties.map((key) => (
              <TouchableOpacity
                key={key}
                style={styles.partyContainer}
                onPress={() => handlePartyPress(parties[key])}
                
              >
                <Text style={styles.partyName}>{parties[key]?.party}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
    },
    partiesSection: {
      width: width, 
      padding: 10,
      backgroundColor: Colors.primary100,
    },
    partyContainer: {
      marginBottom: 10,
      borderRadius: 12,
      backgroundColor: Colors.primary50,
      padding: 10,
      elevation: 2,
      shadowColor: 'black',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    partyName: {
      fontSize: 16,
        paddingHorizontal: 5,
        paddingTop: 5,
        paddingBottom: 5,
        color: Colors.primary800,
    }
});