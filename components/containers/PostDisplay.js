import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { db } from '../../firebase-config';
import { onValue, ref } from 'firebase/database';
import { StyleSheet } from "react-native";
import { Colors } from "../../constants/styles";

const { width } = Dimensions.get("screen");

function TextPostDisplay() {

  const nav = useNavigation();
  const [posts, setPosts] = useState({});

  const handlePostPress = (post) => {
    nav.navigate('PostDetail', { 
      post,
    title: post.party });
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
      // Cleanup the listener when the component unmounts
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={styles.containerWrapper}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {Object.keys(posts).length > 0 ? (
          Object.keys(posts).map((key) => (
            <TouchableOpacity
              style={styles.postContainer}
              key={key}
              onPress={() => handlePostPress(posts[key])}
            >
              <View>
                <Text style={styles.title}>{posts[key].title}</Text>
                <Text style={styles.party}>{posts[key].party}</Text>
              </View>
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

export default TextPostDisplay;

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollContent: {
    width: width, 
    padding: 10,
    backgroundColor: Colors.primary100,
  },
  postContainer: {
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
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      paddingHorizontal: 5,
      paddingTop: 3,
      paddingBottom: 1,
      color: Colors.primary700,
    },
    party: {
      fontSize: 14,
      //fontWeight: 'bold',
      paddingHorizontal: 5,
      //paddingTop: 5,
      //paddingBottom: 5,
      color: Colors.primary700,
    },
    text: {
      fontSize: 16,
      paddingHorizontal: 5,
      paddingTop: 5,
      paddingBottom: 5,
      color: Colors.primary800,
  },
});