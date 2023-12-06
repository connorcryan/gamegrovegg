import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, Dimensions, ScrollView, TouchableOpacity, Image } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { db } from '../../firebase-config';
import { onValue, ref } from 'firebase/database';
import { StyleSheet } from "react-native";
import { Colors, Posts, PostTextStyle } from "../../constants/styles";
import { Video } from 'expo-av';

const { width } = Dimensions.get("screen");

function PostDisplay() {

  const nav = useNavigation();
  const [posts, setPosts] = useState({});

  const handlePostPress = (key, post) => {
    nav.navigate('PostDetail', { 
      post,
    title: post.party,
    postID: key });
  };

  useEffect(() => {
    const unsubscribe = onValue(ref(db, 'posts'), (querySnapShot) => {
      if (querySnapShot.exists()) {
        let data = querySnapShot.val() || {};
        setPosts(data);
      } else {
        console.log('⛔️ Object is falsy');
      }
    });

    return () => {
      
      unsubscribe();
    };
  }, []);

  //array of post keys
  const postKeys = Object.keys(posts);

  // sort posts by timestamps
  const sortedPostKeys = postKeys.sort((key1, key2) => posts[key2].timestamp - posts[key1].timestamp);

  return (
    <SafeAreaView style={styles.containerWrapper}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {sortedPostKeys.length > 0 ? (
          sortedPostKeys.map((key) => (
            <TouchableOpacity
              style={styles.postContainer}
              key={key}
              onPress={() => handlePostPress(key, posts[key])}
            >
              <View style={styles.textContainer}>
                <Text style={styles.title}>{posts[key].title}</Text>
                <Text style={styles.party}>{posts[key].party}</Text>
              </View>
              {posts[key].image && posts[key].image.trim() !== '' ? (
                <Image
                  source={{ uri: posts[key].image }}
                  style={styles.postImage}
                  onError={(error) => console.log('Image load error:', error)}
                />
              ) : null}
              {posts[key].video && posts[key].video.trim() !== '' ? (
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
          ))
        ) : (
          <Text>No posts created...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default PostDisplay;

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  scrollContent: {
    width: width,
    padding: 10,
    backgroundColor: Colors.primary100,
  },
  postContainer: {
    ...Posts.postContainer,
  },
  textContainer: {
    ...Posts.textContainer,
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