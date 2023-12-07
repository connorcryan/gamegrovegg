import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, Dimensions, ScrollView, TextInput, TouchableOpacity, Image } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { db } from '../../firebase-config';
import { onValue, ref } from 'firebase/database';
import { StyleSheet } from "react-native";
import { Colors, Posts, PartySearch, PostTextStyle } from "../../constants/styles";
import { Video } from 'expo-av';

const { width } = Dimensions.get("screen");

function DiscoverScreenDisplay() {
  const [posts, setPosts] = useState({});
  const [parties, setParties] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState(""); 

  const nav = useNavigation();

  const handlePostPress = (post) => {
    nav.navigate("PostDetail", {
      post,
      title: post.party,
    });
  };

  const handlePartyPress = (partyKey) => {
    const selectedParty = parties[partyKey];

    if (selectedParty && selectedParty.party) {
      console.log("Selected Party:", selectedParty);
      nav.navigate("PartyDetailScreen", {
        partyDetails: selectedParty,
      });
    } else {
      console.error("Invalid party object:", selectedParty);
    }
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
        setParties(Object.values(data));
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
      parties[key]?.party?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // func to filter posts based on keywords
  const filteredPosts = Object.keys(posts).filter(
    (key) =>
      posts[key]?.title?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      posts[key]?.party?.toLowerCase().includes(searchKeyword.toLowerCase())
  ).sort((key1, key2) => posts[key2].timestamp - posts[key1].timestamp);

  return (
    <SafeAreaView style={styles.containerWrapper}>
      <TextInput
        style={styles.searchInput} 
        placeholder="Search by Party or Keyword..."
        value={searchKeyword}
        onChangeText={(text) => setSearchKeyword(text)}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredParties.length > 0 && (
          <View style={styles.partiesSection}>
            <Text style={styles.heading}>Parties</Text>
            {Object.keys(parties).map((partyKey) => (
              <TouchableOpacity
                key={partyKey}
                style={styles.partyContainer}
                onPress={() => handlePartyPress(partyKey)}
              >
                <Text style={styles.partyName}>{parties[partyKey]?.party}</Text>
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
    justifyContent: "center",
    backgroundColor: Colors.primary100,
  },
  scrollContent: {
    width: width,
    padding: 10,
    backgroundColor: Colors.primary100,
  },
  searchContainer: {
    ...PartySearch.searchContainer,
  },
  searchInput: {
    ...PartySearch.partySearch,
  },
  partiesSection: {
    ...PartySearch.partiesSection,
  },
  partyContainer: {
    ...PartySearch.partyContainer,
  },
  partyName: {
    ...PartySearch.partyName,
  },
  postContainer: {
    ...Posts.postContainer,
  },
  heading : {
    ...PostTextStyle.headings,
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

export default DiscoverScreenDisplay;