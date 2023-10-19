import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { db } from '../../firebase-config';
import { onValue, ref } from 'firebase/database';
import { StyleSheet } from "react-native";
import { Colors } from "../../constants/styles";

function TextPostDisplay() {
  const [posts, setPosts] = useState({});

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
    <SafeAreaView >
      <View>
        {Object.keys(posts).length > 0 ? (
          Object.keys(posts).map((key) => (
            <View 
            style={styles.container}
            key={key}>
              <Text style={styles.title}>{posts[key].title}</Text>
              <Text style={styles.text}>{posts[key].text}</Text>
            </View>
          ))
        ) : (
          <Text>No posts created...</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

export default TextPostDisplay;

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      borderRadius: 12,
      //marginBottom: 5,
      marginTop: 5,
      marginHorizontal: 5,
      backgroundColor: Colors.primary50,
      elevation: 2,
      shadowColor: 'white',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      paddingHorizontal: 10,
      paddingTop: 10,
      paddingBottom: 5,
      color: Colors.primary700,
    },
    text: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingTop: 5,
      paddingBottom: 10,
      color: Colors.primary800,
  },
});