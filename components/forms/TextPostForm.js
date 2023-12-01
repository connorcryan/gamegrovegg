import { db } from '../../firebase-config';
import { ref, push, remove, set, get, onValue } from 'firebase/database';
import { useState, useContext, useEffect, useRef } from "react";
import { StyleSheet, TextInput, View, Dimensions, Text, SafeAreaView, TouchableWithoutFeedback, Keyboard, Alert, ScrollView, TouchableOpacity } from "react-native";
import { Colors } from "../../constants/styles";
import Button from '../ui/Button';
import { AuthContext } from '../store/auth-context';

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
        const userPostsRef = ref(db, `users/${userData.uid}/posts`);
        const partyRef = ref(db, `parties/${presentPostParty}`);
        const partySnapshot = await get(partyRef);

        if (!partySnapshot.exists()) {
          console.warn("Selected party does not exist in the database.");
          return;
        }

        const newUserPostRef = push(userPostsRef);
        set(newUserPostRef, {
          ...postDataWithUsername,
          ...postData,
          timestamp: { ".sv": "timestamp" },
        });

        const newPostRef = push(ref(db, `parties/${presentPostParty}/posts`));

        const postDataWithUsername = {
          ...postData,
          username: userData.username,
        };
        set(newPostRef, {
          ...postDataWithUsername,
          ...postData,
          timestamp: { ".sv": "timestamp" },
        });

        // Add post to the general Posts node
        const allPostsRef = ref(db, "posts");
        const newAllPostRef = push(allPostsRef);
        set(newAllPostRef, {
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

export default TextPostForm;

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