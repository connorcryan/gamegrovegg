import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableHighlight } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../constants/styles";
import { Video } from 'expo-av';


function PostDetailScreen({ route }) {
  const { post, title } = route.params;
  const nav = useNavigation();

  const [imageHeight, setImageHeight] = useState(0);

  useEffect(() => {
    nav.setOptions({
      title: title,
      headerTitle: () => (
        <Text style={styles.headerTitle} onPress={() => navigateToPartyDetailScreen()}>
          {post.party}
        </Text>
      ),
    });
  }, [title, post.party]);

  useEffect(() => {
    if (post.image) {
      Image.getSize(post.image, (width, height) => {
        // calc aspect ratio to get image height
        const aspectRatio = width / height;
        setImageHeight(500); // adjust the height as needed
      });
    }
  }, [post.image]);

  const navigateToPartyDetailScreen = () => {
    nav.navigate('PartyDetailScreen', { partyDetails: post });
  };

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
});