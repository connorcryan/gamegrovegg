import { db } from '../../firebase-config';
import { ref, push, remove, set, get, onValue } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from '../store/auth-context';
import { StyleSheet, TextInput, View, Text, SafeAreaView, TouchableWithoutFeedback, Keyboard, Alert, Image, Dimensions, TouchableOpacity } from "react-native";
import { Colors, FormStyles, PostTextStyle, PartySearch } from "../../constants/styles";
import * as ImagePicker from 'expo-image-picker';
import Button from '../ui/Button';
import { Ionicons } from '@expo/vector-icons';

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
      //unique key for the post
      const postId = push(ref(db, `posts/${postId}`)).key;

      const userPostsRef = ref(db, `users/${userData.uid}/posts/${postId}`);
      const partyPostRef = ref(db, `parties/${presentPostParty}/posts/${postId}`);
      const newAllPostRef = ref(db, `posts/${postId}`);

      const partyRef = ref(db, `parties/${presentPostParty}`);
      const partySnapshot = await get(partyRef);
  
      if (!partySnapshot.exists()) {
        console.warn('Selected party does not exist in the database.');
        return;
      }
      
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
  
      const postDataWithUsername = { ...postData, username: userData.username, postID: postId };

      set(userPostsRef, {
        ...postDataWithUsername,
        timestamp: { ".sv": "timestamp" },
      });
  
      set(partyPostRef, {
        ...postDataWithUsername,
        timestamp: { ".sv": "timestamp" },
      });
  
      set(newAllPostRef, {
        ...postDataWithUsername,
        party: presentPostParty,
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
      <View>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.formContainer}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="md-close" size={32} />
            </TouchableOpacity>
            <Text style={styles.title}>Create your post!</Text> 
        <TextInput
            ref={presentPostPartyInputRef}  
            style={[styles.inputTitle, styles.text]}
            placeholder="Party..."
            placeholderTextColor={Colors.gray500}
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
            placeholderTextColor={Colors.gray500}
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
            placeholderTextColor={Colors.gray500}
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
          
          <TouchableOpacity
              onPress={handleImagePicker}
              style={styles.createPostButton}
            >
              <Text style={styles.buttonText}>Select Image</Text>
            </TouchableOpacity>
          <TouchableOpacity
              onPress={handleAddNewPost}
              style={styles.createPostButton}
            >
              <Text style={styles.buttonText}>Create Post</Text>
           </TouchableOpacity>   
        </View>
        
      </TouchableWithoutFeedback>
      <View>
        {/* <View style={styles.button}>
          <Button
            title="Remove Post"
            onPress={removePost}
            color={'red'}
            style={{ marginTop: 20 }}
          />
        </View> */}
      </View>
      </View>
    </SafeAreaView>
  );
}

export default ImagePostForm;

const styles = StyleSheet.create({
  closeButton: {
    ...FormStyles.closeButton
  },
  createPostButton: {
    ...FormStyles.createPostButton,
  },
  buttonText: {
    ...FormStyles.buttonText,
  },
    container: {
      ...FormStyles.container,
    },
    formContainer: {
      ...FormStyles.formContainer,
    },
    title: {
      ...FormStyles.title,
    },
    text: {
      ...FormStyles.text,
  },
    inputTitle: {
      ...FormStyles.inputTitle,
    },
    inputText: {
      ...FormStyles.inputText,
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderWidth: 4,
    borderColor: Colors.primary200,
    borderRadius: 10,
    resizeMode: 'cover',
    marginVertical: 10,
  },

    partyTitle: {
      ...PostTextStyle.headings,
    },
    partiesSection: {
      ...FormStyles.partiesSection,
    },
    partyContainer: {
      ...FormStyles.partyContainer,
    },
    partyName: {
      ...PartySearch.partyName,
    }
});