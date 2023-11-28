import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, Dimensions, ScrollView, TextInput, TouchableOpacity, Image } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { db } from '../../firebase-config';
import { onValue, ref } from 'firebase/database';
import { StyleSheet } from "react-native";
import { Colors } from "../../constants/styles";
import { Video } from 'expo-av';

const { width } = Dimensions.get("screen");

function DiscoverScreenDisplay() {
  const [posts, setPosts] = useState({});
  const [parties, setParties] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState(""); // State to store the search keyword

  const nav = useNavigation();

  const handlePostPress = (post) => {
    nav.navigate("PostDetail", {
      post,
      title: post.party,
    });
  };

  const handlePartyPress = (party) => {
    console.log("Selected Party:", party);
    nav.navigate("PartyDetailScreen", {
      party,
    });
  };

  useEffect(() => {
    const unsubscribe = onValue(ref(db, "posts"), (querySnapShot) => {
      if (querySnapShot.exists()) {
        let data = querySnapShot.val() || {};
        setPosts(data);
      } else {
        console.log("⛔️ Object is falsy");
      }
    });

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
      unsubscribe();
      unsubscribeParties();
    };
  }, []);

  // func to filter parties
  const filteredParties = Object.keys(parties).filter(
    (key) =>
      (searchKeyword !== "") &
      parties[key].party.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // func to filter posts based on keywords
  const filteredPosts = Object.keys(posts).filter(
    (key) =>
      posts[key].title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      posts[key].party.toLowerCase().includes(searchKeyword.toLowerCase())
  ).sort((key1, key2) => posts[key2].timestamp = posts[key1].timestamp);

  return (
    <SafeAreaView style={styles.containerWrapper}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by party"
        value={searchKeyword}
        onChangeText={(text) => setSearchKeyword(text)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredParties.length > 0 && (
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
        {filteredPosts.length > 0 ? (
          filteredPosts.map((key) => (
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
          ))
        ) : (
          <Text>No posts match the search criteria...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

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
  postImage: {
    width: 70,
    height: 70,
    borderRadius: 6,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  postVideo: {
    width: 70,
    height: 70,
    borderRadius: 6,
    position: 'absolute',
    top: 10,
    right: 10,
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

export default DiscoverScreenDisplay;