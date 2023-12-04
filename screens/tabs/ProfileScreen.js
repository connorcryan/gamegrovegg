import { db } from "../../firebase-config";
import { ref, onValue, update } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { AuthContext } from '../../components/store/auth-context';
import { Colors, Posts, PostTextStyle } from "../../constants/styles";
import * as ImagePicker from 'expo-image-picker';
import UserProfileBio from '../../components/containers/UserProfileBio';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get("screen");

function ProfileScreen({username}) {

  const authCtx = useContext(AuthContext);
  
  console.log("Received username prop:", username);

  const nav = useNavigation();
  const [posts, setPosts] = useState({});
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [tempProfileImage, setTempProfileImage] = useState(null);

  const handlePostPress = (post) => {
    nav.navigate('PostDetail', { 
      post,
    title: post.party });
  };

  useEffect(() => {
    if ( authCtx.userData && authCtx.userData.uid) {
      const userPostsRef = ref(db, `users/${authCtx.userData.uid}/posts`);

      const unsubscribe = onValue(userPostsRef, (snapshot) => {
        if (snapshot.exists()) {
          let data = snapshot.val() || {};
          setPosts(data);
        } else {
          console.log('object is false');
        }
    });

    return () => {
      // Cleanup the listener when the component unmounts
      unsubscribe();
      };
    }
  }, [authCtx.userData]);

  useEffect(() => {
    if (authCtx.userData && authCtx.userData.uid) {
      // ref for user bio
      const userBioRef = ref(db, `users/${authCtx.userData.uid}/userBio`);
      const bioUnsubscribe = onValue(userBioRef, (snapshot) => {
        if (snapshot.exists()) {
          const userBio = snapshot.val().bio;
          setBio(userBio);
        } else {
          // handler incase bio is empty
          setBio('');
        }
      });
  
      // ref for profile image
      const userProfileImageRef = ref(db, `users/${authCtx.userData.uid}/profileimage`);
      const profileImageUnsubscribe = onValue(userProfileImageRef, (snapshot) => {
        if (snapshot.exists()) {
          const imageUrl = snapshot.val().imageUrl;
          setProfileImage(imageUrl);
        } else {
          // case is there is no image availbe 
          setProfileImage(null);
        }
      });
  
      return () => {
        //cleanup listeners
        bioUnsubscribe();
        profileImageUnsubscribe();
      };
    }
  }, [authCtx.userData]);
  

  useLayoutEffect(() => {
    nav.setOptions({
      headerTitle: username || "Profile"
    });
  }, [nav, username]);

  const handleBioChange = (newBio) => {
    setBio(newBio);
  };

  const handleSaveBio = async () => {
    // save user bio to the database
    await update(ref(db, `users/${authCtx.userData.uid}/userBio`), { bio });
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      const imageFileName = `profile_${Date.now()}.jpg`;
      const storage = getStorage();
      const imageStorageRef = storageRef(storage, imageFileName);

      const response = await fetch(result.uri);
      const blob = await response.blob();

      const metadata = {
        contentType: 'image/jpeg',
      };

      await uploadBytes(imageStorageRef, blob, metadata);
      const imageUrl = await getDownloadURL(imageStorageRef);

      setProfileImage(imageUrl);
      //save url to database 
      await update(ref(db, `users/${authCtx.userData.uid}/profileimage`), { imageUrl });
    }
  };

  const startImageEditing = () => {
    setIsEditingImage(true);
  };

  const cancelImageEditing = () => {
    setIsEditingImage(false);
    setTempProfileImage(null);
  };

  const handleImageIconPress = async () => {
    if (!isEditingImage && !profileImage) {
      // activate the image picker when the icon is pressed and no image is set
      const result = await pickImage(); 
      if (!result.canceled) {
        // display the selected image temporarily
        setTempProfileImage(result.uri);
        startImageEditing();
      }
    } else if (!isEditingImage && profileImage) {
      //edit if there is an image already set
      startImageEditing(); 
    } else {
      // cancel editing if the icon is pressed
      cancelImageEditing(); 
    }
  };

  // array of post keys
  const postKeys = Object.keys(posts);

  // sort posts based by their tiemstamps
  const sortedPostKeys = postKeys.sort((key1, key2) => posts[key2].timestamp - posts[key1].timestamp);

  return (
    <SafeAreaView style={styles.containerWrapper}> 
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.containerWrapper}>
        <View style={styles.profileInfoContainer}>
          <View style={styles.profileImageContainer}>
            <View style={styles.imageWrapper}>
              {tempProfileImage || profileImage ? (
                <Image
                  source={{ uri: tempProfileImage || profileImage }}
                  style={styles.profileImage}
                />
              ) : null}
            </View>
          </View>
          <View style={styles.buttonWrapper}>
              <TouchableOpacity
                onPress={handleImageIconPress}
                style={styles.editButton}
                
              >
                <AntDesign
                  name={isEditingImage ? "close" : "camerao"}
                  size={24}
                  color={Colors.primary800}
                />
              </TouchableOpacity>
              {isEditingImage && (
                <TouchableOpacity
                  onPress={pickImage}
                  style={styles.confirmButton}
                >
                  <AntDesign name="check" size={24} color={Colors.primary800} />
                </TouchableOpacity>
              )}
            </View>
        <UserProfileBio
          bio={bio}
          onBioChange={handleBioChange}
          onSaveBio={handleSaveBio}
        />
      </View>
        {sortedPostKeys.map((key) => (
          <TouchableOpacity
            style={styles.postContainer}
            key={key}
            onPress={() => handlePostPress(posts[key])}
          >
            <View style={styles.textContainer}>
              <Text style={styles.title}>{posts[key].title}</Text>
              <Text style={styles.party}>{posts[key].party}</Text>
            </View>
            {posts[key].image && posts[key].image.trim() !== "" ? (
              <Image
                source={{ uri: posts[key].image }}
                style={styles.postImage}
                onError={(error) => console.log("Image load error:", error)}
              />
            ) : null}
            {posts[key].video && posts[key].video.trim() !== "" ? (
              <Video
                source={{ uri: posts[key].video }}
                style={styles.postVideo}
                isLooping={false} // set to true if you want the video to loop
                shouldPlay={false}
                //useNativeControls
                resizeMode="cover"
              />
            ) : null}
            <Text style={styles.text}>{posts[key].text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

export default ProfileScreen

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.primary100,
  },
  scrollContent: {
    width: width,
    padding: 10,
    backgroundColor: Colors.primary100,
  },
  profileInfoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary50,
    paddingBottom: 20,
    borderRadius: 30,
    marginBottom: 10,
  },
  profileImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  imageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 180,
    height: 180,
    borderRadius: 100,
    paddingBottom: 20,
  },
  buttonWrapper: {
    position: 'absolute', 
    right:70, 
    top: 20,
  },
  postContainer: {
    ...Posts.postContainer 
  },
  textContainer: {
    ...Posts.textContainer
  },
  title: {
    ...PostTextStyle.postTitle,
  },
  party: {
    ...PostTextStyle.postPartyName,
  },
  text: {
    ...PostTextStyle.postTextContent,
  },
  postImage: {
    ...Posts.postImage,
  },
  postVideo: {
    ...Posts.postVideo,
  },
});