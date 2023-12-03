import { db } from '../../firebase-config';
import { ref, push, remove, set, get, onValue } from 'firebase/database';
import { useState, useContext, useEffect, useRef } from "react";
import { StyleSheet, TextInput, View, Dimensions, Text, SafeAreaView, TouchableWithoutFeedback, Keyboard, Alert, ScrollView, TouchableOpacity } from "react-native";
import { Colors, FormStyles, PostTextStyle, PartySearch } from "../../constants/styles";
import Button from '../ui/Button';
import { AuthContext } from '../store/auth-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get("screen");

function TextPostForm({onClose}) {
  
  const [presentPostTitle, setPresentPostTitle] = useState("");
  const [presentPostText, setPresentPostText] = useState("");
  const [presentPostParty, setPresentPostParty] = useState("");
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
    // Update the selected party and the input field
    setSelectedParty(party.party);
    //setPresentPostParty(party.party);
    //setSearchKeyword("");
    setPartyListVisible(false);

    if (presentPostPartyInputRef.current) {
      presentPostPartyInputRef.current.setNativeProps({ text: party.party });
    }
  };
  
  const handleAddNewPost = () => {
    if (presentPostTitle.trim() !== '' && presentPostText.trim() !== '' && presentPostParty.trim() !== '') {
      // All fields are not empty, proceed with adding the post
      addNewPost({ title: presentPostTitle, text: presentPostText, party: presentPostParty });
      // Close the modal
      onClose();
    } else {
      Alert.alert('Please ensure all inputs are not empty');
      console.log('THIS IS NOT WOKRING');
    }
  };

  async function addNewPost(postData) {
    const userData = authCtx.userData;
    
    if (userData && userData.username) {
      // Include the username in the post data
      postData.username = userData.username;
      
      try {
        const partyRef = ref(db, `parties/${presentPostParty}`);
        const partySnapshot = await get(partyRef);

        if (!partySnapshot.exists()) {
          console.warn("Selected party does not exist in the database.");
          return;
        }

        //gen unique key for posts
        const postId = push(ref(db, "posts")).key;

        const postDataWithUsername = {
          ...postData,
          postID: postId,
          username: userData.username,
        };

        const userPostsRef = ref(db, `users/${userData.uid}/posts/${postId}`);
        //const newUserPostRef = push(userPostsRef);
        set(userPostsRef, {
          ...postDataWithUsername,
          ...postData,
          timestamp: { ".sv": "timestamp" },
        });

        const partyPostRef = ref(db, `parties/${presentPostParty}/posts/${postId}`);
        set(partyPostRef, {
          ...postDataWithUsername,
          ...postData,
          timestamp: { ".sv": "timestamp" },
        });

        // Add post to the general Posts node
        const allPostsRef = ref(db, `posts/${postId}`);
        //const newAllPostRef = push(allPostsRef);
        set(allPostsRef, {
          ...postDataWithUsername,
          party: presentPostParty,
          timestamp: { ".sv": "timestamp" },
        });

        // Clear the input fields
        setPresentPostTitle("");
        setPresentPostText("");
        setPresentPostParty("");

        onClose();
      } catch(error) {
      console.error('Error adding new post', error);
    }
    }
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
              placeholder="Party..."
              placeholderTextColor={Colors.gray500}
              ref={presentPostPartyInputRef}
              style={[styles.inputTitle, styles.text]}
              value={searchKeyword}
              onChangeText={(text) => {
                setSearchKeyword(text);
                setPartyListVisible(true); // Show the party list when typing
              }}
            />
            {partyListVisible && filteredParties.length > 0 && (
              <View style={styles.partiesSection}>
                <Text style={styles.partyTitle}>Parties</Text>
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
              placeholder="Post Title..."
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
            <TouchableOpacity
              onPress={handleAddNewPost}
              style={styles.createPostButton}
            >
              <Text style={styles.buttonText}>Create Post</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
}

export default TextPostForm;

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
    button: {
      ...FormStyles.button,
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