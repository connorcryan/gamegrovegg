import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../constants/styles";
import { Video } from 'expo-av';

function PartyDetailScreen  ({route}) {
    const { party } = route.params;
    const nav = useNavigation();

    const [imageHeight, setImageHeight] = useState(0);

    useEffect(() => {
        nav.setOptions({
          title: party.party, // Assuming you have a party name in your party object
        });
      }, [party.party]);

    useEffect(() => {
        // add image size logic later
    }, [party.image]);

    return (
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.title}> {party.party}</Text>
            {party.image && (
              <Image source={{ uri: party.image }} style={{ ...styles.partyImage, height: imageHeight}} />
            )}
            <Text style={styles.bio}>{party.bio}</Text>
            {/* Add any other party details you want to display */}
          </View>
        </ScrollView>
      );
}

export default PartyDetailScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    backgroundColor: Colors.accent500,
    borderRadius: 12,
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
  bio: {
    fontSize: 18,
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 10,
    color: Colors.primary800,
  },
  partyImage: {
    width: '100%',
    marginBottom: 10,
  },

});