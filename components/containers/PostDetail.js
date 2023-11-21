import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../constants/styles";

function PostDetailScreen({ route }) {
  const { post, title } = route.params;
  const nav = useNavigation();

  const [imageHeight, setImageHeight] = useState(0);

  useEffect(() => {
    nav.setOptions({
      title: title,
    });
  }, [title]);

  useEffect(() => {
    if (post.image) {
      Image.getSize(post.image, (width, height) => {
        // Calculate the aspect ratio to set the image height
        const aspectRatio = width / height;
        setImageHeight(500); // Adjust the height as needed based on the aspect ratio
      });
    }
  }, [post.image]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}> {post.title}</Text>
        {post.image && (
          <Image source={{ uri: post.image }} style={{ ...styles.postImage, height: imageHeight}} />
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