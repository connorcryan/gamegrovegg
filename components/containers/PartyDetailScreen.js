import React, {useEffect, useState} from "react";
import { db } from "../../firebase-config";

import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Colors, PostTextStyle, Posts } from "../../constants/styles";
import { Video } from 'expo-av';
import { orderByChild, ref, query, get } from "firebase/database";

const { width } = Dimensions.get("screen");

function PartyDetailScreen  ({route}) {
    const { partyDetails } = route.params;
    const nav = useNavigation();
    const [partyPosts, setPartyPosts] = useState([]);
    const [matchingParty, setMatchingParty] = useState(null);
    const [imageHeight, setImageHeight] = useState(0);

    const handlePostPress = (post) => {
      nav.navigate("PostDetail", {
        post,
        title: post.party,
      });
    };

    useEffect(() => {
      console.log("route.params:", route.params);
      console.log("partyDetails:", partyDetails);
      const fetchData = async () => {
        if (!partyDetails || !partyDetails.party) {
          console.error("Error: partyDetails or partyDetails.party is undefined");
          return;
        }
  
        console.log("Selected Party:", partyDetails);
  
        const partyRef = ref(db, 'parties');
        const partyQuery = query(partyRef, orderByChild('party'));
        try {
          const snapshot = await get(partyQuery);
  
          if (snapshot.exists()) {
            const parties = snapshot.val();
            const matchingParty = findMatchingParty(parties, partyDetails.party);
  
            if (matchingParty) {
              console.log("Matching Party Data:", matchingParty);
              setMatchingParty(matchingParty); 
              nav.setOptions({
                title: partyDetails.party,
              });
              fetchPartyPosts(matchingParty);
            } else {
              console.log("No party found with the name", partyDetails.party);
            }
          } else {
            console.log("No parties found");
          }
        } catch (error) {
          console.error("Error fetching party data", error);
        }
      };
  
      const findMatchingParty = (parties, partyName) => {
        for (const key in parties) {
          if (parties[key].party === partyName) {
            return parties[key];
          }
        }
        return null;
      };
  
      fetchData();
    }, [partyDetails?.party]);
  
    const fetchPartyPosts = async (matchingPartyData) => {
      try {
        if (matchingPartyData.posts) {
          // convert posts to an array
          const postsArray = Object.values(matchingPartyData.posts);
          setPartyPosts(postsArray);
        } else {
          console.log("No posts found for party", matchingPartyData.party);
        }
      } catch (error) {
        console.log("Error fetching posts", error);
      }
    };
    
  
    if (!partyDetails || !partyDetails.party) {
      return (
        <View>
          <Text>Error: Party details not available</Text>
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View >
        <Text style={styles.title}> Welcome to {partyDetails.party}!</Text>
          <View style={styles.partyContainer}>
          {matchingParty && matchingParty.partyImage && (
            <Image
              source={{ uri: matchingParty.partyImage }}
              style={{ ...styles.partyImage }}
            />
          )}
          {matchingParty && matchingParty.partyBio && (
            <Text style={styles.bio}>{matchingParty.partyBio}</Text>
          )}
          </View>
          <Text style={styles.sectionTitle}>Posts:</Text>
          {partyPosts.map((post) => (
            <TouchableOpacity
              key={post.postId}
              onPress={() => handlePostPress(post)}
              style={styles.postContainer}
            >
              <View style={styles.textContainer}>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.party}>{post.party}</Text>
              </View>
              {post.image && post.image.trim() !== "" ? (
                <Image
                  source={{ uri: post.image }}
                  style={styles.postImage}
                  onError={(error) => console.log("Image load error:", error)}
                />
              ) : null}
              {post.video && post.video.trim() !== "" ? (
                <Video
                  source={{ uri: post.video }}
                  style={styles.postVideo}
                  isLooping={false}
                  shouldPlay={false}
                  resizeMode="cover"
                />
              ) : null}
              <Text style={styles.text}>{post.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
}

export default PartyDetailScreen;

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
  sectionTitle: {
    ...PostTextStyle.headings,
  },
  postContainer: {
    ...Posts.postContainer,
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
  partiesSection: {
    width: width, 
    padding: 10,
    backgroundColor: Colors.primary100,
  },
  partyContainer: {
    flexDirection: 'row',
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
  },
  partyImage: {
    width: 100,
    height: 100,
    borderRadius: 6,
    // position: 'absolute',
    // top: 10,
    // left: 10,
  },
  bio: {
    // justifyContent: 'flex-end',
    // alignItems: 'flex-end',
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
    //fontSize: 16,
    paddingHorizontal: 5,
    paddingTop: 5,
    paddingBottom: 5,
    color: Colors.primary800,
  }
});