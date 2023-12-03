import { db } from "../../firebase-config";
import { push, ref, set, serverTimestamp, onValue } from "firebase/database";
import React, {useContext, useEffect, useState} from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableHighlight, Alert, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../constants/styles";
import { Video } from 'expo-av';
import { AuthContext } from "../store/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";


function PostDetailScreen({ route }) {
  const { post, title} = route.params; //contains data from slected post
  const postID = post ? post.postID : null; //variable for postKey from route params
  const nav = useNavigation(); // for navigation to parties
  const authContext = useContext(AuthContext); //authctx contains autenticated ifo and userdata
  const [userData, setUserData] = useState(null); //get user data
  const [imageHeight, setImageHeight] = useState(0); //for image posts  
  //adding comments
  const [commentInput, setCommentInput] = useState(""); 
  const [comments, setComments] = useState([]);
  //comment replies
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [replyInput, setReplyInput] = useState("");

  useEffect(() => {
    // use userData.username
    const username = userData ? userData.username : null;
    //will navigate to party based on the title of the party on the post if selected
    nav.setOptions({
      title: title,
      headerTitle: () => (
        <Text style={styles.headerTitle} onPress={navigateToPartyDetailScreen}>
          {post.party}
        </Text>
      ),
      //this displays a delete button if it is the user's post
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
  //this checks if the post has an image and if it does it renders it
  useEffect(() => {
    if (post.image) {
      Image.getSize(post.image, (width, height) => {
        // calc aspect ratio to get image height
        const aspectRatio = width / height;
        setImageHeight(500); // adjust the height as needed
      });
    }
  }, [post.image]);

  //this is to retrieve the userData from async storage
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

  //this checks the slected posts for comments based on the postID which is equaled 
  //to the unique key in firebase database
  useEffect(() => {
    const postCommentsRef = ref(db, `posts/${postID}/comments`);
  
    const unsubscribe = onValue(postCommentsRef, (snapshot) => {
      const commentsData = snapshot.val();
      if (commentsData) {
        // Convert comments object to an array
        const commentsArray = Object.keys(commentsData).map((key) => ({
          id: key,
          ...commentsData[key],
        }));
        setComments(commentsArray);
      } else {
        setComments([]);
      }
    });
  
    return () => {
      unsubscribe();
    };
  }, [postID]);
  

  const navigateToPartyDetailScreen = () => {
    nav.navigate('PartyDetailScreen', { partyDetails: post });
  };

  //basi delete func that handles the delete process and calls the delete function
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

  //func that deletes posts from the database and returns to previous screen
  const handleDeletePost = () => {
    // logic to delete the post from the database here
    nav.goBack();
  };

  //handler for when a user presses the comment button
  const handleCommentPress = async () => {
    if (commentInput.trim() === "") {
      return; // Do not save empty comments
    }
    //comment data created
    try {
      const newComment = {
        text: commentInput,
        username: userData.username,
        postID: postID,
      };

      // save the comment to the database
      await addCommentToDatabase(newComment);

      // clear the comment input field once done
      setCommentInput("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleAddReply = async (commentId) => {
    //dont save empty replies
    if (replyInput.trim() === "") {
      return; 
    }
  
    try {
      // reply object data
      const newReply = {
        text: replyInput,
        username: userData.username,
        timestamp: serverTimestamp(),
      };
  
      //find the comment in the db
      const selectedComment = comments.find((comment) => comment.id === commentId);
      console.log("selected comment is:", selectedComment);
      // add the reply to slected comment in db
      if (selectedComment) {
        if (!selectedComment.replies) {
          selectedComment.replies = {};
        }
        const replyId = push(ref(db, `posts/${postID}/comments/${commentId}/replies`)).key;

        set(ref(db, `posts/${postID}/comments/${commentId}/replies/${replyId}`), newReply);
        setComments([...comments]);

        //clear input
        setReplyInput("");
      }
      
      //reset the selected comment
      setSelectedCommentId(null);
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  //this function adds the comments to the database
  async function addCommentToDatabase(commentData) {
    console.log('addCommentToDatabse is being called');
    const userData = authContext.userData;
    console.log('userData:', userData);
    //only works if user is logged in, saves comment username as user's username
    if (userData && userData.username) {
      commentData.username = userData.username;
  
      try {
        console.log('trying to get ref to database');
        //ref to the post the user is commenting on
        const postCommentsRef = ref(db, `posts/${commentData.postID}/comments`);
        console.log('Post to comment on:', postCommentsRef);
        const newCommentRef = push(postCommentsRef);
        
        //stores comment data along with time stamp and username
        const commentDataWithUsername = {
          ...commentData,
          username: userData.username,
          timestamp: serverTimestamp(),
          //replies: [],
        };

        console.log('comment data:', commentDataWithUsername);
  
        set(newCommentRef, commentDataWithUsername);
        //same again for storing the comments on the user's profile page
        const userCommentsRef = ref(db, `users/${userData.uid}/comments`);
        set(push(userCommentsRef), commentDataWithUsername);
  
        setCommentInput("");

        if (commentData.replyTo) {
          const parentCommentRef = ref(db, `posts/${commentData.postID}/comments/${commentData.replyTo}`);
          const parentCommentSnapshot = await get(parentCommentRef);
          const parentCommentData = parentCommentSnapshot.val();
    
          if (parentCommentData && !parentCommentData.replies) {
            parentCommentData.replies = [];
          }
    
          const replyId = push(parentCommentRef.child('replies')).key;
    
          const replyData = {
            text: commentData.text,
            username: userData.username,
            timestamp: serverTimestamp(),
          };
    
          set(ref(parentCommentRef.child(`replies/${replyId}`)), replyData);
          set(ref(parentCommentRef, 'replies'), commentDataWithReplies.replies);
        }
      } catch (error) {
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
      {Object.values(comments).map((comment) => (
        <View style={styles.commentContainer} key={comment.id}>
          <Text style={styles.comment}>{comment.text}</Text>
          <Text style={styles.commentUsername}>{comment.username}</Text>
          <TouchableOpacity onPress={() => setSelectedCommentId(comment.id)}>
            <Text style={styles.replyIcon}>Reply</Text>
          </TouchableOpacity>
          {comment.replies && typeof comment.replies === "object" && (
            <View style={styles.replyContainer}>
              {Object.values(comment.replies).map((reply) => (
                <View key={reply.id} style={styles.replyContainer}>
                  <Text style={styles.replyText}>{reply.text}</Text>
                  <Text style={styles.replyUsername}>{reply.username}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
      {selectedCommentId &&
        comments.find((comment) => comment.id === selectedCommentId) && (
          <View>
            <TextInput
              style={styles.replyInput}
              placeholder="Add a reply..."
              value={replyInput}
              onChangeText={(text) => setReplyInput(text)}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleAddReply(selectedCommentId)}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Add Reply
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
  commentContainer: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    backgroundColor: Colors.accent500,
    borderRadius: 12,
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
  replyText: {
    fontSize: 16,
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 5,
    color: Colors.primary800,
  },
  replyContainer: {
    paddingTop: 10,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    backgroundColor: Colors.error50,
    borderRadius: 12,
  },
  replyItem: {
    marginLeft: 20, // Adjust the indentation as needed
    marginBottom: 10, // Adjust the spacing between replies
  },
  replyUsername: {
    fontSize: 14,
    paddingHorizontal: 15,
    paddingBottom: 10,
    color: Colors.primary700,
  },
  replyInput: {
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary700,
    marginBottom: 10,
  },
});