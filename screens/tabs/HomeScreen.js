import axios from 'axios';

import { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { AuthContext } from '../../components/store/auth-context';
import PostDisplay from '../../components/containers/PostDisplay';
import { Colors } from '../../constants/styles';

function HomeScreen() {
  const [fetchedMesage, setFetchedMessage] = useState("");

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  useEffect(() => {
    axios
      .get(
        "https://gamegrove-default-rtdb.europe-west1.firebasedatabase.app/.json?auth=" +
          token
      )
      .then((response) => {
        setFetchedMessage(response.data);
      });
  }, [token]);

  return (
    <View style={styles.rootContainer}>
      <ScrollView>
        <PostDisplay/>
      </ScrollView>
    </View>
  );
}

export default HomeScreen

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    //padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});