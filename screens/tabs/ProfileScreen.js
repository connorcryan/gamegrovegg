import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function ProfileScreen({username}) {
  console.log("Received username prop:", username);
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Welcome, {username}!</Text>
      <Text>This is the profile screen!</Text>
    </View>
  );
}

export default ProfileScreen

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});