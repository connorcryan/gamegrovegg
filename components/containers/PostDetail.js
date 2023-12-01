import React, {useContext, useEffect, useState} from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableHighlight, Alert, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../constants/styles";
import { Video } from 'expo-av';
import { AuthContext } from "../store/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";


function PostDetailScreen({ route }) {
  const { post, title } = route.params;
  const nav = useNavigation();
  const authContext = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [imageHeight, setImageHeight] = useState(0);
  const [commentInput, setCommentInput] = useState(""); 
  const [comments, setComments] = useState([]);

  useEffect(() => {
    console.log('authContext.user:', authContext.user);
    console.log('post.username:', post.username);

    // use userData.username
    const username = userData ? userData.username : null;

    nav.setOptions({
      title: title,
      headerTitle: () => (
        <Text style={styles.headerTitle} onPress={navigateToPartyDetailScreen}>
          {post.party}
        </Text>
      ),
      headerRight: () => {
        // use username from userData
        if (!userData || post.username !== userData.username) {
          return null; // or render a loading state
        }

        return (
          <TouchableHighlight
            underlayColor="transparent"
            onPress={() => handleDeletePress()}
          >
            <Text style={styles.deleteIcon}>Delete</Text>
          </TouchableHighlight>
        );
      },
    });
  }, [title, post.party, post.username, userData]);

  useEffect(() => {
    if (post.image) {
      Image.getSize(post.image, (width, height) => {
        // calc aspect ratio to get image height
        const aspectRatio = width / height;
        setImageHeight(500); // adjust the height as needed
      });
    }
  }, [post.image]);

  useEffect(() => {
    // Set userData from AsyncStorage
    AsyncStorage.getItem('userData')
      .then((userDataString) => {
        const parsedUserData = JSON.parse(userDataString);
        setUserData(parsedUserData || null); // Set null if userData is null or undefined
      })
      .catch((error) => {
        console.error('Error retrieving userData from AsyncStorage:', error);
      });
  }, []);

  useEffect(() => {
    // Load comments from the database here
    // You may need to have a function to fetch comments based on post ID
    // For example: fetchComments(post.id).then((data) => setComments(data));
  }, [post.id]);

  const navigateToPartyDetailScreen = () => {
    nav.navigate('PartyDetailScreen', { partyDetails: post });
  };

  const handleDeletePress = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'Delete', onPress: () => handleDeletePost() },
      ],
      { cancelable: true }
    );
  };

  const handleDeletePost = () => {
    // logic to delete the post from the database here
    nav.goBack();
  };

  const handleCommentPress = async () => {
    if (commentInput.trim() === "") {
      return; // Do not save empty comments
    }

    try {
      const newComment = {
        text: commentInput,
        username: userData.username,
        postId: post.id,
      };

      // save the comment to the database
      await addCommentToDatabase(newComment);

      // Clear the comment input field
      setCommentInput("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  async function addCommentToDatabase(commentData) {
    const userData = authContext.user;

    if( userData && userData.username) {
      commentData.username = userData.username;

      try {
        const commentId = push(ref(db, `comments/${commentData.postId}`)).key;

        const commentDataWithUsername = { 
          ...commentData,
          username: userData.username,
        };

        const postCommentsRef = ref(db, `posts/${commentData.postId}/comments/${commentId}`);
        set(postCommentsRef, {
          ...commentDataWithUsername,
          timestamp: {".sv": "timestamp"},
        });

        const userCommentsref = ref(db, `users/${userData.uid}/comments/${commentId}`);
        set(userCommentsref, {
          ...commentDataWithUsername,
          timestamp: {".sv": "timestamp"},
        });

        setCommentInput("");
      } catch (error){
        console.error('Error adding new comment', error);
      }
    }
  }


  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}> {post.title}</Text>
        {post.image && (
          <Image
            source={{ uri: post.image }}
            style={{ ...styles.postImage, height: imageHeight }}
          />
        )}
        {post.video && post.video.trim() !== "" && (
          <Video
            source={{ uri: post.video }}
            style={styles.postVideo}
            isLooping={false}
            shouldPlay={false}
            useNativeControls
            resizeMode="cover"
          />
        )}
        <Text style={styles.text}>{post.text}</Text>
        <Text style={styles.username}>{post.username}</Text>
      </View>
      <Text style={styles.subtitle}>Comments</Text>
      {userData?.username && (
        <View>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            value={commentInput}
            onChangeText={(text) => setCommentInput(text)}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleCommentPress} // Call your comment press handler here
          >
            <Text style={{ color: "white", textAlign: "center" }}>Comment</Text>
          </TouchableOpacity>
        </View>
      )}
      {comments.map((comment) => (
        <View key={comment.id}>
          <Text style={styles.comment}>{comment.text}</Text>
          <Text style={styles.commentUsername}>{comment.username}</Text>
        </View>
      ))}
      
    </ScrollView>
  );
}

export default PostDetailScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    backgroundColor: Colors.accent500,
    borderRadius: 12,
    // elevation: 2,
    // shadowColor: 'white',
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
    color: Colors.white,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
    color: Colors.primary700,
  },
  postImage: {
    width: '100%',
    marginBottom: 10,
  },
  postVideo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 18,
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 10,
    color: Colors.primary800,
  },
  username: {
    fontSize: 16,
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 10,
    color: Colors.primary700,
  },
  button: {
    borderRadius: 12,
    padding: 5,
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  deleteIcon: {
    color: Colors.danger, // You can define a danger color in your Colors constant
    marginRight: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
    color: Colors.primary700,
  },
  comment: {
    fontSize: 16,
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 5,
    color: Colors.primary800,
  },
  commentUsername: {
    fontSize: 14,
    paddingHorizontal: 15,
    paddingBottom: 10,
    color: Colors.primary700,
  },
  commentInput: {
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary700,
    marginBottom: 10,
  },
});